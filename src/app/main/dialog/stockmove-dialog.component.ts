import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Id } from 'src/app/models/id.model';
import { IdService } from 'src/app/services/id.service';
import { Stockmove } from 'src/app/models/stockmove.model';
import { StockmoveService } from 'src/app/services/stockmove.service';
import { Qof } from 'src/app/models/qof.model';
import { QofService } from 'src/app/services/qof.service';
import { Qop } from 'src/app/models/qop.model';
import { QopService } from 'src/app/services/qop.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Uom } from 'src/app/models/uom.model';
import { UomService } from 'src/app/services/uom.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-stockmove-dialog',
  templateUrl: './stockmove-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class StockMoveDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  datname?: string;
  datuom?: string;
  oriuom?: string;
  datsuom?: string;
  warehouseid?: any;
  partnerid?: any;
  uom_cat?: string;
  transid?: string;
  prefixes?: string;
  datqty=0; qin=0; qout=0; qqof=0; datcost=0;

  products?: Product[];
  warehouses?: Warehouse[];
  partners?: Partner[];
  uoms?: Uom[];

  uom_big = 1;
  a = 0; b = 0;
  x = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<StockMoveDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private idService: IdService,
    private logService: LogService,
    private productService: ProductService,
    private partnerService: PartnerService,
    private uomService: UomService,
    private warehouseService: WarehouseService,
    private stockmoveService: StockmoveService,
    private qofService: QofService,
    private qopService: QopService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.retrieveProduct(this.data);
  }

  retrieveProduct(id: string) {
    this.productService.get(id)
      .subscribe(prod => {
        this.datname = prod.name;
        this.datuom = prod.suom._id;
        this.oriuom = prod.suom._id;
        this.datsuom = prod.suom.uom_name;
        this.uom_cat = prod.suom.uom_cat;
        this.retrieveData();
      });
  }

  retrieveData(): void {
    this.warehouseService.findAllActive()
      .subscribe(dataPC => {
        this.warehouses = dataPC;
        this.warehouseid = dataPC[0].id;
      });
    this.partnerService.findAllActiveSupplier()
      .subscribe(dataB => {
        this.partners = dataB;
      });
    this.uomService.getByCat(this.uom_cat)
      .subscribe(dataUO => {
        this.uoms = dataUO;
      })
  }
  
  createData(): void{
    if(!this.warehouseid || this.warehouseid == null){
      this._snackBar.open("Gudang (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if(this.oriuom!=this.datuom){
        this.uomService.get(this.datuom)
          .subscribe(dataUO1 => {
            //console.log(dataUO1.ratio);
            this.uom_big = Number(dataUO1.ratio);
            this.createSMid();
          })
      }else{
        this.createSMid();
      }
    }
  }

  createSMid(): void {
    this.idService.getTransferId()
      .subscribe(idp => {
        this.transid = idp.message;
        this.createSM();
      });
  }

  createSM(): void {
    const dataSM = {
      trans_id: this.transid,
      user: this.globals.userid,
      product: this.data,
      partner: this.partnerid ?? "null",
      warehouse: this.warehouseid,
      qin: this.datqty * this.uom_big ?? 0,
      cost: this.datcost / this.uom_big ?? 0,
      uom: this.datuom,
      date: new Date(),
      meth: this.globals.cost_general
    };
    this.stockmoveService.create(dataSM)
      .subscribe(res => {
        this.closeDialog();
      }); 
  }
  
  /*qop(): void{
    const qop = {
      product: this.data,
      partner: this.partnerid ?? "null",
      warehouse: this.warehouseid,
      qop: this.datqty * this.uom_big ?? 0,
      uom: this.datuom,
      cost: this.datcost / this.uom_big ?? 0
    }
    console.log(qop);
    this.qopService.createUpdate(qop)
      .subscribe(res => {
        this.closeDialog();
      })
  }*/

  closeDialog() {
    this.dialogRef.close();
  }
}
