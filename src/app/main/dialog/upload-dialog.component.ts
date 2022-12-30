import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';

type AOA = any[][];

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class UploadDialogComponent implements OnInit {
  isPM = false;
  isIM = false;
  isPURM = false;
  isPOSM = false;
  isAdm = false;
  isRes = false;
  checker = 0;
  alerted = false;
  success = false;
  btntxt?: string="Upload";

  //Data
  indexes: Array<any> = [];
  emptys: Array<any> = [];
  brands?: Brand[];
  productcats?: Productcat[];
  warehouses?: Warehouse[];
  partners?: Partner[];
  products?: Product[];

  //XLSX
  sample: string = 'Sample Data';
  filename: string = 'SoftSolution.xlsx';
  data1?: AOA;
  message!: string;
  msgsuccess!: string;
  datas!: any;
  converted!: string;
  type!: string;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private brandService: BrandService,
    private productCatService: ProductCatService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private partnerService: PartnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if(this.data=="brand"){
      this.data1 = [["nama"], ["merk 1"], ["merk 2"], ["merk 3"]];
    }else if(this.data=="product category"){
      this.data1 = [["id","nama"], ["ID001","kategori 1"], 
        ["ID002","kategori 2"], ["ID003","kategori 3"]];
    }else if(this.data=="warehouse"){
      this.data1 = [["kode","nama"], ["WH1","Gudang 1"], 
        ["WH2","Gudang 2"], ["WH3","Gudang 3"]];
    }else if(this.data=="partner"){
      this.data1 = [["kode","nama","phone","pelanggan","supplier"], ["CUST1","John Doe","0813","ya",""], 
        ["CUST2","Jane Doe","0817","ya","ya"],["CUST3","Jack Doe","0855","","ya"]];
    }else if(this.data=="product"){
      this.data1 = [["sku","nama","deskripsi","tipe","satuan_jual","satuan_beli","hargajual","hargabatas","hpp","kategori","merek","pajakmasuk","pajakkeluar"], 
      ["PROD001","Book 1","Author Mr X","barang","Pcs","Pcs","100000","","70000","category 1","brand 1","11","11"], 
      ["PROD002","Book 2","","barang","Pcs","Lusin","90000","87500","60000","category 1","brand 2","11","11"],
      ["SERV001","Servis 1","Servis Buku","jasa","","","50000","","","category 1","","",""]];
    }
    this.success = false;
    this.alerted = false;
    this.checkRole();
    this.getAllData();
  }

  getAllData(): void {
    this.brandService.findAllActive()
      .subscribe(brand => {
        this.brands = brand;
      })
    this.productCatService.findAllActive()
      .subscribe(prodcat => {
        this.productcats = prodcat;
      })
    this.warehouseService.findAllActive()
      .subscribe(wh => {
        this.warehouses = wh;
      })
    this.partnerService.findAllActive()
      .subscribe(partner => {
        this.partners = partner;
      })
    this.productService.findAllActive()
      .subscribe(product => {
        this.products = product;
      })
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="purchase_manager") this.isPURM=true;
      if(this.globals.roles![x]=="pos_manager") this.isPOSM=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="partner_manager") this.isPM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPM || !this.isPURM || !this.isPOSM || !this.isIM || !this.isAdm) this.isRes = true;
  }

  onFileChange(event: any) {
    this.sample = '';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(event.target.files[0]);
    fileReader.onload = (event) => {
      let workbook = XLSX.read(event.target?.result,{type:'binary'});
      //let wsname = workbook.SheetNames[0];
      //let wsname = XLSX.read(event.target?.result,{type:'binary'}).SheetNames[0];
      let ws: XLSX.WorkSheet = workbook.Sheets[XLSX.read(event.target?.result,{type:'binary'}).SheetNames[0]];
      this.datas = XLSX.utils.sheet_to_json(ws, {raw:true});
      this.data1 = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    }
  }

  startSequence(): void {
    if(this.data=="brand"){
      let index = this.brands!.findIndex(a => a.description === this.datas[this.checker].nama);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].nama==''||this.datas[this.checker].nama==null) this.emptys.push(this.checker + 1);
      this.checkers();
    }else if(this.data=="product category"){
      let index = this.productcats!.findIndex(a => a.description === this.datas[this.checker].nama);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].nama==''||this.datas[this.checker].nama==null) this.emptys.push(this.checker + 1);
      this.checkers();  
    }else if(this.data=="warehouse"){
      let index = this.warehouses!.findIndex(a => a.name === this.datas[this.checker].nama);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].nama==''||this.datas[this.checker].nama==null) this.emptys.push(this.checker + 1);
      this.checkers();  
    }else if(this.data=="partner"){
      let index = this.partners!.findIndex(a => a.name === this.datas[this.checker].nama);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].nama==''||this.datas[this.checker].nama==null) this.emptys.push(this.checker + 1);
      this.checkers();  
    }else if(this.data=="product"){
      let index = this.products!.findIndex(a => a.name === this.datas[this.checker].nama);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].kategori==''||this.datas[this.checker].kategori==null) this.emptys.push(this.checker + 1);
      if(this.datas[this.checker].nama==''||this.datas[this.checker].nama==null) this.emptys.push(this.checker + 1);
      this.checkers();  
    }
  }

  checkers(): void {
    this.checker = this.checker+1;
    if(this.checker == this.datas.length) {
      this.checker = 0;
      if(this.indexes.length>0||this.emptys.length>0){
        this.alerted = true;
        this.message = "Line " + this.indexes + " existed!";
        if(this.emptys.length>0) this.message = this.message + "\n" + "Line " + this.emptys + " empty!";
      }else{
        this.insertMany();
      }
    }
    else {
      this.startSequence();
    }
  }

  insertMany(): void {
    this.alerted = false;
    this.success = false;
    if(this.data=="brand"){
      this.brandService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {
          this.success=true; this.msgsuccess="Data Uploaded!"
        }, error => {this.alerted=true;this.message="Line "+error.error[0]+" duplicated!"})
    }else if(this.data=="product category"){
      this.productCatService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {
          this.success=true; this.msgsuccess="Data Uploaded!"
        }, error => {this.alerted=true;this.message="Line "+error.error[0]+" duplicated!"})
    }else if(this.data=="warehouse"){
      this.warehouseService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {
          this.success=true; this.msgsuccess="Data Uploaded!"
        }, error => {this.alerted=true;this.message="Line "+error.error[0]+" duplicated!"})
    }else if(this.data=="partner"){
      this.partnerService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {
          this.success=true; this.msgsuccess="Data Uploaded!"
        }, error => {this.alerted=true;this.message="Line "+error.error[0]+" duplicated!"})
    }else if(this.data=="product"){
      this.productService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {
          this.success=true; this.msgsuccess="Data Uploaded!"
        }, error => {console.log(error.error);
          this.alerted=true;this.message="Line "+error.error[0]+" duplicated/skipped(Category no match)!"})
    }
    this.btntxt="Close";
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if(this.alerted||this.success){
      this.closeDialog();
    }else{
      this.msgsuccess='';
      this.message='';
      this.indexes=[];
      this.emptys=[];
      this.startSequence();
    }
  }
}
