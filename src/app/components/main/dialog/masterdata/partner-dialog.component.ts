import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/shared.service';
import * as CryptoJS from 'crypto-js';

import { Globals } from 'src/app/global';

import { LogService } from 'src/app/services/settings/log.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { CoaService } from 'src/app/services/accounting/coa.service';

@Component({
  selector: 'app-partner-dialog',
  templateUrl: './partner-dialog.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class PartnerDialogComponent implements OnInit {
  isChecked = false;
  isCustomer = false;
  isSupplier = false;
  isNew = false;
  datid?: string;
  datcode?: string;
  datname?: string;
  datphone?: string;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;
  coarecs?: any;
  coapays?: any;
  recId?: number;
  payId?: number;

  a = 0; b = 0;
  c = 0; d = 0;
  isUpdated = 'update';
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<PartnerDialogComponent>,
    private _snackBar: MatSnackBar,
    private partnerService: PartnerService,
    private coaService: CoaService,
    private globals: Globals,
    private logService: LogService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.sharedService.setLoading(true);
    this.retrieveData();
    if (this.data){
      this.datid = this.data.id;
      this.datcode = this.data.code;
      this.datname = this.data.name;
      this.datphone = this.data.phone;
      if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
      if (this.data.isCustomer == true){
        this.isCustomer = true;
      }
      if (this.data.isSupplier == true){
        this.isSupplier = true;
      }
    } else{
      this.isNew = true;
      this.statusActive = 'true';
      this.datcode = "";
      this.datname = "";
      this.datphone = "";
    }
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
  }

  retrieveData(): void {
    this.coaService.getAll()
      .subscribe(coa => {
        this.coarecs = coa.filter(coa => coa.type === 2);
        this.coapays = coa.filter(coa => coa.type === 3);
        this.recId = this.coarecs[0].id;
        this.payId = this.coapays[0].id;
        if(this.data){
          this.recId = this.data.receivable_id;
          this.payId = this.data.payable_id;
        }
        this.sharedService.setLoading(false);
      })
    this.logService.getAll()
      .subscribe(logPA => {
        logPA = logPA.filter(dataPR => dataPR.partner === this.datid);
        this.log = logPA.length;
      })
  }

  onValChange(val: string) {
    this.statusActive = val;
    if (this.statusActive == 'true'){
      this.isChecked = true;
    }else{
      this.isChecked = false;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if (!this.datname || this.datname == null){
      this._snackBar.open("Field (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if (this.a+this.b==4){this.isUpdated = 'deactivate'};
      if (this.a+this.b==3){this.isUpdated = 'activate'};
      if (this.datcode != this.data.code){
        this.isUpdated = this.isUpdated + ", from " 
        + this.data.code + " to " + this.datcode;
      }
      if (this.datname != this.data.name){
        this.isUpdated = this.isUpdated + ", from " 
        + this.data.name + " to " + this.datname;
      }
      if (this.datphone != this.data.phone){
        this.isUpdated = this.isUpdated + ", from " 
        + this.data.phone + " to " + this.datphone;
      }
      const data = {
        code: this.datcode,
        name: this.datname,
        phone: this.datphone,
        isCustomer: this.isCustomer,
        isSupplier: this.isSupplier,
        active: this.isChecked,
        message: this.isUpdated,
        user: this.globals.userid,
        receivable_id: this.recId,
        payable_id: this.payId,
      };
      this.partnerService.update(this.data.id, data)
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

  createData(): void {
    if (!this.datname || this.datname == null){
      this._snackBar.open("Field (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      this.isChecked = true;
      const data = {
        code: this.datcode,
        name: this.datname,
        phone: this.datphone,
        isCustomer: this.isCustomer,
        isSupplier: this.isSupplier,
        active: this.isChecked,
        user: this.globals.userid,
        receivable: this.recId,
        payable: this.payId,
      };
      this.partnerService.create(data)
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
