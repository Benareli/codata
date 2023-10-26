import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import * as CryptoJS from 'crypto-js';

import { BaseURL } from 'src/app/baseurl';
import { Globals } from 'src/app/global';

import { Tax } from 'src/app/models/accounting/tax.model';
import { Paymentmethod } from 'src/app/models/accounting/paymentmethod.model';

import { TaxService } from 'src/app/services/accounting/tax.service';
import { PaymentmethodService } from 'src/app/services/accounting/paymentmethod.service';

import { TaxDialogComponent } from '../../../main/dialog/accounting/acc-settings/tax-dialog.component';
import { PaymethodDialogComponent } from '../../dialog/accounting/acc-settings/paymethod-dialog.component';
import { CompanyService } from 'src/app/services/settings/company.service';
import { CoaService } from 'src/app/services/accounting/coa.service';

@Component({
  selector: 'app-acc-settings',
  templateUrl: './acc-settings.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class AccSettingsComponent implements OnInit {
  coarecs?: any;
  coapays?: any;
  recId?: number;
  payId?: number;

  //Table Tax
  displayedColumnsTax: string[] = ['name','tax','include'];
  dataSourceTax = new MatTableDataSource<Tax>();
  @ViewChild(MatPaginator, { static: true }) paginatorTax!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortTax!: MatSort;

  //Table Payment Method
  displayedColumnsPm: string[] = ['name','coa'];
  dataSourcePm = new MatTableDataSource<Paymentmethod>();
  @ViewChild(MatPaginator, { static: true }) paginatorPm!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortPm!: MatSort;

  constructor(
    private router: Router,
    private globals: Globals,
    private taxService: TaxService,
    private companyService: CompanyService,
    private coaService: CoaService,
    private paymentmethodService: PaymentmethodService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveData();
  }

  retrieveData(): void {
    this.companyService.get(JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
      .subscribe(comp => {
        this.recId = comp.receivable_id;
        this.payId = comp.payable_id;
      })
    this.coaService.getAll()
      .subscribe(coa => {
        this.coarecs = coa.filter(coa => coa.type === 2);
        this.coapays = coa.filter(coa => coa.type === 3);
      })
    this.taxService.getAll()
      .subscribe(taxs => {
        this.dataSourceTax.data = taxs;
        this.dataSourceTax.paginator = this.paginatorTax;
        this.dataSourceTax.sort = this.sortTax;
      })
    this.paymentmethodService.getAll()
      .subscribe(pms => {
        this.dataSourcePm.data = pms;
        this.dataSourcePm.paginator = this.paginatorPm;
        this.dataSourcePm.sort = this.sortPm;
      })
  }

  saveAccSetting(): void {
    const upComp = {
      receivable_id: this.recId,
      payable_id: this.payId,
    }
    this.companyService.update(JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)),
    upComp)
      .subscribe(upcomp => {
        console.log(upcomp);
      })
  }

  addTax(): void {
    const dialog = this.dialog.open(TaxDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  openTax(row: Tax): void {
    const dialog = this.dialog.open(TaxDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  addPayMethod(): void {
    const dialog = this.dialog.open(PaymethodDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  openPayMethod(row: Paymentmethod): void {
    const dialog = this.dialog.open(PaymethodDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }
}
