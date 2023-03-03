import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Stockmove } from 'src/app/models/stockmove.model';
import { StockmoveService } from 'src/app/services/stockmove.service';
import { Stockrequest } from 'src/app/models/stockrequest.model';
import { StockrequestService } from 'src/app/services/stockrequest.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Uom } from 'src/app/models/uom.model';
import { UomService } from 'src/app/services/uom.service';
import { Uomcat } from 'src/app/models/uomcat.model';
import { UomcatService } from 'src/app/services/uomcat.service';

@Component({
  selector: 'app-sm-detail-dialog',
  templateUrl: './sm-detail-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class SMDetailDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;
  lock = false;
  new = false;
  request = false;
  in: boolean;
  out: boolean;
  stockmoves?: Stockmove[];
  products: Product[];
  warehouses: Warehouse[];
  uoms: Uom[];
  uomcats: Uomcat[];
  uomcat: any;
  typeTrans: string;
  fromString?: string;
  tooString?: string;
  uomString?: string;
  wh1String?: string;
  wh2String?: string;
  uomz?: any;
  datid?: string;
  datprod?: any;
  datqty?: number;
  datuom?: string;
  datsuom?: any;
  datcost?: number;
  datdate: string;
  datfrom: string;
  datto: string;
  term: string;
  ph?: string = 'Ketik disini untuk cari';
  openDropDown = false;

  a = 0; b = 0; c = 0;
  transidtitle?: string;
  log = 0;
  currentIndex1 = -1;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'uom', 'date', 'from', 'to', 'type'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  columns: Columns[];
  configuration: Config;

  constructor(
    public dialogRef: MatDialogRef<SMDetailDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private stockmoveService: StockmoveService,
    private stockrequestService: StockrequestService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private uomService: UomService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data){
      this.transidtitle = this.data.trans_id;
      this.datdate = this.data.date;
      this.request = this.data.req;
      if(this.request){
        this.stockrequestService.getTransId(this.data.trans_id)
          .subscribe(srti => {
            this.datas = srti;
            this.dataSource.data = this.datas;
            this.checkInterface();
          })
        this.lock = false;
        this.columns = [
          {key:'product.name', title:'Product', orderBy:'asc', width: '40%'},
          {key:'qin', title:'Qty', width:'7%'},
          {key:'uom.uom_name', title:'Uom', width:'7%'},
          {key:'oriqin', title:'Qty', width:'7%'},
          {key:'uom.uom_name', title:'Uom', width:'7%'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
        this.configuration.paginationEnabled = false;
      }else{
        this.stockmoveService.getTransId(this.data.trans_id)
          .subscribe(smti => {
            this.datas = smti;
            this.dataSource.data = this.datas;
            this.checkInterface();
            console.log(this.datas);
          })
        this.lock = false;
        this.columns = [
          {key:'product.name', title:'Product', orderBy:'asc', width: '40%'},
          {key:'qin', title:'Qty', width:'7%'},
          {key:'uom.uom_name', title:'Uom', width:'7%'},
          {key:'oriqin', title:'Qty', width:'7%'},
          {key:'uom.uom_name', title:'Uom', width:'7%'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
        this.configuration.paginationEnabled = false;
      }
    }else{
      this.transidtitle = "New Inventory Request";
      this.datdate = new Date().toISOString().split('T')[0];
      this.datas = [{product:"",qty:"",uom:""}];
      this.dataSource.data = this.datas;
      this.lock = true;
      this.new = true;
      this.in = true;
      this.out = true;
    }
    this.checkRole();
    this.retrieveData();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
  }

  retrieveData(): void {
    this.productService.findAllActive()
      .subscribe(prod => {
        this.products = prod;
      })
    this.warehouseService.findAllActive()
      .subscribe(wh => {
        this.warehouses = wh;
        this.fromString = wh[0].id;
        this.tooString = wh[0].id;
      })
    this.uomService.getAll()
      .subscribe(uom => {
        this.uoms = uom;
      })
  }

  checkInterface(): void {
    for(let k=0;k<this.datas.length;k++){
      if(this.datas[k].qin) this.a = 1;
      else if(this.datas[k].qout) this.b = 2;
      this.c = this.a + this.b;
      if(k == this.datas.length-1){
        this.checkWH();
        return;
      }
    }
  }

  checkWH(): void {
    if(this.c==1) {this.wh1String = this.datas[0].warehouse.name;}
    else if(this.c==2) {this.wh1String = this.datas[0].warehouse.name;}
    else if(this.c==3) {this.wh1String = this.datas[0].warehouse.name;
                        this.wh2String = this.datas[this.datas.length-1].warehouse.name;}
  }

  checkingType($event: any): void {
    if($event == 'In'){
      this.in = true;
      this.out = false;
    }else if($event == 'Out'){
      this.in = false;
      this.out = true;
    }else if($event == 'Internal'){
      this.in = false;
      this.out = false;
    }else{
      this.in = true;
      this.out = true;
    }
  }

  getProd(product: Product, index: number): void {
    this.currentIndex1 = index;
    this.onF();
    this.term = product.name!.toString();
    this.ph = product.name;
    this.datid = product.id;
    this.datprod = product;
    this.datqty = 1;
    this.datuom = product.uoms.uom_name;
    this.datsuom = product.uoms;
    this.uomString = product.uoms.id;
    this.datcost = product.cost;
  }

  onF(): void {
    this.openDropDown = !this.openDropDown;
  }

  pushing(): void {
    this.uomService.get(this.uomString)
      .subscribe(uomc => {
        this.uomcat = uomc;
        if(this.datprod.uoms.uomcat_id == this.uomcat.uomcat_id){
          this.uomService.get(this.uomString)
            .subscribe(uomget => {
              this.uomz = uomget;
              this.pushingData();
            })
        }
        else{
          this._snackBar.open("UOM Category tidak boleh beda dengan UOM Produk!", "Tutup", {duration: 5000});
        }
      })
  }

  pushingData(): void {
    if(this.datas[0].product=='') this.datas.splice(0,1);
    if(this.datid){
      const dataPush = {
        id: this.datid, product: this.datprod, prodid: this.datid, qty: this.datqty, qty_done: 0, 
        uom: this.uomz, uomid: this.uomString, user: this.globals.userid, from: this.fromString, 
        to: this.tooString, type: this.typeTrans, date: this.datdate, company: this.globals.companyid,
        cost: this.datcost
      }
      this.datas.push(dataPush);
      this.dataSource.data = this.datas;
      this.ph = "Ketik disini untuk cari";
      this.term = "";
      this.datqty = undefined;
      this.datuom = undefined;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  startSave(): void {
    this.stockrequestService.create(this.datas)
      .subscribe(src => {
        this.closeDialog();
      })
  }

  validate(): void {
    this.stockrequestService.validateByTransid(this.transidtitle)
      .subscribe(val => {
        this.closeDialog();
      })
  }
}
