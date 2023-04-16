import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Stockmove } from 'src/app/models/transaction/stockmove.model';

import { StockmoveService } from 'src/app/services/transaction/stockmove.service';

import { SMDetailDialogComponent } from '../stockmove/sm-detail-dialog.component';

@Component({
  selector: 'app-transac-stock-dialog',
  templateUrl: './transac-stock-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class TransacStockDialogComponent implements OnInit {
  stockmoves!: Stockmove[];
  transacid?: String;

  columns!: Columns[];
  configuration!: Config;

  constructor(
    public dialogRef: MatDialogRef<TransacStockDialogComponent>,
    private stockmoveService: StockmoveService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}
    
  ngOnInit() {
    this.columns = [
      {key:'trans_id', title:'Transaction', orderBy:'desc', width: '35%'},
      {key:'date', title:'Date', width:'25%'},
      {key:'req', title:'Status', width:'25%'},
      {key:'', title:'Action', width:'15%'},
    ];
    this.configuration = { ...DefaultConfig };
    this.configuration.columnReorder = true;
    this.configuration.searchEnabled = false;
    this.transacid = this.data[1];
    this.getTransStock();
  }

  getTransStock() {
    this.stockmoveService.findOrigin(this.data[1])
      .subscribe(sms => {
        this.stockmoves = sms;
    });
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(SMDetailDialogComponent, {
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

  closeDialog() {
    this.dialogRef.close();
  }
}