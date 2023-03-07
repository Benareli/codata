import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Product } from 'src/app/models/masterdata/product.model';
import { Uom } from 'src/app/models/masterdata/uom.model';
import { Bom } from 'src/app/models/masterdata/bom.model';

import { ProductService } from 'src/app/services/masterdata/product.service';
import { UomService } from 'src/app/services/masterdata/uom.service';
import { BomService } from 'src/app/services/masterdata/bom.service';

import { BomDialogComponent } from '../../dialog/bom-dialog.component';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class BomComponent implements OnInit {
  loaded = false;
  isShow = false;
  isProdU = false;
  isProdM = false;
  isAdm = false;
  products?: Product[];
  boms?: Bom[];
  uom?: Uom[];
  bomes: any;

  columns: Columns[];
  configuration: Config;

  constructor(
    private router: Router,
    private globals: Globals,
    private productService: ProductService,
    private uomService: UomService,
    private bomService: BomService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="production_user") this.isProdU=true;
      if(this.globals.roles![x]=="production_manager") this.isProdM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isProdU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void {
    this.loaded = true;
    this.bomService.findByProductAggr()
      .subscribe(bom => {
        this.loaded = false;
        this.bomes = bom;
        this.columns = [
          {key:'name', title:'Name', orderBy:'asc', width: '50%'},
          {key:'totalline', title:'# of Component', width:'30%'},
          {key:'', title:'Action', width:'20%'},
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
      })
  }

  openQuickAdd(): void {
    const dialog = this.dialog.open(BomDialogComponent, {
      width: '100vh',
      height: '100vw',
      disableClose: true
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  openDialog($event: { event: string; value: any }): void {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(BomDialogComponent, {
        width: '100vh',
        height: '100vw',
        disableClose: true,
        data: $event.value.row.product_id
      })
        .afterClosed()
        .subscribe(() => this.retrieveData());
    }
  }

  applyFilter(event: Event): void {

  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
}
