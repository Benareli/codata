import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Journal } from 'src/app/models/accounting/journal.model';

import { JournalService } from 'src/app/services/accounting/journal.service';

import { InvoiceDialogComponent } from '../../accounting/invoice/invoice-dialog.component';
import { BillDialogComponent } from '../../accounting/bill/bill-dialog.component';

@Component({
  selector: 'app-transac-acc-dialog',
  templateUrl: './transac-acc-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class TransacAccDialogComponent implements OnInit {
  journals!: Journal[];
  transacid?: String;

  columns!: Columns[];
  configuration!: Config;

  constructor(
    public dialogRef: MatDialogRef<TransacAccDialogComponent>,
    private journalService: JournalService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
    
  ngOnInit() {
    this.columns = [
      {key:'name', title:'Name', orderBy:'desc', width: '35%'},
      {key:'date', title:'Date', width:'25%'},
      {key:'lock', title:'Status', width:'25%'},
      {key:'', title:'Action', width:'15%'},
    ];
    this.configuration = { ...DefaultConfig };
    this.configuration.columnReorder = true;
    this.configuration.searchEnabled = false;
    this.transacid = this.data[1];
    this.getTransAcc();
  }

  getTransAcc() {
    this.journalService.findOrigin(this.data[1])
      .subscribe(jms => {
        this.journals = jms;
    });
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      if(this.data[0] == 'purchase'){
        const dialog = this.dialog.open(BillDialogComponent, {
          maxWidth: '98vw',
          maxHeight: '98vh',
          height: '100%',
          width: '100%',
          panelClass: 'full-screen-modal',
          disableClose: true,
          data: $event.value.row
        });
      }else{
        const dialog = this.dialog.open(InvoiceDialogComponent, {
          maxWidth: '98vw',
          maxHeight: '98vh',
          height: '100%',
          width: '100%',
          panelClass: 'full-screen-modal',
          disableClose: true,
          data: $event.value.row
        });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}