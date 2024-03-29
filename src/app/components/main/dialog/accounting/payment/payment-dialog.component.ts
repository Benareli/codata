import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Globals } from 'src/app/global';

import { PaymentmethodService } from 'src/app/services/accounting/paymentmethod.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class PaymentDialogComponent implements OnInit {
  isChecked = false;
  isPOSU = false;
  isPOSM = false;
  isAdm = false;
  isRes = false;
  isPay2 = false;
  colorchange?: string = 'black';
  borderchange?: string = '1px solid #000';
  borderchange2?: string = '1px solid #eee';
  pay1s: boolean = true;
  pay2s: boolean = false;
  payment?: string = '0';
  payment2?: string = '0';
  change?: string;
  changeNum: number=0;
  typePay!: number;
  paymentMethods?: any = [];

  //disc
  pay1Type: string='tunai';
  pay2Type: string='tunai';

  pay1Meth?: number = 0;
  selectedPm: any;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private paymentmethodService: PaymentmethodService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.countChange();
    this.retrieveData();
    //this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="pos_user") this.isPOSU=true;
      if(this.globals.roles![x]=="pos_manager") this.isPOSM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPOSM || !this.isAdm) this.isRes = true;
  }

  retrieveData() {
    this.paymentmethodService.getAll()
      .subscribe(pm => {
        this.paymentMethods = pm;
        this.selectedPm = pm[0];
      })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  payMeth(pm: any): void {
    this.pay1Meth = pm.id;
    this.selectedPm = pm;
  }

  onPay1Change(val: string) {
    this.pay1Type = val;
    if(val=="bank"){
      this.payment = this.data.total.toString();
      this.countChange();
    }
  }

  onPay2Change(val2: string) {
    this.pay2Type = val2;
    if(val2=="bank"){
      this.payment2 = (0-this.changeNum).toString();
      this.countChange();
    }
  }

  /*formatNum(value: String) {
    const cleanValue = value.replace(/[^\d.-]/g, '');
    const numericValue = parseFloat(cleanValue);
    return isNaN(numericValue) ? null : this.decimalPipe.transform(numericValue, '1.2-2');
  }*/

  mode2(): void {
    this.isPay2 = !this.isPay2;
    if(this.payment2 != '0'){
      this.payment2 = '0';
      this.countChange();
    }
  }

  press(key: string) {
    if(this.pay1s){
      if(key=='X'){ 
        this.payment='';
        key='0';
      }else if(key=='F'){
        this.payment=(Number(this.data.total)).toString();
        key='';
      }else if(key=='1k'){
        this.payment=(Number(this.payment)+1000).toString();
        key='';
      }else if(key=='2k'){
        this.payment=(Number(this.payment)+2000).toString();
        key='';
      }else if(key=='5k'){
        this.payment=(Number(this.payment)+5000).toString();
        key='';
      }else if(key=='10k'){
        this.payment=(Number(this.payment)+10000).toString();
        key='';
      }else if(key=='20k'){
        this.payment=(Number(this.payment)+20000).toString();
        key='';
      }else if(key=='50k'){
        this.payment=(Number(this.payment)+50000).toString();
        key='';
      }else if(key=='100k'){
        this.payment=(Number(this.payment)+100000).toString();
        key='';
      }
      if(this.payment == '0'){
        this.payment = '';
      }
      this.payment += key;
      this.countChange();
    }else{
      if(key=='X'){ 
        this.payment2='';
        key='0';
      }else if(key=='F'){
        this.payment2=(0-Number(this.changeNum)).toString();
        key='';
      }else if(key=='1k'){
        this.payment2=(Number(this.payment2)+1000).toString();
        key='';
      }else if(key=='2k'){
        this.payment2=(Number(this.payment2)+2000).toString();
        key='';
      }else if(key=='5k'){
        this.payment2=(Number(this.payment2)+5000).toString();
        key='';
      }else if(key=='10k'){
        this.payment2=(Number(this.payment2)+10000).toString();
        key='';
      }else if(key=='20k'){
        this.payment2=(Number(this.payment2)+20000).toString();
        key='';
      }else if(key=='50k'){
        this.payment2=(Number(this.payment2)+50000).toString();
        key='';
      }else if(key=='100k'){
        this.payment2=(Number(this.payment2)+100000).toString();
        key='';
      }
      if(this.payment2 == '0'){
        this.payment2 = '';
      }
      this.payment2 += key;
      this.countChange();
    }

    if(Number(this.payment) > this.data.total){
      this.payment = this.data.total.toString();
      this.countChange();
    }
  }

  countChange(): void {
    this.changeNum = (Number(this.payment) + Number(this.payment2)) - this.data.total;
    if (this.changeNum>=0) this.colorchange = '#009B77';
    else this.colorchange = 'red';
    this.change = this.changeNum.toString();
  }

  confirm() {
    if(this.data.typePay == "in" && this.changeNum>=0){
      this.dialogRef.close({
        payment:this.payment,
        payment2: this.payment2,
        pay_type: this.selectedPm,
        pay2Type: this.pay2Type,
        change: this.change
      })
    }else if(this.data.typePay == "in" && this.changeNum<0){
      this._snackBar.open("Pembayaran kurang "+this.changeNum, "Tutup", {duration: 5000});
    }else if(this.data.typePay == "out"){
      this.dialogRef.close({
        payment:this.payment,
        pay_type: this.selectedPm,
        change: this.change
      })
    }
  }
}
