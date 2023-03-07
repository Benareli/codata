import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./dialog.component.sass'],
  providers: [DatePipe]
})
export class TicketDialogComponent implements OnInit {
  isChecked = false;
  isTickU = false;
  isTickM = false;
  isAdm = false;
  isRes = false;

  new = false;

  datId?: string;
  datFName?: string;
  datPhone?: string;
  datEmail?: string;
  today?: Date;
  datDate?: string | null;
  datDateSub?: Date;
  datMessage?: string;
  datNote?: string;
  dateSub?: Date;
  datStage: number = 0;
  logmess: string;

  logs: Log[];

  log = 0;

  columns: Columns[];
  configuration: Config;

  constructor(
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private ticketService: TicketService,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    this.checkRole();
    if (this.data){
      this.new = false;
      this.retrieveData();
    }else this.new = true;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="ticket_user") this.isTickU=true;
      if(this.globals.roles![x]=="ticket_manager") this.isTickM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isTickM || !this.isAdm) this.isRes = true;
  }

  retrieveData(): void {
    this.ticketService.get(this.data.id)
      .subscribe(gtick => {
        this.datId = gtick.id;
        this.datFName = gtick.fullname;
        this.datPhone = gtick.phone;
        this.datEmail = gtick.email;
        this.datDateSub = gtick.date_submitted;
        this.dateSub = gtick.date_expected;
        this.datDate = this.datepipe.transform(this.dateSub, 'yyyy-MM-dd')
        this.datMessage = gtick.message;
        this.datStage = gtick.stage!;
      })
    this.logService.getAll()
      .subscribe(logPR => {
        logPR = logPR.filter(dataPR => dataPR.ticket === this.data.id);
        this.logs = logPR;
        this.columns = [
          {key:'message', title:'Message', width:'20%'},
          {key:'createdAt', title:'Date', orderBy:'desc', width:'20%'},
          {key:'user', title:'by', width:'17%'},
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateStatus(stage: number): void {
    if(stage == 0) this.logmess = "Updated to Open";
    else if (stage == 1) this.logmess = "Updated to Handling";
    else if (stage == 2) this.logmess = "Updated to Pending";
    else if (stage == 3) this.logmess = "Updated to Done";

    const ticket = {
      fullname: this.datFName, phone: this.datPhone, email: this.datEmail, date_submitted: this.datDateSub, date_expected: this.datDate,
      message: this.datMessage, user: this.globals.userid, stage: stage, ticketid: this.data.ticketid, logmess: this.logmess
    };
    this.ticketService.update(this.datId, ticket)
      .subscribe(utick => {
        this.retrieveData();
      })
  }

  updateData(): void {
    const ticket = {
      fullname: this.datFName, phone: this.datPhone, email: this.datEmail, date_submitted: this.datDateSub, date_expected: this.datDate,
      message: this.datMessage, user: this.globals.userid, stage: this.datStage, ticketid: this.data.ticketid, logmess: this.datNote
    };
    this.ticketService.update(this.datId, ticket)
      .subscribe(utick => {
        this.retrieveData();
      })
  }

  saveData(): void {
    if(!this.datFName || this.datFName == null
      || !this.datPhone || this.datPhone == null
      || !this.datMessage || this.datMessage == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      this.today = new Date();
      const ticket = {
        fullname: this.datFName, phone: this.datPhone, email: this.datEmail, date_submitted: this.today, date_expected: this.datDate,
        message: this.datMessage, user: this.globals.userid
      };
      this.ticketService.create(ticket)
        .subscribe(ntick => {
          this.closeDialog();
        })
    }
  }
}
