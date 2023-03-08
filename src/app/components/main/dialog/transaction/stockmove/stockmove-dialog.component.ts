import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Globals } from 'src/app/global';
import { Uom } from 'src/app/models/masterdata/uom.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';

import { IdService } from 'src/app/services/settings/id.service';
import { StockmoveService } from 'src/app/services/transaction/stockmove.service';
import { Product } from 'src/app/models/masterdata/product.model';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { UomService } from 'src/app/services/masterdata/uom.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';

@Component({
  selector: 'app-stockmove-dialog',
  templateUrl: './stockmove-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
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
    private productService: ProductService,
    private partnerService: PartnerService,
    private uomService: UomService,
    private warehouseService: WarehouseService,
    private stockmoveService: StockmoveService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.retrieveProduct(this.data);
  }

  retrieveProduct(id: string) {
    this.productService.get(id)
      .subscribe(prod => {
        this.datname = prod.name;
        this.datuom = prod.uoms.id;
        this.oriuom = prod.uoms.id;
        this.datsuom = prod.uoms.uom_name;
        this.uom_cat = prod.uoms.uomcat_id;
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
      user_id: this.globals.userid,
      product_id: this.data,
      partner_id: this.partnerid ?? null,
      warehouse_id: this.warehouseid,
      qin: this.datqty ?? 0,
      cost: this.datcost ?? 0,
      uom_id: Number(this.datuom),
      date: new Date(),
      company_id: this.globals.companyid,
      meth: this.globals.cost_general,
    };
    this.stockmoveService.create(dataSM)
      .subscribe(res => {
        this.closeDialog();
      }); 
  }
  
  closeDialog() {
    this.dialogRef.close();
  }
}
