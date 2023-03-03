import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { ProductcatDialogComponent } from '../dialog/productcat-dialog.component';
import { UploadDialogComponent } from '../dialog/upload-dialog.component';

//console.log(this.roles?.filter(role => role.name === "admin").map(role => role._id)); FUCKING HOLY GRAIL
@Component({
  selector: 'app-product-cat',
  templateUrl: './product-cat.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class ProductCatComponent implements OnInit {
  productcats: Productcat[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  
  //Add
  productcatadd: Productcat = {
    catid: '',
    description: '',
    active: true
  };

  columns: Columns[];
  configuration: Config;
 
  constructor(
    private router: Router,
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private logService: LogService,
    private productCatService: ProductCatService,
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
    this.retrieveProductCat();
  }

  retrieveProductCat(): void {
    this.productCatService.getAll()
      .subscribe(category => {
        if(this.isIM || this.isAdm){
          this.productcats = category;
        }else{
          this.productcats = category.filter(data => data.active == true);
        }
        this.columns = [
          {key:'catid', title:'Category ID', width: '30%'},
          {key:'description', title:'Description', orderBy:'asc', width:'70%'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
      });
  }

  saveProductCat(): void {
    if(!this.productcatadd.catid || this.productcatadd.catid == null
      || !this.productcatadd.description || this.productcatadd.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        catid: this.productcatadd.catid,
        description: this.productcatadd.description,
        active: this.productcatadd.active,
        user: this.globals.userid
      };
      this.productCatService.create(data)
        .subscribe({
          next: (res) => {
            this.retrieveProductCat();
            this.productcatadd = {
              catid: '',
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

  //openDialog(row: Productcat) {
  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(ProductcatDialogComponent, {
        maxWidth: '98vw',
        maxHeight: '98vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        disableClose: true,
        data: $event.value.row
      })
        .afterClosed()
        .subscribe(() => this.retrieveProductCat());
    }
  }

  openUpload() {
    const dialog = this.dialog.open(UploadDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: "product category"
    })
      .afterClosed()
      .subscribe(() => this.retrieveProductCat());
  }

}
