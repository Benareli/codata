import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';

import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Uom } from 'src/app/models/uom.model';
import { UomService } from 'src/app/services/uom.service';
import { Bom } from 'src/app/models/bom.model';
import { BomService } from 'src/app/services/bom.service';
import { BomDialogComponent } from '../dialog/bom-dialog.component';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['../style/main.component.sass']
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

  //Table
  displayedColumns: string[] = 
  ['product', 'line', 'action'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;

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
    /*prod = prod.filter
    (data => data.active === true)*/
    this.loaded = true;
    /*this.bomService.getAll()
      .subscribe(bom => {
        
      });*/
    this.bomService.findByProductAggr()
      .subscribe(bom => {
        this.loaded = false;
        this.boms = bom;
        this.dataSource.data = bom;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  openQuickAdd(): void {
    const dialog = this.dialog.open(BomDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true
      //data: id
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  openDialog(id: String): void {
    const dialog = this.dialog.open(BomDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: id
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  applyFilter(event: Event): void {

  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }
}
