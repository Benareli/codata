import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { API, APIDefinition } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Purchase } from 'src/app/models/transaction/purchase.model';
import { Purchasedetail } from 'src/app/models/transaction/purchasedetail.model';
import { Product } from 'src/app/models/masterdata/product.model';
import { Productcat } from 'src/app/models/masterdata/productcat.model';
import { Brand } from 'src/app/models/masterdata/brand.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';

import { PurchaseService } from 'src/app/services/transaction/purchase.service';
import { PurchasedetailService } from 'src/app/services/transaction/purchasedetail.service';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { ProductCatService } from 'src/app/services/masterdata/product-cat.service';
import { BrandService } from 'src/app/services/masterdata/brand.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';

import { PurchaseDialogComponent } from '../../dialog/purchase/purchase-dialog.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class PurchaseComponent implements OnInit {
  partners?: Partner[];
  warehouses?: Warehouse[];
  purchases: Purchase[];
  purchasedetails: Purchasedetail[];
  isPurU = false;
  isPurM = false;
  isAdm = false;
  isShow = false;

  supplierString?: string;
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
    private purchaseService: PurchaseService,
    private purchasedetailService: PurchasedetailService,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit(): void {
    this.checkRole();
    this.columns = [
      {key:'purchase_id', title:'PO Number', orderBy:'asc', width: '15%'},
      {key:'date', title:'Date', width:'10%'},
      {key:'supplier.name', title:'Partner', width:'18%'},
      {key:'amount_untaxed', title:'Amount Untaxed', width:'10%'},
      {key:'discount', title:'Discount', width:'8%'},
      {key:'amount_tax', title:'Tax', width:'10%'},
      {key:'amount_total', title:'Total', width:'15%'},
      {key:'open', title:'Open', width:'7%'},
      {key:'',title:'', width:'8%'}
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
      if(this.globals.roles![x]=="purchase_user") this.isPurU=true;
      if(this.globals.roles![x]=="purchase_manager") this.isPurM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPurU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void {
    this.purchaseService.getAll()
      .subscribe(dataPur => {
        this.purchases = dataPur;
      })
    this.partnerService.findAllActiveSupplier()
      .subscribe(dataSup => {
        this.partners = dataSup;
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
    
    this.purchasedetailService.getByPOId(row)
      .subscribe(purdet => {
        this.purchasedetails = purdet;
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

  addPurchase(): void {
    const dialog = this.dialog.open(PurchaseDialogComponent, {
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,   
    }).afterClosed().subscribe(result => {
      if(result) this.openDialog(result);
      this.retrieveData();
    });
  }

  openDialog(id: string) {
    const dialog = this.dialog.open(PurchaseDialogComponent, {
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: id
    }).afterClosed().subscribe(result => {
      if(result) this.openDialog(result);
      this.retrieveData();
    });
  }
}
