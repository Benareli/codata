import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';

import { Id } from 'src/app/models/id.model';
import { IdService } from 'src/app/services/id.service';
import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Purchasedetail } from 'src/app/models/purchasedetail.model';
import { PurchasedetailService } from 'src/app/services/purchasedetail.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Journal } from 'src/app/models/journal.model';
import { JournalService } from 'src/app/services/journal.service';

@Component({
  selector: 'app-billcreate-dialog',
  templateUrl: './billcreate-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class BillcreateDialogComponent implements OnInit {
  isPurU = false;
  isPurM = false;
  isAdm = false;
  isRes = false;

  partners?: Partner[];
  products?: Product[];
  supplierString?: string;
  datqty?: any;
  datdate?: string;
  datduedate?: string;

  purchaseid?: string;
  purchaseHeader?: string;
  prefixes?: string;
  pdetailid: string[];
  productbill: string[];
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
    public dialogRef: MatDialogRef<BillcreateDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private idService: IdService,
    private purchaseService: PurchaseService,
    private purchasedetailService: PurchasedetailService,
    private partnerService: PartnerService,
    private productService: ProductService,
    private journalService: JournalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if(this.data){
      this.retrievePO();
    }
    this.datas = [{product:"",qty:"",price_unit:""}]
    this.dataSource.data = this.datas;
    this.datdate = new Date().toISOString().split('T')[0];;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="purchase_user") this.isPurU=true;
      if(this.globals.roles![x]=="purchase_manager") this.isPurM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPurM || !this.isAdm) this.isRes = true;
    this.currentIndex1 = -1;
  }

  retrievePO(): void {
    this.purchaseService.get(this.data)
      .subscribe(dataPO => {
        this.supplierString = dataPO.supplier._id;
        this.purchaseid = dataPO.purchase_id;
        this.retrievePODetail();
      })
  }

  retrievePODetail(): void {
    this.purchasedetailService.getByPOId(this.purchaseid)
      .subscribe(POD => {
        if(this.datas[0].product=='') this.datas.splice(0,1);
          for(let x=0;x<POD.length;x++){
            this.datas.push(POD[x]);
            this.datas[x].qty_rec = 0;
            this.dataSource.data = this.datas;
          }
        })
  }

  editPO(index: number): void {
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

  billrec(): void {
    for(let x=0; x<this.datas.length; x++){
      this.datas[x].qty_rec = this.datas[x].qty_done;
    }
  }

  billall(): void {
    for(let x=0; x<this.datas.length; x++){
      this.datas[x].qty_rec = this.datas[x].qty - this.datas[x].qty_inv;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  checkBill() {
    this.checked = false;
    for(let z=0;z<this.datas.length;z++){
      if(this.datas[z].qty_rec > (this.datas[z].qty - this.datas[z].qty_inv)){
        this._snackBar.open("Jumlah yang di bill pada " + this.datas[z].product.name + " lebih besar!", "Tutup", {duration: 5000});
        this.checked = true;
        return;
      }
      if(z == this.datas.length - 1) {
        if(!this.checked){
          this.createBill();
          return;
        }else{
          return;
        }
      }
    }
  }

  createBill() {
    let y = 0;
    this.pdetailid = [];
    this.productbill = [];
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
        this.pdetailid.push(this.datas[x].id);
        this.productbill.push(this.datas[x].product._id);
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
      amount: y, date: this.datdate, duedate: this.datduedate, origin: this.purchaseid, productbill: this.productbill, qrec: this.qrec,
      productname: this.productname, uom: this.uom, priceunit: this.priceunit, tax: this.tax, discount: this.discount, 
      partner: this.supplierString, pdetail: this.pdetailid, qinv: this.qinv, subtotal: this.subtotal
    };
    this.journalService.createBill(journal)
      .subscribe(cbill => {
        this.dialogRef.close();
      })
  }
}
