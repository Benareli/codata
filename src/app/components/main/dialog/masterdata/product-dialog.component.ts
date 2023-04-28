import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import * as CryptoJS from 'crypto-js';

import { BaseURL } from 'src/app/baseurl';
import { Globals } from 'src/app/global';
import { Product } from 'src/app/models/masterdata/product.model';
import { Productcat } from 'src/app/models/masterdata/productcat.model';
import { Brand } from 'src/app/models/masterdata/brand.model';
import { Bundle } from 'src/app/models/masterdata/bundle.model';
import { Bom } from 'src/app/models/masterdata/bom.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Tax } from 'src/app/models/accounting/tax.model';
import { Uom } from 'src/app/models/masterdata/uom.model';
import { Qop } from 'src/app/models/transaction/qop.model';

import { LogService } from 'src/app/services/settings/log.service';
import { FileUploadService } from 'src/app/services/settings/file-upload.service';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { ProductCatService } from 'src/app/services/masterdata/product-cat.service';
import { BrandService } from 'src/app/services/masterdata/brand.service';
import { BundleService } from 'src/app/services/masterdata/bundle.service';
import { BomService } from 'src/app/services/masterdata/bom.service';
import { CostingService } from 'src/app/services/masterdata/costing.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { TaxService } from 'src/app/services/accounting/tax.service';
import { UomService } from 'src/app/services/masterdata/uom.service';
import { QopService } from 'src/app/services/transaction/qop.service';
import { StockmoveService } from 'src/app/services/transaction/stockmove.service';
import { PosdetailService } from 'src/app/services/transaction/posdetail.service';
import { PurchasedetailService } from 'src/app/services/transaction/purchasedetail.service';

import { StockMoveDialogComponent } from '../transaction/stockmove/stockmove-dialog.component';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class ProductDialogComponent implements OnInit {
  isChecked = false;
  isStock = true;
  isNew = false;
  isDis = false;
  bbigger = false;
  isCG?: boolean = true;

  oriid?: string;
  orisku?: string;
  oriname?: string;
  oridesc?: string;
  orisuom?: any;
  orisuomn?: string;
  oripuom?: any;
  oripuomn?: string;
  oribarc?: string;
  orilprice?: number;
  oribprice?: number;
  oricost?: number;
  oriimage?: string;
  orimin?: number;
  orimax?: number;
  orifg?: boolean;
  orirm?: boolean;
  oricategoryid?: any;
  oribrandid?: any;
  oripartnerid?: any;
  oritaxinid?: any;
  oritaxoutid?: any;

  imageData!: string;

  datid?: string;
  datsku?: string;
  datname?: string;
  datdesc?: string;
  datsuom?: any;
  datsuomname?: string;
  datpuom?: any;
  datbarcode?: string;
  datlprice?: number;
  datbprice?: number;
  datcost?: number;
  datisstock?: string;
  datmin?: number;
  datmax?: number;
  datfg: boolean = false;
  datrm: boolean = false;
  categoryid?: any;
  brandid?: any;
  partnerid?: any;
  taxinid?: any;
  taxoutid?: any;
  statusActive?: string;
  costid?: string;

  isIU = false;
  isIM = false;
  isProdU = false;
  isProdM = false;
  isAdm = false;
  isRes = false;

  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  partners?: Partner[];
  taxs?: Tax[];
  uoms?: Uom[];
  boms!: Bom[];
  bundles!: Bundle[];
  qop1: any;

  overhead?: number;
  ovType?: string;
  ovTime?: number;
  labor?: number;
  laType?: string;
  laTime?: number;

  posdet?: number;
  posqty?: number;
  purdet?: number;
  purqty?: number;
  qindet?: number;
  qinqty?: number;
  qoutdet?: number;
  qoutqty?: number;

  a = 0; b = 0;
  isUpdated = 'update';
  log = 0;
  cFG = false; cRM = false;

  //Table

  displayedColumnsDet: string[] = 
  ['warehouse', 'qty'];
  dataSourceDet = new MatTableDataSource<Qop>();

  //Dialog Data
  clickedRows = null; 

  //Upload File
  fileName!: string;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;

  //Bundle
  bproducts?: Product[];
  currentIndex1 = -1;
  term!: string;
  ph?: string = 'Ketik disini untuk cari';
  openDropDown = false;
  bdatid?: string;
  bdatprod?: string;
  bdatuom?: any;
  bdatqty?: number;
  bdatsuom?: string;

  //BOM
  boproducts?: Product[];
  currentIndex2 = -1;
  term2!: string;
  pi?: string = 'Ketik disini untuk cari';
  openDropDown2 = false;
  bodatid?: string;
  bodatprod?: string;
  bodatuom?: any;
  bodatqty?: number;
  bodatsuom?: string;

  coru: number = 0;

  columnsBundle!: Columns[];
  configurationBundle!: Config;
  columnsBom!: Columns[];
  configurationBom!: Config;
  columnsQop1!: Columns[];
  configurationQop1!: Config;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private _snackBar: MatSnackBar,
    private uploadService: FileUploadService,
    private productService: ProductService,
    private brandService: BrandService,
    private productCatService: ProductCatService,
    private bundleService: BundleService,
    private bomService: BomService,
    private costingService: CostingService,
    private uomService: UomService,
    private partnerService: PartnerService,
    private taxService: TaxService,
    private qopService: QopService,
    private stockmoveService: StockmoveService,
    private posDetailService: PosdetailService,
    private purchaseDetailService: PurchasedetailService,
    private globals: Globals,
    private logService: LogService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data){
      this.checkData(this.data);
      this.isNew = false;
    } else{
      this.isNew = true;
      this.isChecked = true;
      this.datisstock = 'true';
      this.statusActive = 'true';
      this.datdesc = "";
      this.datsku = "";
      this.datname = "";
    }
    this.isCG = this.globals.cost_general;
    this.imageInfos = this.uploadService.getFiles();
    this.retrieveProduct();
    this.checkRole();
  }

  onValueChange(file: File[]) {
    console.log("File changed!");
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="production_user") this.isProdU=true;
      if(this.globals.roles![x]=="production_manager") this.isProdM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM) this.isRes = true;
    this.retrieveLog();
  }

  checkData(id: any){
    this.productService.get(id)
      .subscribe(prod => {
        this.datid = prod.id;
        this.datsku = prod.sku;
        this.orisku = prod.sku;
        this.datname = prod.name;
        this.oriname = prod.name;
        this.datdesc = prod.description;
        this.oridesc = prod.description;
        this.datbarcode = prod.barcode;
        this.oribarc = prod.barcode;
        this.datlprice = prod.listprice;
        this.orilprice = prod.listprice;
        this.datbprice = prod.botprice;
        this.oribprice = prod.botprice;
        
        this.datmin = prod.min;
        this.orimin = prod.min;
        this.datmax = prod.max;
        this.orimax = prod.max;
        this.orifg = prod.fg;
        this.datfg = prod.fg!;
        this.orirm = prod.rm;
        this.datrm = prod.rm!;
        this.oriimage = prod.image;
        if (prod.active == true){
          this.statusActive = 'true';
          this.isChecked = true;
          this.a = 0;
        } else {
          this.statusActive = 'false';
          this.isChecked = false;
          this.a = 1;
        }
        if (prod.isStock == true){
          this.datisstock = 'true';
          this.isStock = true;
        }else{
          this.datisstock = 'false';
          this.isStock = false;
        }
        if(prod.productcat_id) {
          this.categoryid = prod.productcat_id;
          this.oricategoryid = prod.productcat_id;
        }
        if(prod.brand_id) {
          this.brandid = prod.brand_id;
          this.oribrandid = prod.brand_id;
        }
        if(prod.supplier) {
          this.partnerid = prod.supplier._id;
          this.oripartnerid = prod.supplier._id;
        }
        this.datsuom = prod.uom_id;
        this.datpuom = prod.puom_id;
        this.datsuomname = prod.uoms.uom_name;
        this.orisuom = prod.uom_id;
        this.oripuom = prod.puom_id;
        if(prod.tax_id) {
          this.taxinid = prod.tax_id;
          this.oritaxinid = prod.tax_id;
        }
        if(prod.taxout_id) {
          this.taxoutid = prod.taxout_id;
          this.oritaxoutid = prod.taxout_id;
        }
        this.retrieveBundle();
        this.retrieveBom();
        this.productService.getCostComp(prod.id, JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
          .subscribe(pcost => {
            this.datcost = pcost.cost;
            this.oricost = pcost.cost;
          })
    });
    this.posDetailService.findByProduct(id)
      .subscribe(posDet => {
        this.posdet = posDet[0].totalLine;
        this.posqty = posDet[0].totalQty;
      })
    this.purchaseDetailService.findByProduct(id, JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
      .subscribe(purDet => {
        this.purdet = purDet[0].totalline;
        this.purqty = purDet[0].totalqty;
      })
    this.stockmoveService.findTransIn(id, JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
      .subscribe(transin => {
        this.qindet = transin[0].totalline;
        this.qinqty = transin[0].totalqin;
      })
    this.stockmoveService.findTransOut(id, JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
      .subscribe(transout => {
        this.qoutdet = transout[0].totalline;
        this.qoutqty = transout[0].totalqout;
      })
  }

  onValChange(val: string) {
    this.statusActive = val;
    if (this.statusActive == 'true'){
      this.isChecked = true;
      this.b = 2;
    }else{
      this.isChecked = false;
      this.b = 4;
    }
  }

  onStockChange(vals: string) {
    this.datisstock = vals;
    if (this.datisstock == 'true'){
      this.isStock = true;
    }else{
      this.isStock = false;
    }
  }

  retrieveProduct(): void {
    this.productCatService.findAllActive()
      .subscribe(dataPC => {
        this.productcats = dataPC;
      });
    this.brandService.findAllActive()
      .subscribe(dataB => {
        this.brands = dataB;
      });
    this.taxService.getAll()
      .subscribe(tax => {
        this.taxs = tax;
      });
    this.uomService.getAll()
      .subscribe(uom => {
        this.uoms = uom;
      })
    this.qopService.findByProduct(this.data)
      .subscribe(dataQop => {
        this.qop1 = dataQop;
        this.columnsQop1 = [
          {key:'warehouses.name', title:'Gudang', width: '30%'},
          {key:'partners.name', title:'Partner', width: '30%'},
          {key:'qop', title:'Qty', width: '15%'},
          {key:'uoms.uom_name', title:'Uom', width: '10%'},
          {key:'cost',title:'Cost', width: '15%'}
        ];
        this.configurationQop1 = { ...DefaultConfig };
        this.configurationQop1.rows = 5;
        this.configurationQop1.searchEnabled = false;
      })
    /*this.qopService.getProdQop(this.data)
      .subscribe(datQop => {
        
      })*/
    this.partnerService.findAllActiveSupplier()
      .subscribe(dataSup => {
        this.partners = dataSup;
      })
    this.stockmoveService.getProd(this.data)
      .subscribe(sm => {
        if(sm.length>0) this.isDis = true;
      })
  }

  retrieveBundle(): void{
    if(this.orifg){
      this.bundleService.getByBundle(this.data)
        .subscribe(bund => {
          this.coru = bund.length;
          this.bundles = bund;
          if(bund.length < 5){
            for(let b=0; b<5-bund.length; b+1){
              this.bundles.push({qty: 0, product_id: 0, uom_id: 0,})
              if(b==4-bund.length) this.easytableBundle();
            }
          }else{
            this.easytableBundle();
          }
        })
      this.productService.findAllFGStock(JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
      .subscribe(allfg => {
        this.bproducts = allfg;
      })
    }
  }

  easytableBundle(): void{
    this.columnsBundle = [
      {key:'products.name', title:'Name', width: '50%'},
      {key:'qty', title:'Qty', width: '20%'},
      {key:'uoms.uom_name', title:'Uom', width: '20%'},
      {key:'',title:'Action', width: '10%'}
    ];
    this.configurationBundle = { ...DefaultConfig };
    this.configurationBundle.rows = 5;
    this.configurationBundle.searchEnabled = false;
    this.configurationBundle.headerEnabled = false;
  }

  retrieveBom(): void{
    if(this.orirm){
      this.bomService.findByProduct(this.data)
        .subscribe(bom => {
          this.coru = bom.length;
          this.boms = bom;
          if(bom.length < 5){
            for(let b=0; b<5-bom.length; b+1){
              this.boms.push({qty: 0, product_id: 0, uom_id: 0,})
              if(b==4-bom.length) this.easytableBom();
            }
          }else{
            this.easytableBom();
          }
        })
      this.productService.findAllRM(JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
        .subscribe(allrm => {
          this.boproducts = allrm;
        })
      this.costingService.findByProduct(this.data)
        .subscribe(costs => {
          this.costid = costs[0].id;
          this.overhead = costs[0].overhead;
          this.ovType = costs[0].ovType;
          this.ovTime = costs[0]!.ovTime! / 3600;
          this.labor = costs[0].labor;
          this.laType = costs[0].laType;
          this.laTime = costs[0]!.laTime! / 3600;
        })
    }
  }

  easytableBom(): void{
    this.columnsBom = [
      {key:'bomes.name', title:'Name', width: '50%'},
      {key:'qty', title:'Qty', width: '20%'},
      {key:'uoms.uom_name', title:'Uom', width: '20%'},
      {key:'',title:'Action', width: '10%'}
    ];
    this.configurationBom = { ...DefaultConfig };
    this.configurationBom.rows = 5;
    this.configurationBom.searchEnabled = false;
    this.configurationBom.headerEnabled = false;
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe(logPR => {
          logPR = logPR.filter(dataPR => dataPR.product === this.data);
          this.log = logPR.length;
        })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  checkImage(): void {
    if (this.selectedFiles){

    }else {
      this.checkBigger();
    }
  }

  checkBigger(): void {
    if(Number(this.datbprice) > Number(this.datlprice)){
      this.bbigger = true;
    }else{
      if(this.coru < 1){
        //this._snackBar.open("Bahan Baku tidak boleh kosong!", "Tutup", {duration: 5000});
        if (this.isNew){
          this.createData();
        }else{
          this.updateData();
        }
      }else{
        if (this.isNew){
          this.createData();
        }else{
          this.updateData();
        }
      }
    }
  }

  selectFiles(event: any): void {
    this.message = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          const msg = 'Uploaded the file successfully: ' + file.name;
          this.fileName = file.name;
          this.message.push(msg);
          this.imageInfos = this.uploadService.getFiles();
        },
        error: (err: any) => {
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  openStockDialog() {
    const dialog = this.dialog.open(StockMoveDialogComponent, {
      width: '75%',
      height: '60%',
      disableClose: true,
      data: this.data
    })
  }

  deleteBundle(id: string): void {
    this.bundleService.delete(id)
      .subscribe(res => {
        this.retrieveBundle();
      })
  }

  deleteBom(id: string): void {
    this.bomService.delete(id)
      .subscribe(res => {
        this.retrieveBom();
      })
  }

  onF(): void {
    this.openDropDown = !this.openDropDown;
  }

  onG(): void {
    this.openDropDown2 = !this.openDropDown2;
  }

  getProd(product: Product, index: number): void {
    this.currentIndex1 = index;
    this.onF();
    this.term = product.name!.toString();
    this.ph = product.name;
    this.bdatprod = product.name;
    this.bdatid = product.id;
    this.bdatqty = 1;
    this.bdatuom = product.uoms.id;
    this.bdatsuom = product.uoms.uom_name;
  }

  getProd2(product: Product, index: number): void {
    this.currentIndex2 = index;
    this.onG();
    this.term2 = product.name!.toString();
    this.pi = product.name;
    this.bodatprod = product.name;
    this.bodatid = product.id;
    this.bodatqty = 1;
    this.bodatuom = product.uoms.id;
    this.bodatsuom = product.uoms.uom_name;
  }

  pushingBundle(): void {
    const dataBundle = {
      bundle: this.data,
      qty: this.bdatqty,
      uom_id: this.bdatuom,
      product_id: this.bdatid
    };
    this.bundleService.create(dataBundle)
      .subscribe(res => {
        this.bdatid = undefined;
        this.bdatprod = undefined;
        this.bdatqty = undefined;
        this.bdatuom = undefined;
        this.bdatsuom = undefined;
        this.ph = "Ketik disini untuk cari";
        this.term = "";
        this.retrieveBundle();
      });
  }

  pushingBom(): void {
    const dataBom = {
      bom: this.bodatid,
      qty: this.bodatqty,
      uom: this.bodatuom,
      product: this.data,
      company_id: JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8))
    };
    this.bomService.create(dataBom)
      .subscribe(res => {
        this.bodatid = undefined;
        this.bodatprod = undefined;
        this.bodatqty = undefined;
        this.bodatuom = undefined;
        this.bodatsuom = undefined;
        this.pi = "Ketik disini untuk cari";
        this.term2 = "";
        this.retrieveBom();
      });
  }

  onFGChange(): void {
    this.cFG = !this.cFG;
  }

  onRMChange(): void {
    this.cRM = !this.cRM;
  }

  checkFG(): void {
    if(!this.datfg){
      if(this.bundles.length>0){
        for(let k=0;k<this.bundles.length;k++){
          this.bundleService.delete(this.bundles[k].id).subscribe();
          if(k == this.bundles.length-1) return;
        }
      }
    }
  }

  checkRM(): void {
    if(this.datrm) {
      const costing = {
        product: this.data, overhead: 0, ovType: "fix", ovTime: 0, labor: 0, laType: "fix", laTime: 0
      }
      this.costingService.create(costing)
        .subscribe(cost => {});
    }else {
      this.costingService.delete(this.costid)
        .subscribe(costdel => {
          if(this.boms.length>0){
            for(let k=0;k<this.boms.length;k++){
              this.bomService.delete(this.boms[k].id).subscribe();
              if(k == this.boms.length-1) return;
            }
          }
        })
    }
  }

  updateData(): void {
    if(this.cRM) this.checkRM();
    if(this.cFG) this.checkFG();
    if (!this.datname || this.datname == null
      || !this.datlprice || this.datlprice == null
      || !this.categoryid || this.categoryid == null
      || !this.datsuom || this.datsuom == null
      || !this.datpuom || this.datpuom == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if(!this.fileName){this.fileName = this.oriimage!};
      if(this.a+this.b==4){this.isUpdated = 'deactivate'};
      if(this.a+this.b==3){this.isUpdated = 'activate'};
      if(this.datsku != this.orisku){
        this.isUpdated = this.isUpdated + ", from " 
        + this.orisku + " to " + this.datsku;
      }
      if (this.datname != this.oriname){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oriname + " to " + this.datname;
      }
      if (this.datdesc != this.oridesc){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oridesc + " to " + this.datdesc;
      }
      if (this.datbarcode != this.oribarc){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oribarc + " to " + this.datbarcode;
      }
      if (this.datlprice != this.orilprice){
        this.isUpdated = this.isUpdated + ", from " 
        + this.orilprice + " to " + this.datlprice;
      }
      if (this.datbprice != this.oribprice){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oribprice + " to " + this.datbprice;
      }
      if (this.datcost != this.oricost){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oricost + " to " + this.datcost;
      }
      if (this.categoryid != this.oricategoryid){
        this.isUpdated = this.isUpdated + ", Kategori diganti";
      }
      if (this.brandid != this.oribrandid){
        this.isUpdated = this.isUpdated + ", Merk diganti";
      }
      if (this.partnerid != this.oripartnerid){
        this.isUpdated = this.isUpdated + ", Supplier diganti";
      }
      if (this.datsuom != this.orisuom){
        this.isUpdated = this.isUpdated + ", Satuan Jual diganti";
      }
      if (this.datpuom != this.oripuom){
        this.isUpdated = this.isUpdated + ", Satuan Beli diganti";
      }
      if (this.taxinid != this.oritaxinid){
        this.isUpdated = this.isUpdated + ", Pajak Masukan diganti";
      }
      if (this.taxoutid != this.oritaxoutid){
        this.isUpdated = this.isUpdated + ", Pajak Keluaran diganti";
      }
      if (this.datmin != this.orimin){
        this.isUpdated = "Min:" + this.isUpdated + ", from " 
        + this.orimin + " to " + this.datmin;
      }
      if (this.datmax != this.orimax){
        this.isUpdated = "Max:" + this.isUpdated + ", from " 
        + this.orimax + " to " + this.datmax;
      }
      if (this.fileName != this.oriimage){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oriimage + " to " + this.fileName;
      }
      const dataProd = {
        sku: this.datsku,
        name: this.datname,
        description: this.datdesc,
        barcode: this.datbarcode,
        listprice: this.datlprice,
        botprice: this.datbprice,
        uom_id: this.datsuom,
        puom_id: this.datpuom,
        cost: this.datcost,
        isStock: this.isStock,
        productcat_id: this.categoryid,
        tax_id: this.taxinid,
        taxout_id: this.taxoutid,
        image: this.fileName,
        brand_id: this.brandid,
        min: this.datmin,
        max: this.datmax,
        fg: this.datfg,
        rm: this.datrm,
        supplier: this.partnerid,
        active: this.isChecked,
        message: this.isUpdated,
        user: this.globals.userid,
        company: JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)),
      };
      this.productService.update(this.data, dataProd)
        .subscribe({
          next: (res) => {
            this.closeDialog();
          },
          error: (e) => {
            this._snackBar.open(e.error.message, "Tutup", {duration: 5000});
            return;
          }
        });
    }
  }

  createData(): void {
    if (!this.datname || this.datname == null
      || !this.datlprice || this.datlprice == null
      || !this.categoryid || this.categoryid == null
      || !this.datsuom || this.datsuom == null
      || !this.datpuom || this.datpuom == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        sku: this.datsku,
        name: this.datname,
        description: this.datdesc,
        barcode: this.datbarcode,
        listprice: this.datlprice,
        botprice: this.datbprice,
        uom_id: this.datsuom,
        puom_id: this.datpuom,
        cost: this.datcost,
        isStock: this.isStock,
        productcat_id: this.categoryid,
        brand_id: this.brandid,
        tax_id: this.taxinid,
        taxout_id: this.taxoutid,
        image: 'default.png',
        fg: this.datfg,
        rm: this.datrm,
        qoh: 0,
        min: this.datmin,
        max: this.datmax,
        supplier: this.partnerid,
        active: this.isChecked,
        user: this.globals.userid,
        company: JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)),
      };
      this.productService.create(data)
        .subscribe({
          next: (res) => {
            this.closeDialog();
          },
          error: (e) => {
            this._snackBar.open(e.error.message, "Tutup", {duration: 5000});
            return;
          }
        });
    }
  }
}