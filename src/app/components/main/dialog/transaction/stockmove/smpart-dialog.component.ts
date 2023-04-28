import { Component, OnInit, Inject } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { PurchaseService } from 'src/app/services/transaction/purchase.service';
import { PurchasedetailService } from 'src/app/services/transaction/purchasedetail.service';
import { SaleService } from 'src/app/services/transaction/sale.service';
import { SaledetailService } from 'src/app/services/transaction/saledetail.service';

import { Product } from 'src/app/models/masterdata/product.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';

@Component({
  selector: 'app-smpart-dialog',
  templateUrl: './smpart-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class SmpartDialogComponent implements OnInit {
  isPurU = false;
  isPurM = false;
  isAdm = false;
  isRes = false;

  partners?: Partner[];
  warehouses?: Warehouse[];
  products?: Product[];
  partnerString?: number;
  warehouseString?: number;
  datqty?: any;
  datdate?: string;

  transacid?: string;
  transacHeader?: string;
  prefixes?: string;
  transid?: string;
  dataActions: any;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'qty_done'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;
  currentIndex1 = -1;

  constructor(
    public dialogRef: MatDialogRef<SmpartDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private purchaseService: PurchaseService,
    private purchasedetailService: PurchasedetailService,
    private saleService: SaleService,
    private saledetailService: SaledetailService,
    private warehouseService: WarehouseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.datas = [{products:{name:""},qty:"",price_unit:""}]
    this.dataSource.data = this.datas;
    this.dataActions = { purchase: this.retrievePO, sale: this.retrieveSO};
    if (this.data && this.dataActions[this.data[0]]) {
      this.dataActions[this.data[0]].call(this);
    }
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
    this.purchaseService.get(this.data[1])
      .subscribe(dataPO => {
        this.partnerString = dataPO.partner_id;
        this.warehouseString = dataPO.warehouse_id;
        this.transacid = dataPO.purchase_id;
        this.retrievePODetail();
      })
    this.warehouseService.getAll()
      .subscribe(who => {
        this.warehouses = who;
      })
  }

  retrievePODetail(): void {
    this.purchasedetailService.getByPOId(this.data[1])
      .subscribe(POD => {
        if(this.datas[0].products.name==='') this.datas.splice(0,1);
          for(let x=0;x<POD.length;x++){
            this.datas.push(POD[x]);
            this.datas[x].qty_rec = 0;
            this.datas[x].warehouse = this.warehouseString;
            this.dataSource.data = this.datas;
          }
        })
  }

  retrieveSO(): void {
    this.saleService.get(this.data[1])
      .subscribe(dataSO => {
        this.partnerString = dataSO.partner_id;
        this.warehouseString = dataSO.warehouse_id;
        this.transacid = dataSO.sale_id;
        this.retrieveSODetail();
      })
    this.warehouseService.getAll()
      .subscribe(who => {
        this.warehouses = who;
      })
  }

  retrieveSODetail(): void {
    this.saledetailService.getBySOId(this.data[1])
      .subscribe(SOD => {
        console.log(SOD);
        if(this.datas[0].products.name==='') this.datas.splice(0,1);
          for(let x=0;x<SOD.length;x++){
            this.datas.push(SOD[x]);
            this.datas[x].qty_rec = 0;
            this.datas[x].qoh = SOD[x].products.productcostcomps[0].qoh;
            this.datas[x].warehouse = this.warehouseString;
            this.dataSource.data = this.datas;
            console.log("datas", this.datas);
          }
        })
  }

  edit(index: number): void {
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

  changeWarehouse(): void {
    for(let x=0; x<this.datas.length; x++){
      this.datas[x].warehouse = this.warehouseString;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  closeBackDialog() {
    this.dialogRef.close(this.datas);
  }
}
