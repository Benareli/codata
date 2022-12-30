import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { Observable, of } from "rxjs";
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatGridList } from '@angular/material/grid-list';
import { DataFilter, filterOption } from 'src/app/models/datafilter';

import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { BaseURL } from 'src/app/baseurl';

import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Uom } from 'src/app/models/uom.model';
import { UomService } from 'src/app/services/uom.service';
import { ProductDialogComponent } from '../dialog/product-dialog.component';
import { StockMoveDialogComponent } from '../dialog/stockmove-dialog.component';
import { UploadDialogComponent } from '../dialog/upload-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../style/main.component.sass']
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

  //filterCat: string = '';
  //filterBrand: string = '';
  
  //View
  //currentProduct: Product = {};
  //searchProd='';

  //Table
  /*displayedColumns: string[] = 
  ['name', 'qty', 'uom', 'listprice',
  'category', 'brand', 'stock'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;*/

  //Dialog Data
  //clickedRows = null;

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
    private uomService: UomService,
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
    /*prod = prod.filter
    (data => data.active === true)*/
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
          {key:'suomName', title:'Uom', width:'7%'},
          {key:'listprice', title:'Sale Price', width:'10%'},
          {key:'categoryName', title:'Category', width:'10%'},
          {key:'brandName', title:'Brand', width:'10%'}
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
    /*if(this.isIM || this.isAdm){
      this.productService.getAll()
        .subscribe(prod => {
          this.loaded = false;
          this.products = prod;
          this.dataSource.data = prod;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }else{
      this.productService.findAllActive()
        .subscribe(prod => {
          this.loaded = false;
          this.products = prod;
          this.dataSource.data = prod;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }*/
  }

  /*searchActive(): void {
    this.dataSource.data = this.products!.filter(prod => prod.active === true);
  }
  searchInactive(): void {
    this.dataSource.data = this.products!.filter(prod => prod.active === false);
  }

  applyCatFilter(event: MatSelectChange) {
    //this.dataSource.data = this.products!.filter(prod => prod.category._id === event.value);
    this.filterCat = event.value;
    this.filter();
  }

  applyBrandFilter(event: MatSelectChange) {
    this.filterBrand = event.value;
    this.filter();
  }

  filter(): void {
    if(this.filterCat===''&&this.filterBrand===''){
      this.retrieveProduct();
    }else if(this.filterCat===''){
      this.dataSource.data = this.products!
        .filter(prod => 
          prod.brand._id === this.filterBrand
      );
    }else if(this.filterBrand===''){
      this.dataSource.data = this.products!
        .filter(prod => 
          prod.category._id === this.filterCat
      );
    }else{
      this.dataSource.data = this.products!
        .filter(prod => 
          prod.brand._id === this.filterBrand &&
          prod.category._id === this.filterCat
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }*/

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
      width: '98%',
      height: '90%',
      disableClose: true,
      data: product._id
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(ProductDialogComponent, {
        width: '98%',
        height: '90%',
        disableClose: true,
        data: $event.value.row._id
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
      width: '98%',
      height: '90%',
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