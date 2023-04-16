import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';

import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';

import { WarehouseDialogComponent } from '../../dialog/masterdata/warehouse-dialog.component';
import { UploadDialogComponent } from '../../dialog/upload/upload-dialog.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class WarehouseComponent implements OnInit {
  warehouses!: Warehouse[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  
  //Add
  warehouseadd: Warehouse = {
    name: '',
    short: '',
    main: false,
    active: true
  };
  
  columns!: Columns[];
  configuration!: Config;
 
  constructor(
    private router: Router,
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private warehouseService: WarehouseService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.checkRole();
  }
  
  toggleDisplay() {
    this.configuration.searchEnabled = !this.configuration.searchEnabled;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM) this.router.navigate(['/']);
    this.retrieveWarehouse();
  }

  retrieveWarehouse(): void {
    this.warehouseService.getAll()
      .subscribe(wh => {
        if(this.isIM || this.isAdm){
          this.warehouses = wh;
        }else{
          this.warehouses = wh.filter(data => data.active == true);
        }
        this.columns = [
          {key:'short', title:'Short', width: '30%'},
          {key:'name', title:'Name', orderBy:'asc', width:'35%'},
          {key:'companys.comp_name', title:'Company', width:'35%'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
      });
  }

  saveWarehouse(): void {
    if(!this.warehouseadd.short || this.warehouseadd.short == null
      || !this.warehouseadd.name || this.warehouseadd.name == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        name: this.warehouseadd.name,
        short: this.warehouseadd.short,
        main: false,
        active: this.warehouseadd.active,
        user: this.globals.userid
      };
      this.warehouseService.create(data)
        .subscribe(res => {
          this.retrieveWarehouse();
          this.warehouseadd = {
            name: '',
            short: '',
            main: false,
            active: true
          };
        });
    }
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(WarehouseDialogComponent, {
        maxWidth: '98vw',
        maxHeight: '98vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        disableClose: true,
        data: $event.value.row
      })
        .afterClosed()
        .subscribe(() => this.retrieveWarehouse());
    }
  }

  openUpload() {
    const dialog = this.dialog.open(UploadDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: "warehouse"
    })
      .afterClosed()
      .subscribe(() => this.retrieveWarehouse());
  }
}