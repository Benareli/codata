import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { BaseURL } from 'src/app/baseurl';
import { Globals } from 'src/app/global';
import { Product } from 'src/app/models/masterdata/product.model';
import { Productcat } from 'src/app/models/masterdata/productcat.model';
import { Brand } from 'src/app/models/masterdata/brand.model';
import { Uom } from 'src/app/models/masterdata/uom.model';

import { ProductService } from 'src/app/services/masterdata/product.service';
import { ProductCatService } from 'src/app/services/masterdata/product-cat.service';
import { BrandService } from 'src/app/services/masterdata/brand.service';

import { ProductDialogComponent } from '../../dialog/masterdata/product-dialog.component';
import { StockMoveDialogComponent } from '../../dialog/transaction/stockmove/stockmove-dialog.component';
import { UploadDialogComponent } from '../../dialog/upload-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class ProductComponent implements OnInit {
  loaded: boolean = false;
  products: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  uom?: Uom[];
  isShow = false;
  categoryid?: any;
  brandid?: any;
  isIU = false;
  isIM = false;
  isAdm = false;
  dattoggle?: string = "true";
  toggle?: boolean = true;

  columns: Columns[];
  configuration: Config;

  cols: number;
  rowHeight: string;
  term: string;

  baseUrl = BaseURL.BASE_URL;

  width = 0;
  @HostListener('window:resize', ['$event'])
    onResize() {
      if(window.innerWidth>=1024){this.cols = 5; this.rowHeight = "90pt";}
      else if(window.innerWidth<1024&&window.innerWidth>=800){this.cols = 4; this.rowHeight = "90pt";}
      else if(window.innerWidth<800){this.cols = 1; this.rowHeight = "25pt";}
    }

  constructor(
    private router: Router,
    private globals: Globals,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkRole();
    if(window.innerWidth>=1024){this.cols = 5; this.rowHeight = "90pt";}
    else if(window.innerWidth<1024&&window.innerWidth>=800){this.cols = 4; this.rowHeight = "90pt";}
    else if(window.innerWidth<800){this.cols = 1; this.rowHeight = "25pt";}
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIU) this.router.navigate(['/']);
    this.retrieveProduct();
  }

  retrieveProduct(): void {
    this.loaded = true;
    this.productService.getAll()
      .subscribe(prod => {
        if(this.isIM || this.isAdm){
          this.products = prod;
        }else{
          this.products = prod.filter(data => data.active == true);
        }
        this.loaded = false;
        this.columns = [
          {key:'name', title:'Name', orderBy:'asc', width: '40%'},
          {key:'qoh', title:'Qty', width:'7%'},
          {key:'uoms.uom_name', title:'Uom', width:'7%'},
          {key:'listprice', title:'Sale Price', width:'10%'},
          {key:'productcats.description', title:'Category', width:'10%'},
          {key:'brands.description', title:'Brand', width:'10%'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
        /*this.configuration.tableLayout.borderless = true;
        this.configuration.tableLayout.striped = true;*/
      })
    this.productCatService.findAllActive()
      .subscribe(dataPC => {
        this.productcats = dataPC;
      });
    this.brandService.findAllActive()
      .subscribe(dataB => {
        this.brands = dataB;
      });
  }

  onToggleChange(vals: string) {
    this.dattoggle = vals;
    if (this.dattoggle == 'true'){
      this.dattoggle = "true";
      this.toggle = true;
    }else{
      this.dattoggle = "false";
      this.toggle = false;
    }
  }

  openCard(product: Product): void {
    const dialog = this.dialog.open(ProductDialogComponent, {
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: product.id
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(ProductDialogComponent, {
        maxWidth: '98vw',
        maxHeight: '98vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        disableClose: true,
        data: $event.value.row.id
      })
        .afterClosed()
        .subscribe(() => this.retrieveProduct());
    }
  }

  openStockDialog(id: string) {
    const dialog = this.dialog.open(StockMoveDialogComponent, {
      width: '75%',
      height: '60%',
      disableClose: true,
      data: id
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  openQuickAdd(): void {
    const dialog = this.dialog.open(ProductDialogComponent, {
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  openUpload() {
    const dialog = this.dialog.open(UploadDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: "product"
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  toggleDisplay() {
    if(this.toggle) this.configuration.searchEnabled = !this.configuration.searchEnabled;
    else console.log("KEODE");
  }
}