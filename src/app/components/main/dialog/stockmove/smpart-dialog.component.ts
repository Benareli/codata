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

@Component({
  selector: 'app-smpart-dialog',
  templateUrl: './smpart-dialog.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class SmpartDialogComponent implements OnInit {
  isPurU = false;
  isPurM = false;
  isAdm = false;
  isRes = false;

  partners?: Partner[];
  warehouses?: Warehouse[];
  products?: Product[];
  supplierString?: number;
  warehouseString?: number;
  datqty?: any;
  datdate?: string;

  purchaseid?: string;
  purchaseHeader?: string;
  prefixes?: string;
  transid?: string;

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
    private logService: LogService,
    private idService: IdService,
    private purchaseService: PurchaseService,
    private purchasedetailService: PurchasedetailService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService,
    private productService: ProductService,
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
        this.supplierString = dataPO.partner_id;
        this.warehouseString = dataPO.warehouse_id;
        this.purchaseid = dataPO.purchase_id;
        this.retrievePODetail();
      })
    this.warehouseService.getAll()
      .subscribe(who => {
        this.warehouses = who;
      })
  }

  retrievePODetail(): void {
    this.purchasedetailService.getByPOId(this.data)
      .subscribe(POD => {
        if(this.datas[0].product=='') this.datas.splice(0,1);
          for(let x=0;x<POD.length;x++){
            this.datas.push(POD[x]);
            this.datas[x].qty_rec = 0;
            this.datas[x].warehouse = this.warehouseString;
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
