import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Globals } from 'src/app/global';
import { Brand } from 'src/app/models/brand.model';
import { Log } from 'src/app/models/log.model';

import { BrandService } from 'src/app/services/brand.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-brand-dialog',
  templateUrl: './brand-dialog.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class BrandDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<BrandDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private brandService: BrandService,
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
        logPR = logPR.filter(dataPR => dataPR.brand === this.data.id);
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
    if(!this.data.description || this.data.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if (this.a+this.b==4){this.isUpdated = 'deactivate'};
      if (this.a+this.b==3){this.isUpdated = 'activate'};
      if (this.currDescription != this.data.description){
        this.isUpdated = this.isUpdated + " from " + this.currDescription + 
        " to " + this.data.description;
      }
      const data = {
        message: this.isUpdated,
        description: this.data.description,
        active: this.isChecked,
        user: this.globals.userid
      };
      this.brandService.update(this.data.id, data)
        .subscribe({
          next: (res) => {
            this.closeDialog();
          },
          error: (e) => {
            this._snackBar.open(e.error.message, "Tutup", {duration: 5000});
            return;
          }
        });
    }
  }
}
