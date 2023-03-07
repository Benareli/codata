import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';

import { Id } from 'src/app/models/settings/id.model';
import { IdService } from 'src/app/services/settings/id.service';
import { Sale } from 'src/app/models/transaction/sale.model';
import { SaleService } from 'src/app/services/transaction/sale.service';
import { Saledetail } from 'src/app/models/transaction/saledetail.model';
import { SaledetailService } from 'src/app/services/transaction/saledetail.service';
import { Log } from 'src/app/models/settings/log.model';
import { LogService } from 'src/app/services/settings/log.service';
import { Product } from 'src/app/models/masterdata/product.model';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';
import { Journal } from 'src/app/models/accounting/journal.model';
import { JournalService } from 'src/app/services/accounting/journal.service';

@Component({
  selector: 'app-invoicecreate-dialog',
  templateUrl: './invoicecreate-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class InvoicecreateDialogComponent implements OnInit {
  isSalU = false;
  isSalM = false;
  isAdm = false;
  isRes = false;

  partners?: Partner[];
  products?: Product[];
  customerString?: string;
  datqty?: any;
  datdate?: string;
  datduedate?: string;

  saleid?: string;
  saleHeader?: string;
  prefixes?: string;
  sdetailid: string[];
  productinv: string[];
  qrec: number[];
  productname: string[];
  uom: string[];
  priceunit: number[];
  tax: number[];
  discount: number[];
  qinv: number[];
  subtotal: number[];
  checked = false;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'qtydone', 'qtynobill', 'qty_inv'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;
  currentIndex1 = -1;

  constructor(
    public dialogRef: MatDialogRef<InvoicecreateDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private idService: IdService,
    private saleService: SaleService,
    private saledetailService: SaledetailService,
    private partnerService: PartnerService,
    private productService: ProductService,
    private journalService: JournalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if(this.data){
      this.retrieveSO();
    }
    this.datas = [{product:"",qty:"",price_unit:""}]
    this.dataSource.data = this.datas;
    this.datdate = new Date().toISOString().split('T')[0];;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="sale_user") this.isSalU=true;
      if(this.globals.roles![x]=="sale_manager") this.isSalM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isSalM || !this.isAdm) this.isRes = true;
    this.currentIndex1 = -1;
  }

  retrieveSO(): void {
    this.saleService.get(this.data)
      .subscribe(dataSO => {
        this.customerString = dataSO.customer._id;
        this.saleid = dataSO.sale_id;
        this.retrieveSODetail();
      })
  }

  retrieveSODetail(): void {
    this.saledetailService.getBySOId(this.saleid)
      .subscribe(SOD => {
        if(this.datas[0].product=='') this.datas.splice(0,1);
          for(let x=0;x<SOD.length;x++){
            this.datas.push(SOD[x]);
            this.datas[x].qty_rec = 0;
            this.dataSource.data = this.datas;
          }
        })
  }

  editSO(index: number): void {
  	if (this.datas[index].qty_rec > (this.datas[index].qty - this.datas[index].qty_done)) {
  		this.datas[index].qty_rec = (this.datas[index].qty - this.datas[index].qty_done);
  		this._snackBar.open("Kuantiti melebihi yang dipesan!", "Tutup", {duration: 5000});
  	}
  }

  changeDate(): void {
    for(let x=0; x<this.datas.length; x++){
      this.datas[x].date = this.datdate;
    }
  }

  changeDueDate(): void {
    for(let x=0; x<this.datas.length; x++){
      this.datas[x].duedate = this.datduedate;
    }
  }

  invoicerec(): void {
    for(let x=0; x<this.datas.length; x++){
      this.datas[x].qty_rec = this.datas[x].qty_done;
    }
  }

  invoiceall(): void {
    for(let x=0; x<this.datas.length; x++){
      this.datas[x].qty_rec = this.datas[x].qty - this.datas[x].qty_inv;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  checkInvoice() {
    this.checked = false;
    for(let z=0;z<this.datas.length;z++){
      if(this.datas[z].qty_rec > (this.datas[z].qty - this.datas[z].qty_inv)){
        this._snackBar.open("Jumlah yang di bill pada " + this.datas[z].product.name + " lebih besar!", "Tutup", {duration: 5000});
        this.checked = true;
        return;
      }
      if(z == this.datas.length - 1) {
        if(!this.checked){
          this.createInvoice();
          return;
        }else{
          return;
        }
      }
    }
  }

  createInvoice() {
    let y = 0;
    this.sdetailid = [];
    this.productinv = [];
    this.productname = [];
    this.uom = [];
    this.qrec = [];
    this.priceunit = [];
    this.tax = [];
    this.discount = [];
    this.qinv = [];
    this.subtotal = [];
    for(let x=0; x<this.datas.length; x ++){
      if(this.datas[x].qty_rec > 0){
        y = y + (Number(this.datas[x].qty_rec) / Number(this.datas[x].qty) * Number(this.datas[x].subtotal));
        this.sdetailid.push(this.datas[x].id);
        this.productinv.push(this.datas[x].product._id);
        this.productname.push(this.datas[x].product.name);
        this.qrec.push(this.datas[x].qty_rec);
        this.uom.push(this.datas[x].uom._id);
        this.priceunit.push(this.datas[x].price_unit);
        this.tax.push(this.datas[x].tax);
        this.qinv.push(this.datas[x].qty_inv);
        this.subtotal.push(this.datas[x].qty_rec / this.datas[x].qty * this.datas[x].subtotal);
        if(this.datas[x].discount){
          this.discount.push(this.datas[x].discount);
        }else{
          this.discount.push(0);
        }
      }
    }
    const journal = {
      amount: y, date: this.datdate, duedate: this.datduedate, origin: this.saleid, productinv: this.productinv, qrec: this.qrec,
      productname: this.productname, uom: this.uom, priceunit: this.priceunit, tax: this.tax, discount: this.discount, 
      partner: this.customerString, sdetail: this.sdetailid, qinv: this.qinv, subtotal: this.subtotal
    };
    this.journalService.createInv(journal)
      .subscribe(cbill => {
        this.dialogRef.close();
      })
  }
}
