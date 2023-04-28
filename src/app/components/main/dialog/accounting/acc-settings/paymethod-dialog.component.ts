import { Component, OnInit, Inject } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Coa } from 'src/app/models/accounting/coa.model';

import { PaymentmethodService } from 'src/app/services/accounting/paymentmethod.service';
import { CoaService } from 'src/app/services/accounting/coa.service';

@Component({
  selector: 'app-paymethod-dialog',
  templateUrl: './paymethod-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class PaymethodDialogComponent implements OnInit {
  statusActive?: string;
  isAdm = false;
  coas!: Coa[];
  datname?: string = "";
  datcoa?: number = 0;

  constructor(
    public dialogRef: MatDialogRef<PaymethodDialogComponent>,
    private globals: Globals,
    private coaService: CoaService,
    private paymentmethodService: PaymentmethodService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isAdm) {
      this.dialogRef.close();
    }else{
      if(this.data) this.retrieveTax();
      this.coaService.getAll()
        .subscribe(coas => {
          this.coas = coas.filter(coa => coa.type === 1);
        })
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  retrieveTax(): void {
    this.paymentmethodService.get(this.data.id)
      .subscribe(pms => {
        this.datname = pms.name;
        this.datcoa = pms.coa_id;
      })
  }

  updateData(): void {
    const paym = {
      name: this.datname,
      coa: this.datcoa,
    };
    if(this.data){
      this.paymentmethodService.update(this.data.id, paym)
        .subscribe(res => {
          this.closeDialog();
        })
    }else{
      this.paymentmethodService.create(paym)
        .subscribe(res => {
          this.closeDialog();
        })
    }
  }
}
