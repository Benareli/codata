import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as CryptoJS from 'crypto-js';

import { BaseURL } from 'src/app/baseurl';
import { Globals } from 'src/app/global';
import { Journal } from 'src/app/models/accounting/journal.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Entry } from 'src/app/models/accounting/entry.model';

import { JournalService } from 'src/app/services/accounting/journal.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { PaymentService } from 'src/app/services/accounting/payment.service';
import { IdService } from 'src/app/services/settings/id.service';

import { PaymentDialogComponent } from '../payment/payment-dialog.component';
import { PrintComponent } from '../../../print/print.component';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class InvoiceDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isAccU = false;
  isAccM = false;
  isAdm = false;
  isRes = false;
  entrys: any;
  datas: any;
  journals!: Journal[];
  crossCoas!: any;
  ent!: Entry[];
  invoices: any;
  paymentx: any;
  partners?: Partner[];
  journalid?: string;
  customerString?: string;
  datdate?: string;
  datduedate?: string;
  thissub: number = 0;
  thisdisc: number = 0;
  thissubdisc: number = 0;
  thistax: number = 0;
  thistotal: number = 0;
  paid: number = 0;
  payments: number = 0;
  amountdue: number = 0;

  a = 0; b = 0;
  journidtitle?: string;
  log = 0;
  debit = 0;
  credit = 0;
  lock: boolean = false;

  payid?: string;
  today?: Date;

  printInv?: any;
  printInvdet?: any;

  //Table
  displayedColumns: string[] = 
  ['label', 'qty', 'price_unit', 'discount', 'tax', 'subtotal'];
  dataSource = new MatTableDataSource<any>();

  //Table
  displayedColumnsPay: string[] = 
  ['label', 'date', 'payment'];
  dataSourcePay = new MatTableDataSource<any>();

  constructor(
    public dialogRef: MatDialogRef<InvoiceDialogComponent>,
    private dialog: MatDialog,
    private globals: Globals,
    private journalService: JournalService,
    private partnerService: PartnerService,
    private paymentService: PaymentService,
    private idService: IdService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data){
      this.entrys = [];
      this.retrieveData();
      this.checkRole();
    }else{
      this.entrys = [];
      this.checkRole();
    }
  }

  retrieveData(): void {
    this.entrys = [];
    this.invoices = [];
    this.journidtitle = this.data.name;
    this.customerString = this.data.partners.id;
    this.datdate = (new Date(this.data.date)).toLocaleString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
    this.datduedate = (new Date(this.data.duedate)).toLocaleString('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
    this.thissub = 0;
    this.thisdisc = 0;
    this.thissubdisc = 0;
    this.thistax = 0;
    this.thistotal = 0;
    this.journalService.get(this.data.id)
      .subscribe(journal => {
        this.journalid = journal.id;
        this.amountdue = journal.amountdue!;
        this.lock = journal!.lock!;
        this.datas = journal!.entrys!;
        this.paymentx = journal!.payments;
        this.crossCoas = this.ent.find(entry => entry.label === "Payable");
        for(let x=0;x<this.datas.length;x++){
          if(this.datas[x].products){
            this.entrys.push(this.datas[x]);
            this.thissub = this.thissub + (this.datas[x].qty * this.datas[x].price_unit);
            this.thisdisc = this.thisdisc + (this.datas[x].discount/100 * this.datas[x].qty * this.datas[x].price_unit);
            this.thistax = this.thistax + (this.datas[x].tax / 100 * 
              ((this.datas[x].qty * this.datas[x].price_unit) - (this.datas[x].discount/100 * this.datas[x].qty * this.datas[x].price_unit)));
            this.thistotal = this.thissub - this.thisdisc + this.thistax;
          }
        }
        this.printInv = {
          invoice_id: this.data.name,
          partners: this.data.partners,
          date: this.datdate,
          duedate: this.datduedate ? this.datduedate : '',
          totalTax: this.thistax,
          totalDisc: this.thisdisc,
          totalUntaxed: this.thissub,
          total: this.thistotal,
          companys: journal.companys,
        };
        this.printInvdet = this.entrys;
        this.dataSource.data = this.entrys;
        this.dataSourcePay.data = this.paymentx;
      })
    this.partnerService.findAllActiveCustomer()
      .subscribe(dataCus => {
        this.partners = dataCus;
      })
  }

  startPay(): void {
    const dialog = this.dialog.open(PaymentDialogComponent, {
      width: '90vw',
      height: '80%',
      disableClose: true,
      data: {
        order_id: this.journidtitle,
        subtotal: this.thissub,
        discount: this.thisdisc,
        total: this.amountdue,
        typePay: "in",
      }
    }).afterClosed().subscribe(result => {
      if(result){
        this.paying(result);
      }
    });
  }

  paying(res: any): void {
    this.today = new Date();
    this.idService.getPaymentId()
      .subscribe(idp => {
        this.payid = idp.message;
        const payments = {pay_id: this.payid, order_id: this.journidtitle,
          amount_total: this.thistotal,payment1: res.payment1,pay1method: res.pay1Type,
          date: this.today, type: "in",
          company: JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8))
        };
        this.paymentService.create(payments)
          .subscribe(res => {
            this.retrieveData();
          })
      })
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="accounting_user") this.isAccU=true;
      if(this.globals.roles![x]=="accounting_manager") this.isAccM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isAccM || !this.isAdm) this.isRes = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  closeBackDialog() {
    this.dialogRef.close(this.data);
  }

  changeLock(): void {
    const locks = {lock: !this.lock}
    this.journalService.updateLock(this.journalid, locks)
      .subscribe(lockz => {
        this.dialogRef.close(this.data);
      })
  }

  openPrint() {
    const dialog = this.dialog.open(PrintComponent, {
      width: '90vw',
      height: '80%',
      disableClose: true,
      data: ["invoice", this.printInv, this.printInvdet]
    })
  }
}
