import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';

import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { API, APIDefinition } from 'ngx-easy-table';

import { SaleDialogComponent } from '../dialog/sale-dialog.component';

import { Sale } from 'src/app/models/sale.model';
import { SaleService } from 'src/app/services/sale.service';
import { Saledetail } from 'src/app/models/saledetail.model';
import { SaledetailService } from 'src/app/services/saledetail.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class SaleComponent implements OnInit {
  partners?: Partner[];
  warehouses?: Warehouse[];
  sales: Sale[];
  saledetails: Saledetail[];
  isSalU = false;
  isSalM = false;
  isAdm = false;
  isShow = false;

  customerString?: string;
  warehouseString?: string;

  columns: Columns[];
  configuration: Config;
  @ViewChild('table', { static: true }) table: APIDefinition;
  toggledRows = new Set<number>();
  
  nestedConfiguration: Config;
  nestedColumns: Columns[] = [
    {key:'product.name', title:'Product', width:'50%'},
    {key:'qty', title:'Qty', width:'15%'},
    {key:'uom.uom_name', title:'Uom', width:'15%'},
  ];

  currentIndex = -1;

  constructor(
    private router: Router,
    private globals: Globals,
    private dialog: MatDialog,
    private saleService: SaleService,
    private saledetailService: SaledetailService,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit(): void {
    this.checkRole();
    this.columns = [
      {key:'sale_id', title:'SO Number', orderBy:'asc', width: '15%'},
      {key:'date', title:'Date', width:'10%'},
      {key:'customer.name', title:'Partner', width:'18%'},
      {key:'amount_untaxed', title:'Amount Untaxed', width:'10%'},
      {key:'discount', title:'Discount', width:'8%'},
      {key:'amount_tax', title:'Tax', width:'10%'},
      {key:'amount_total', title:'Total', width:'15%'},
      {key:'open', title:'Open', width:'7%'},
      {key:'',title:'Quick View', width:'8%'}
    ];
    this.configuration = { ...DefaultConfig };
    this.configuration.columnReorder = true;
    this.configuration.searchEnabled = false;
    this.configuration.detailsTemplate = true;
    this.configuration.tableLayout.hover = true;

    this.nestedConfiguration = { ...DefaultConfig };
    this.nestedConfiguration.rows = 5;
    this.nestedConfiguration.paginationEnabled = false;
    this.nestedConfiguration.searchEnabled = false;
    this.nestedConfiguration.detailsTemplate = true;
    this.nestedConfiguration.tableLayout.striped = true;
  }

  toggleDisplay() {
    this.configuration.searchEnabled = !this.configuration.searchEnabled;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="sale_user") this.isSalU=true;
      if(this.globals.roles![x]=="sale_manager") this.isSalM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isSalU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void {
    this.saleService.getAll()
      .subscribe(dataSal => {
        this.sales = dataSal;
      })
    this.partnerService.findAllActiveCustomer()
      .subscribe(dataCus => {
        this.partners = dataCus;
      })
    this.warehouseService.findAllActive()
      .subscribe(datawh => {
        this.warehouses = datawh;
        this.warehouseString = datawh[0].id;
      })
  }

  onRowClickEvent($event: MouseEvent, index: number, row: any): void {
    $event.preventDefault();
    if(this.currentIndex >= 0){
      this.table.apiEvent({
        type: API.toggleRowIndex,
        value: this.currentIndex,
      });
    }
    
    this.saledetailService.getBySOId(row)
      .subscribe(saldet => {
        this.saledetails = saldet;
        if (this.toggledRows.has(index)) {
          this.toggledRows.delete(index);
        }else{
          this.toggledRows.add(index);
        }
      })

    if(this.currentIndex != index){
      this.table.apiEvent({
        type: API.toggleRowIndex,
        value: index,
      });
      this.currentIndex = index;
    }else{
      this.currentIndex = -1;
    }
  }

  addSale(): void {
    const dialog = this.dialog.open(SaleDialogComponent, {
      width: '100vw',
      height: '100%',
      disableClose: true,   
    }).afterClosed().subscribe(result => {
      if(result) this.openDialog(result);
      this.retrieveData();
    });
  }

  openDialog(id: string) {
    const dialog = this.dialog.open(SaleDialogComponent, {
      width: '100vw',
      height: '100%',
      disableClose: true,
      data: id
    }).afterClosed().subscribe(result => {
      if(result) this.openDialog(result);
      this.retrieveData();
    });
  }
}