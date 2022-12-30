import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';

import { Entry } from 'src/app/models/entry.model';
import { EntryService } from 'src/app/services/entry.service';
import { Journal } from 'src/app/models/journal.model';
import { JournalService } from 'src/app/services/journal.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Payment } from 'src/app/models/payment.model';
import { PaymentService } from 'src/app/services/payment.service';
import { Id } from 'src/app/models/id.model';
import { IdService } from 'src/app/services/id.service';

import { PaymentDialogComponent } from '../dialog/payment-dialog.component';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class InvoiceDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isAccU = false;
  isAccM = false;
  isAdm = false;
  isRes = false;
  datas: any;
  entrys: any;
  journals: Journal[];
  partners?: Partner[];
  journalid?: string;
  customerString?: string;
  datdate?: string;
  datduedate?: string;
  thissub: number = 0;
  thisdisc: number = 0;
  thistax: number = 0;
  thistotal: number = 0;
  paid: number = 0;
  payments: number = 0;

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
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private globals: Globals,
    private entryService: EntryService,
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
    this.journidtitle = this.data.journal_id;
    this.customerString = this.data.partner._id;
    this.datdate = this.data.date.split('T')[0];
    this.thissub = 0;
    this.thisdisc = 0;
    this.thistax = 0;
    this.thistotal = 0;
    if(this.data.duedate){
      this.datduedate = this.data.duedate.split('T')[0];
    }else{
      this.datduedate = "";
    }
    this.journalService.findJourn(this.data.journal_id)
      .subscribe(entry => {
        this.journalid = entry.id;
        this.lock = entry!.lock!;
        this.datas = entry.entries;
        for(let x=0;x<this.datas.length;x++){
          if(this.datas[x].product){
            this.entrys.push(this.datas[x]);
            this.thissub = this.thissub + (this.datas[x].qty * this.datas[x].price_unit);
            this.thisdisc = this.thisdisc + (this.datas[x].discount/100 * this.datas[x].qty * this.datas[x].price_unit);
            this.thistax = this.thistax + (this.datas[x].tax / 100 * 
              ((this.datas[x].qty * this.datas[x].price_unit) - (this.datas[x].discount/100 * this.datas[x].qty * this.datas[x].price_unit)));
            this.thistotal = this.thissub - this.thisdisc + this.thistax;
          }
        }
        this.dataSource.data = this.entrys;
        this.dataSourcePay.data = entry!.payment!;
        if(entry!.payments! > 0) this.payments = entry!.payments!;
          //this.countDebCred();
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
        typePay: "out",
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
          date: this.today, type: "out"
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
