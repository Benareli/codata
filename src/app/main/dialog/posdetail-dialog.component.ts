import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-posdetail-dialog',
  templateUrl: './posdetail-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class PosdetailDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isPOSU = false;
  isPOSM = false;
  isAdm = false;
  isRes = false;
  bbigger = false;

  productname?: string;
  botprice?: number;

  constructor(
    public dialogRef: MatDialogRef<PosdetailDialogComponent>,
    private globals: Globals,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    this.productService.get(this.data.product)
      .subscribe(prod => {
        this.productname = prod.name;
        this.botprice = prod.botprice;
    });
    this.bbigger = false;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="pos_user") this.isPOSU=true;
      if(this.globals.roles![x]=="pos_manager") this.isPOSM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPOSM || !this.isAdm) this.isRes = true;
  }

  press(key: string) {
    if(key == 'X'){ 
      this.data.qty = '';
      key = '';
    }
    if(this.data.qty == '0'){
      this.data.qty = '';
    }
    this.data.qty += key;
  }

  press2(key2: string) {
    if(key2 == 'X'){ 
      this.data.price_unit = '';
      key2 = '';
    }
    if(this.data.price_unit == '0'){
      this.data.price_unit = '';
    }
    this.data.price_unit += key2;
  }

  press3(key3: string) {
    if(key3 == 'X'){ 
      this.data.discadd = '';
      key3 = '';
    }
    if(this.data.discadd == '0'){
      this.data.discadd = '';
    }
    this.data.discadd += key3;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  confirm() {
    if(this.botprice && (this.data.price_unit < this.botprice)){
      this.bbigger = true;
    }else{
      this.dialogRef.close({
        index:this.data.index,
        qty: this.data.qty,
        price_unit: this.data.price_unit,
        discadd: this.data.discadd
      })
    }
  }
}
