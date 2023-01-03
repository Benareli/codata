import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, UntypedFormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from "@angular/material/checkbox";

import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-store-dialog',
  templateUrl: './store-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class StoreDialogComponent implements OnInit {
  warehouses?: Warehouse[];
  statusActive?: string;
  isAdm = false;
  datname?: string = "";
  datphone?: string = "";
  dataddr?: string = "";
  warehouseid?: string;

  constructor(
    public dialogRef: MatDialogRef<StoreDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private warehouseService: WarehouseService,
    private storeService: StoreService,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    console.log(this.data);
    this.retrieveWarehouse();
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isAdm) {
      this.dialogRef.close();
    }else{
      if(this.data) this.retrieveStore();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  retrieveWarehouse(): void {
    this.warehouseService.findAllActive()
      .subscribe(whs => {
        this.warehouses = whs;
      })
  }

  retrieveStore(): void {
    this.storeService.get(this.data.id)
      .subscribe(stores => {
        this.datname = stores.store_name;
        this.dataddr = stores.store_addr;
        this.datphone = stores.store_phone;
        this.warehouseid = stores.warehouse._id;
      })
  }

  /*onIncludeChange(vals: string) {
    this.datinclude = vals;
    if (this.datinclude == 'true'){
      this.datinclude = "true";
      this.include = true;
    }else{
      this.datinclude = "false";
      this.include = false;
    }
  }*/

  updateData(): void {
    if(this.data){
      const store = {
        store_name: this.datname,
        store_addr: this.dataddr,
        store_phone: this.datphone,
        warehouse: this.warehouseid,
        active: true
      };
      this.storeService.update(this.data.id, store)
        .subscribe(res => {
          this.closeDialog();
        })
    }else{
      const store = {
        store_name: this.datname,
        store_addr: this.dataddr,
        store_phone: this.datphone,
        warehouse: this.warehouseid,
        active: true
      };
      this.storeService.create(store)
        .subscribe(res => {
          this.closeDialog();
        })
    }
  }
}
