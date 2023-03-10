import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Brand } from 'src/app/models/masterdata/brand.model';

import { BrandService } from 'src/app/services/masterdata/brand.service';

import { BrandDialogComponent } from '../../dialog/masterdata/brand-dialog.component';
import { UploadDialogComponent } from '../../dialog/upload/upload-dialog.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class BrandComponent implements OnInit {
  brands: Brand[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  
  //Add
  brandadd: Brand = {
    description: '',
    active: true
  };
  
  columns: Columns[];
  configuration: Config;
 
  constructor(
    private router: Router,
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private brandService: BrandService,
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
    this.retrieveBrand();
  }

  retrieveBrand(): void {
    this.brandService.getAll()
      .subscribe(brand => {
        if(this.isIM || this.isAdm){
          this.brands = brand;
        }else{
          this.brands = brand.filter(data => data.active == true);
        }
        this.columns = [
          {key:'description', title:'Description', orderBy:'asc'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
      });
  }

  saveBrand(): void {
    if(!this.brandadd.description || this.brandadd.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        description: this.brandadd.description,
        active: this.brandadd.active,
        user: this.globals.userid
      };
      this.brandService.create(data)
        .subscribe({
          next: (res) => {
            this.retrieveBrand();
            this.brandadd = {
              description: '',
              active: true
            };
          },
          error: (e) => {
            this._snackBar.open(e.error.message, "Tutup", {duration: 5000});
            return;
          }
        });
    }
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(BrandDialogComponent, {
        maxWidth: '98vw',
        maxHeight: '98vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        disableClose: true,
        data: $event.value.row
      })
        .afterClosed()
        .subscribe(() => this.retrieveBrand());
    }
  }

  openUpload() {
    const dialog = this.dialog.open(UploadDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: "brand"
    })
      .afterClosed()
      .subscribe(() => this.retrieveBrand());
  }

}