import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { API, APIDefinition } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Sale } from 'src/app/models/transaction/sale.model';
import { Saledetail } from 'src/app/models/transaction/saledetail.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';

import { SaleService } from 'src/app/services/transaction/sale.service';
import { SaledetailService } from 'src/app/services/transaction/saledetail.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';
import { SharedService } from 'src/app/shared.service';

import { SaleDialogComponent } from '../../dialog/transaction/sale/sale-dialog.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class SaleComponent implements OnInit {
  partners?: Partner[];
  warehouses?: Warehouse[];
  sales!: Sale[];
  saledetails!: Saledetail[];
  isSalU = false;
  isSalM = false;
  isAdm = false;
  isShow = false;

  customerString?: string;
  warehouseString?: string;

  columns!: Columns[];
  configuration!: Config;
  @ViewChild('table', { static: true }) table!: APIDefinition;
  toggledRows = new Set<number>();
  
  nestedConfiguration!: Config;
  nestedColumns: Columns[] = [
    {key:'products.name', title:'Product', width:'50%'},
    {key:'qty', title:'Qty', width:'15%'},
    {key:'uoms.uom_name', title:'Uom', width:'15%'},
  ];

  currentIndex = -1;

  constructor(
    private router: Router,
    private globals: Globals,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private saleService: SaleService,
    private saledetailService: SaledetailService,
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
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,    
    }).afterClosed().subscribe(result => {
      if(result) {
        this.sharedService.setLoading(true)
        setTimeout(() => {
          this.sharedService.setLoading(false)
          this.openDialog(result);
        },100); 
      }else{
        this.retrieveData();
      }
    });
  }

  openDialog(id: string) {
    const dialog = this.dialog.open(SaleDialogComponent, {
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: id
    }).afterClosed().subscribe(result => {
      if(result) {
        this.sharedService.setLoading(true)
        setTimeout(() => {
          this.sharedService.setLoading(false)
          this.openDialog(result);
        },100); 
      }else{
        this.retrieveData();
      }
    });
  }
}