import { Component, OnInit, Inject } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Coa } from 'src/app/models/accounting/coa.model';

import { CoaService } from 'src/app/services/accounting/coa.service';
import { TaxService } from 'src/app/services/accounting/tax.service';

@Component({
  selector: 'app-tax-dialog',
  templateUrl: './tax-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class TaxDialogComponent implements OnInit {
  statusActive?: string;
  isAdm = false;
  taxname?: string = "";
  include?: boolean = false;
  datinclude?: string = "false";
  datname?: string = "";
  dattax?: number = 0;
  explainer?: string = "";
  coas?: Coa[];
  taxInId?: number;
  taxOutId?: number;

  constructor(
    public dialogRef: MatDialogRef<TaxDialogComponent>,
    private globals: Globals,
    private coaService: CoaService,
    private taxService: TaxService,
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
      else this.checkExplainer();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  retrieveTax(): void {
    this.coaService.getAll()
      .subscribe(coa => {
        this.coas = coa;
      })
    this.taxService.get(this.data.id)
      .subscribe(taxs => {
        this.datname = taxs.name;
        this.dattax = taxs.tax;
        this.taxInId = taxs.coa_in_id;
        this.taxOutId = taxs.coa_out_id;
        this.datinclude = taxs!.include!.toString();
        this.include = taxs.include;
        this.checkExplainer();
      })
  }

  onIncludeChange(vals: string) {
    this.datinclude = vals;
    if (this.datinclude == 'true'){
      this.datinclude = "true";
      this.include = true;
      this.checkExplainer();
    }else{
      this.datinclude = "false";
      this.include = false;
      this.checkExplainer();
    }
  }

  ngModelChange(event: string) {
    this.dattax = Number(event);
    this.checkExplainer();
  }

  checkExplainer(): void {
    if(this.datinclude=="true"){
      this.explainer = "Pajak " + this.datname + " termasuk dalam harga jual / beli.\nContoh perhitungan: " +
                      "Barang senilai 10,000, maka nilai Jual adalah 10,000, dengan Nilai Pajak " +
                      (10000 - (10000 / (1+(this.dattax! /100)))).toLocaleString() + " dan nilai pokok " 
                      + (10000/(1+(this.dattax! /100))).toLocaleString();
    }else{
      this.explainer = "Pajak " + this.datname + " tidak termasuk dalam harga jual / beli.\nContoh perhitungan: " +
                      "Barang senilai 10,000, maka nilai Pajak adalah " + ((Number(this.dattax!) / 100) * 10000).toLocaleString() 
                      + ", dengan Nilai Jual " + (10000 + ((Number(this.dattax!) /100) * 10000)).toLocaleString();
    }
  }

  updateData(): void {
    if(this.data){
      const tax = {
        name: this.datname,
        tax: Number(this.dattax),
        include: this.include,
        coa_in_id: this.taxInId,
        coa_out_id: this.taxOutId,
      };
      this.taxService.update(this.data.id, tax)
        .subscribe(res => {
          this.closeDialog();
        })
    }else{
      const tax = {
        name: this.datname,
        tax: Number(this.dattax),
        include: this.include
      };
      this.taxService.create(tax)
        .subscribe(res => {
          this.closeDialog();
        })
    }
    /*if(!this.data.description || this.data.description == null){
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
        .subscribe(res => {
          this.closeDialog();
        });
    }*/
  }
}
