import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Globals } from 'src/app/global';
import { Productcat } from 'src/app/models/masterdata/productcat.model';
import { Log } from 'src/app/models/settings/log.model';

import { ProductCatService } from 'src/app/services/masterdata/product-cat.service';
import { LogService } from 'src/app/services/settings/log.service';

@Component({
  selector: 'app-productcat-dialog',
  templateUrl: './productcat-dialog.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class ProductcatDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;

  a = 0; b = 0;
  isUpdated = 'update';
  currCatId?: string;
  currDescription?: string;
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<ProductcatDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private productCatService: ProductCatService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
    this.currCatId = this.data.catid;
    this.currDescription = this.data.description;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
    this.retrieveLog();
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe(logPR => {
        logPR = logPR.filter(dataPR => dataPR.category === this.data.id);
        this.log = logPR.length;
      })
  }

  onValChange(val: string) {
    this.statusActive = val;
    if (this.statusActive == 'true'){
      this.isChecked = true;
      this.b = 2;
    }else{
      this.isChecked = false;
      this.b = 4;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if (!this.data.catid || this.data.catid == null || !this.data.description || this.data.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if (this.a+this.b==4){this.isUpdated = 'deactivate'};
      if (this.a+this.b==3){this.isUpdated = 'activate'};
      if (this.currDescription != this.data.description){
        this.isUpdated = this.isUpdated + ", from " 
        + this.currDescription + " to " + this.data.description;
      }
      if (this.currCatId != this.data.catid){
        this.isUpdated = this.isUpdated + ", from " 
        + this.currCatId + " to " + this.data.catid;
      }
      const data = {
        catid: this.data.catid,
        description: this.data.description,
        active: this.isChecked,
        message: this.isUpdated,
        user: this.globals.userid
      };
      this.productCatService.update(this.data.id, data)
        .subscribe({
          next: (res) => {
            this.closeDialog();
          },
          error: (e) => {
            console.log(e);
            this._snackBar.open(e.error.message, "Tutup", {duration: 5000});
            this.closeDialog();
            return;
          }
        });
    }
  }
}
