import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Globals } from 'src/app/global';
import { Product } from 'src/app/models/masterdata/product.model';
import { Partner } from 'src/app/models/masterdata/partner.model';

import { PurchaseService } from 'src/app/services/transaction/purchase.service';
import { PurchasedetailService } from 'src/app/services/transaction/purchasedetail.service';
import { SaleService } from 'src/app/services/transaction/sale.service';
import { SaledetailService } from 'src/app/services/transaction/saledetail.service';
import { JournalService } from 'src/app/services/accounting/journal.service';

@Component({
  selector: 'app-aparcreate-dialog',
  templateUrl: './aparcreate-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class AparcreateDialogComponent implements OnInit {
  isPurU = false;
  isPurM = false;
  isSalU = false;
  isSalM = false;
  isAdm = false;
  isRes = false;

  head?: string;
  partners?: Partner[];
  products?: Product[];
  supplierString?: number;
  datqty?: any;
  datdate?: string;
  datduedate?: string;

  transacid?: string;
  transacHeader?: string;
  prefixes?: string;
  prodcompany?: any[];
  pdetailid?: string[];
  productbill?: string[];
  qrec?: number[];
  productname?: string[];
  uom?: string[];
  priceunit?: number[];
  tax?: number[];
  discount?: number[];
  qinv?: number[];
  subtotal?: number[];
  checked = false;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'qtydone', 'qtynobill', 'qty_inv', 'uom'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;
  currentIndex1 = -1;

  constructor(
    public dialogRef: MatDialogRef<AparcreateDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private purchaseService: PurchaseService,
    private purchasedetailService: PurchasedetailService,
    private saleService: SaleService,
    private saledetailService: SaledetailService,
    private journalService: JournalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if(this.data[0]==='purchase'){
      this.retrievePO();
      this.head = 'Bill';
    }else if(this.data[0]==='sale'){
      this.retrieveSO();
      this.head = 'Invoice';
    }else{
      this.closeDialog();
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
      if(this.globals.roles![x]=="sale_user") this.isSalU=true;
      if(this.globals.roles![x]=="sale_manager") this.isSalM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(this.data[0]==='purchase'){
      if(!this.isPurM || !this.isAdm) this.isRes = true;
    }else if(this.data[0]==='sale'){
      if(!this.isSalM || !this.isAdm) this.isRes = true;
    }
    this.currentIndex1 = -1;
  }

  retrievePO(): void {
    this.purchaseService.get(this.data[1])
      .subscribe(dataPO => {
        this.supplierString = dataPO.partner_id;
        this.transacid = dataPO.purchase_id;
        this.retrievePODetail();
      })
  }

  retrievePODetail(): void {
    this.purchasedetailService.getByPOId(this.data[1])
      .subscribe(POD => {
        if(this.datas[0].product=='') this.datas.splice(0,1);
          for(let x=0;x<POD.length;x++){
            this.datas.push(POD[x]);
            this.datas[x].qty_rec = 0;
            this.dataSource.data = this.datas;
          }
        })
  }

  retrieveSO(): void {
    this.saleService.get(this.data[1])
      .subscribe(dataSO => {
        this.supplierString = dataSO.partner_id;
        this.transacid = dataSO.sale_id;
        this.retrieveSODetail();
      })
  }

  retrieveSODetail(): void {
    this.saledetailService.getBySOId(this.data[1])
      .subscribe(SOD => {
        if(this.datas[0].product=='') this.datas.splice(0,1);
          for(let x=0;x<SOD.length;x++){
            this.datas.push(SOD[x]);
            this.datas[x].qty_rec = 0;
            this.dataSource.data = this.datas;
          }
        })
  }

  editLine(index: number): void {
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
    this.prodcompany = [];
    this.uom = [];
    this.qrec = [];
    this.priceunit = [];
    this.tax = [];
    this.discount = [];
    this.qinv = [];
    this.subtotal = [];
    for(let x=0; x<this.datas.length; x ++){
      if(this.datas[x].qty_rec > 0){
        console.log(this.data[x].tax);
        y = y + (Number(this.datas[x].qty_rec) / Number(this.datas[x].qty) * Number(this.datas[x].subtotal));
        this.pdetailid.push(this.datas[x].id);
        this.productbill.push(this.datas[x].product_id);
        this.productname.push(this.datas[x].products.name);
        this.prodcompany.push(localStorage.getItem("comp"));
        this.qrec.push(this.datas[x].qty_rec);
        this.uom.push(this.datas[x].uom_id);
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
      amount: y, date: this.datdate, duedate: this.datduedate ? this.datduedate : this.datdate, origin: this.transacid, productbill: this.productbill, qrec: this.qrec,
      productname: this.productname, uom: this.uom, priceunit: this.priceunit, tax: this.tax, discount: this.discount, 
      partner: this.supplierString, pdetail: this.pdetailid, qinv: this.qinv, subtotal: this.subtotal, 
      company: localStorage.getItem("comp"), user: this.globals.userid
    };
    if(this.data[0]==='purchase'){
      this.journalService.createBill(journal)
        .subscribe(cbill => {
          this.dialogRef.close();
        })
    }else if(this.data[0]==='sale'){
      this.journalService.createInv(journal)
        .subscribe(cinv => {
          this.dialogRef.close();
        })
    }
    
  }
}
