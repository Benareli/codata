import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Uom } from 'src/app/models/uom.model';
import { Uomcat } from 'src/app/models/uomcat.model';

import { UomService } from 'src/app/services/uom.service';
import { UomcatService } from 'src/app/services/uomcat.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class UomComponent implements OnInit {
  uomcats?: Uomcat[];
  uoms: Uom[];
  datcat?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;

  //Add
  uomadd: Uom = {
    uom_name: '',
    uom_cat: '',
    ratio: 0,
  };

  columns: Columns[];
  configuration: Config;

  constructor(
    private router: Router,
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private uomService: UomService,
    private uomcatService: UomcatService,
    private logService: LogService,
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
    this.retrieveUom();
  }

  retrieveUom(): void {
    this.uomcatService.getAll()
      .subscribe(uomcat => {
        this.uomcats = uomcat;
    });
    this.uomService.getAll()
      .subscribe(uom => {
        this.uoms = uom;
        this.columns = [
          {key:'uom_name', title:'Name', orderBy:'asc', width: '50%'},
          {key:'ratio', title:'Ratio', width:'25%'},
          {key:'uom_cat.uom_cat', title:'Category', width:'25%'},
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
    });
  }

  saveUom(): void {
    if(!this.uomadd.uom_name || this.uomadd.uom_name == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        uom_name: this.uomadd.uom_name,
        uom_cat: this.datcat,
        ratio: this.uomadd.ratio,
        user: this.globals.userid
      };
      this.uomService.create(data)
        .subscribe(res => {
          this.retrieveUom();
          this.uomadd = {
            uom_name: '',
            uom_cat: '',
            ratio: 0,
          };
        });
    }
  }
}
