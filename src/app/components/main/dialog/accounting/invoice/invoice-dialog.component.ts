import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Globals } from 'src/app/global';
import { Journal } from 'src/app/models/accounting/journal.model';
import { Partner } from 'src/app/models/masterdata/partner.model';

import { JournalService } from 'src/app/services/accounting/journal.service';
import { EntryService } from 'src/app/services/accounting/entry.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { PaymentService } from 'src/app/services/accounting/payment.service';
import { IdService } from 'src/app/services/settings/id.service';

import { PaymentDialogComponent } from '../payment/payment-dialog.component';

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
    private entryService: EntryService,
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
    this.datdate = this.data.date.split('T')[0];
    this.thissub = 0;
    this.thisdisc = 0;
    this.thissubdisc = 0;
    this.thistax = 0;
    this.thistotal = 0;
    if(this.data.duedate){
      this.datduedate = this.data.duedate.split('T')[0];
    }else{
      this.datduedate = "";
    }
    this.journalService.get(this.data.id)
      .subscribe(journal => {
        console.log(journal);
        this.journalid = journal.id;
        this.amountdue = journal.amountdue!;
        this.lock = journal!.lock!;
        this.datas = journal!.entrys!;
        this.paymentx = journal!.payments;
        for(let x=0;x<this.entrys.length;x++){
          if(this.entrys[x].products){
            this.invoices = [...this.invoices,(this.entrys[x])];
            /*this.thissub = this.thissub + (this.entrys[x].qty * this.entrys[x].price_unit);
            if(this.entrys[x].discount){
              this.thisdisc = this.thisdisc + (this.entrys[x].discount = 0 /100 * this.entrys[x].qty! * this.entrys[x].price_unit!);
              this.thissubdisc = this.entrys[x].discount = 0 /100 * this.entrys[x].qty! * this.entrys[x].price_unit!;
            }
            else{ 
              this.thisdisc = this.thisdisc + 0;
              this.thissubdisc = 0;
            }
            if(this.entrys[x].tax){
              this.thistax = this.thistax + (this.entrys[x].tax! / 100 * 
                ((this.entrys[x].qty! * this.entrys[x].price_unit!) - this.thissubdisc));
            }else{ this.thistax = this.thistax + 0 }
            this.thistotal = this.thissub - this.thisdisc + this.thistax;*/
          }
        }

        for(let x=0;x<this.datas.length;x++){
          if(this.datas[x].products){
            console.log(x, this.datas[x]);
            this.entrys.push(this.datas[x]);
            this.thissub = this.thissub + (this.datas[x].qty * this.datas[x].price_unit);
            this.thisdisc = this.thisdisc + (this.datas[x].discount/100 * this.datas[x].qty * this.datas[x].price_unit);
            this.thistax = this.thistax + (this.datas[x].tax / 100 * 
              ((this.datas[x].qty * this.datas[x].price_unit) - (this.datas[x].discount/100 * this.datas[x].qty * this.datas[x].price_unit)));
            this.thistotal = this.thissub - this.thisdisc + this.thistax;
          }
        }
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
        total: this.thistotal - this.payments,
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
          date: this.today, type: "in"
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

  changeLock(): void {
    const locks = {lock: !this.lock}
    this.journalService.updateLock(this.journalid, locks)
      .subscribe(lockz => {
        this.dialogRef.close(this.data);
      })
  }
}
