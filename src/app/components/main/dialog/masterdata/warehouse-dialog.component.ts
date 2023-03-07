import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Warehouse } from 'src/app/models/warehouse.model';
import { Log } from 'src/app/models/log.model';
import { Stockmove } from 'src/app/models/stockmove.model';
import { Qop } from 'src/app/models/qop.model';
import { Company } from 'src/app/models/company.model';

import { WarehouseService } from 'src/app/services/warehouse.service';
import { LogService } from 'src/app/services/log.service';
import { StockmoveService } from 'src/app/services/stockmove.service';
import { QopService } from 'src/app/services/qop.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-warehouse-dialog',
  templateUrl: './warehouse-dialog.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class WarehouseDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isMain = false;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;

  a = 0; b = 0;
  isUpdated = 'update';
  currName?: string;
  currShort?: string;
  log = 0;

  companyid: number;
  companys: Company[];
  smin: Stockmove[];
  smout: Stockmove[];
  whqop: Qop[];
  columns: Columns[];
  configuration: Config;
  columnswh: Columns[];
  configurationwh: Config;

  constructor(
    public dialogRef: MatDialogRef<WarehouseDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private companyService: CompanyService,
    private warehouseService: WarehouseService,
    private stockmoveService: StockmoveService,
    private qopService: QopService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
        if (this.data.main == true){
          this.isMain = true;
        }
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
    this.currName = this.data.name;
    this.currShort = this.data.short;
    this.companyid = this.data.company_id;
    
    this.columns = [
      {key:'product.name', title:'Product', width:'55%'},
      {key:'qin', title:'Qty', width:'25%'},
      {key:'date', title:'Date', orderBy:'desc', width:'20%'}
    ];
    this.configuration = { ...DefaultConfig };
    this.configuration.rows = 5;
    this.configuration.columnReorder = true;
    this.configuration.searchEnabled = false;

    this.columnswh = [
      {key:'product.name', title:'Product', width:'55%'},
      {key:'qop', title:'Qty', width:'45%'},
    ];
    this.configurationwh = { ...DefaultConfig };
    this.configurationwh.rows = 5;
    this.configurationwh.columnReorder = true;
    this.configurationwh.searchEnabled = false;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
    this.retrieveData();
  }

  retrieveData(): void {
    this.logService.getAll()
      .subscribe(logPR => {
        logPR = logPR.filter(dataPR => dataPR.warehouse === this.data.id);
        this.log = logPR.length;
      })
    this.stockmoveService.findByWh(this.data.id)
      .subscribe(wh => {
        this.smin = wh.filter(datain => datain.qin);
        this.smout = wh.filter(dataout => dataout.qout);
      })
    this.qopService.getWhQop(this.data.id)
      .subscribe(whqop => {
        this.whqop = whqop;
      })
    this.companyService.getAll()
      .subscribe(comp => {
        this.companys = comp;
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
    if (!this.data.short || this.data.short == null || !this.data.name || this.data.name == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if (this.a+this.b==4){this.isUpdated = 'deactivate'};
      if (this.a+this.b==3){this.isUpdated = 'activate'};
      if (this.currName != this.data.name){
        this.isUpdated = this.isUpdated + ", from " 
        + this.currName + " to " + this.data.name;
      }
      if (this.currShort != this.data.short){
        this.isUpdated = this.isUpdated + ", from " 
        + this.currShort + " to " + this.data.short;
      }
      const data = {
        short: this.data.short,
        name: this.data.name,
        active: this.isChecked,
        message: this.isUpdated,
        user: this.globals.userid
      };
      this.warehouseService.update(this.data.id, data)
        .subscribe(res => {
          this.closeDialog();
        });
    }
  }
}
