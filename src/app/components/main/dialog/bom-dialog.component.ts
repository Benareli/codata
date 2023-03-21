import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';

import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Product } from 'src/app/models/masterdata/product.model';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { Bom } from 'src/app/models/masterdata/bom.model';
import { BomService } from 'src/app/services/masterdata/bom.service';
import { Costing } from 'src/app/models/masterdata/costing.model';
import { CostingService } from 'src/app/services/masterdata/costing.service';
import { Log } from 'src/app/models/settings/log.model';
import { LogService } from 'src/app/services/settings/log.service';

@Component({
  selector: 'app-bom-dialog',
  templateUrl: './bom-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class BomDialogComponent implements OnInit {
  lock = false;
  edit = false;
  edit_text = "Edit";
  isChecked = false;
  isProdU = false;
  isProdM = false;
  isAdm = false;
  isRes = false;
  term: string;
  openDropDown = false;

  products?: Product[];
  rmproducts?: Product[];
  boms?: Bom[];
  costings?: Costing[];
  productString?: any;

  datid?: string;
  datbom?: any;
  datqty?: number;
  datcost?: number;
  datdisc?: number;
  dattax?: number;
  datsub?: number;
  datdate?: string;
  datuom?: string;
  datsuom?: string;
  datexpected?: Date;
  ph?: string = 'Ketik disini untuk cari';

  costid?: string;
  overhead?: number;
  ovType?: string;
  ovTime?: number;
  labor?: number;
  laType?: string;
  laTime?: number;

  datas?: any;
  datBOMs?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;
  currentIndex1 = -1;

  columns: Columns[];
  configuration: Config;

  constructor(
    public dialogRef: MatDialogRef<BomDialogComponent>,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private globals: Globals,
    private logService: LogService,
    private bomService: BomService,
    private costingService: CostingService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if(this.data){
      this.lock = true;
      this.productString = this.data;
      this.retrieveBOM();
    }
    //this.datas = [{product:"",bom:"",qty:"",uom:""}]
    //this.dataSource.data = this.datas;
    this.datdate = new Date().toISOString().split('T')[0];;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="production_user") this.isProdU=true;
      if(this.globals.roles![x]=="production_manager") this.isProdM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isProdM || !this.isAdm) this.isRes = true;
    this.retrieveData();
    this.currentIndex1 = -1;
  }

  retrieveData(): void {
    this.productService.findAllRM(this.globals.companyid)
      .subscribe(dataProdRM => {
        this.rmproducts = dataProdRM;
      })
    this.productService.findAllRMTrue(this.globals.companyid)
      .subscribe(dataProd => {
        this.products = dataProd;
        if(!this.data){
          this.productString = dataProd[0].id;
        }
      })
  }

  retrieveBOM(): void {
    this.bomService.findByProduct(this.data)
      .subscribe(dataBOM => {
        this.datBOMs = dataBOM;
        this.columns = [
          {key:'bomes.name', title:'Name', orderBy:'asc', width: '40%'},
          {key:'qty', title:'Qty', width:'10%'},
          {key:'uoms.uom_name', title:'UOM', width:'20%'},
          {key:'bomes.cost * qty', title:'Cost', width:'20%'},
          {key:'', title:'Action', width:'10%'},
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
        this.configuration.headerEnabled = false;
        /*this.dataSource.data = dataBOM;
        this.datBOM = dataBOM[0];
        this.productString = this.datBOM.product._id; 
        if(this.datas[0].product=='') this.datas.splice(0,1);
        for(let x=0; x<dataBOM.length; x++){
          this.datas.push(dataBOM[x]);
        }*/
      })
    this.costingService.findByProduct(this.data)
      .subscribe(dataCosting => {
        this.costid = dataCosting[0].id;
        this.overhead = dataCosting[0].overhead;
        this.ovType = dataCosting[0].ovType;
        this.ovTime = dataCosting[0]!.ovTime! / 3600;
        this.labor = dataCosting[0].labor;
        this.laType = dataCosting[0].laType;
        this.laTime = dataCosting[0]!.laTime! / 3600;
      })
  }

  getProd(product: Product, index: number): void {
    this.currentIndex1 = index;
    this.onF();
    this.term = product.name!.toString();
    this.ph = product.name;
    this.datid = product.id;
    this.datbom = product;
    this.datqty = 1;
    this.datuom = product.suom;
    this.datsuom = product.suom.uom_name;
    this.datcost = product.cost ?? 0;
  }

  pushing(): void {
    this.edit = false;
    if(this.datbom){
      for(let y=0;y<this.datas.length;y++){
        if(this.datas[y].bom._id == this.datbom.id) this.edit = true;
        if(y == this.datas.length-1) {
          this.pushingAgain();
          return;
        }
      }
    }
  }

  pushingAgain(): void {
    if(this.edit) {
      this._snackBar.open("Bahan Baku " + this.ph + " sudah ada!", "Tutup", {duration: 5000});
      this.ph = "Ketik disini untuk cari";
      this.term = "";
      this.datqty = undefined;
      this.datuom = undefined;
      this.datsuom = undefined;
    }
    else {
      if(this.datas[0].product=='') this.datas.splice(0,1);
      const dataPush = {
        product: this.productString, bom: this.datbom, qty: this.datqty, uom: this.datuom
      }
      this.datas.push(dataPush);
      //this.dataSource.data = this.datas;
      this.ph = "Ketik disini untuk cari";
      this.term = "";
      this.datqty = undefined;
      this.datuom = undefined;
      this.datsuom = undefined;
    }
  }

  uploadBOM(): void {
    for(let z=0;z<this.datas.length;z++) {
      if(!this.datas[z].id){
        const boms = {
          product: this.productString, bom: this.datas[z].bom.id, qty: this.datas[z].qty, uom: this.datas[z].uom._id
        }
        this.bomService.create(boms)
          .subscribe(bomC => {

          })
      }
      if(z == this.datas.length-1){
        this.uploadCosting();
        return;
      }
    }
  }

  uploadCosting(): void {
    const costing = {
      product: this.productString, overhead: this.overhead, ovType: this.ovType, ovTime: (this.ovTime ?? 0) * 3600,
      labor: this.labor, laType: this.laType, laTime: (this.laTime ?? 0) * 3600
    }
    this.costingService.update(this.costid, costing)
      .subscribe(upCost => {
        this.closeDialog();
      })
  }

  deleteBOMDetail(index: number, id: any, bom: any): void {
    this.bomService.delete(id)
      .subscribe(bomDel => {
        this.retrieveBOM();
      })
  }

  onChange(event: any): void {
    this.datas = [{product:"",bom:"",qty:"",uom:""}]
    this.bomService.findByProduct(event.target.value)
      .subscribe(dataBOMS => {
        /*if(dataBOMS.length > 0){
          this.dataSource.data = dataBOMS;
          this.datBOM = dataBOMS[0];
          this.productString = this.datBOM.product._id;
          if(this.datas[0].product=='') this.datas.splice(0,1);
          for(let x=0; x<dataBOMS.length; x++){
            this.datas.push(dataBOMS[x]);
          }
        }else{
          this.datas = [{product:"",bom:"",qty:"",uom:""}]
          this.dataSource.data = this.datas;
        }*/
      })
  }

  onF(): void {
    this.openDropDown = !this.openDropDown;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
