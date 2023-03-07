import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Journal } from 'src/app/models/journal.model';
import { Log } from 'src/app/models/log.model';
import { DataFilter, filterOption } from 'src/app/models/datafilter';

import { JournalService } from 'src/app/services/journal.service';
import { LogService } from 'src/app/services/log.service';

import { BillDialogComponent } from '../../dialog/bill-dialog.component';

@Component({
  selector: 'app-payable',
  templateUrl: './payable.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class PayableComponent implements OnInit {
  journals: Journal[];
  isAccU = false;
  isAccM = false;
  isAdm = false;
  isShow = false;
  datas?: any;
  
  columns: Columns[];
  configuration: Config;

  constructor(
    private router: Router,
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private journalService: JournalService,
    private logService: LogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.checkRole();
  }

  toggleDisplay() {
    this.configuration.searchEnabled = !this.configuration.searchEnabled;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="acc_user") this.isAccU=true;
      if(this.globals.roles![x]=="acc_manager") this.isAccM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isAccU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void {
    this.journalService.findBill()
      .subscribe(journal => {
        this.journals = Array.from(new Map(journal.reverse().map(item => [item.name, item])).values());
        this.columns = [
          {key:'name', title:'Journal ID', orderBy:'desc', width: '20%'},
          {key:'partners.name', title:'Partner', width:'30%'},
          {key:'amount', title:'Amount', width:'20%'},
          {key:'date', title:'Date', width:'20%'},
          {key:'lock', title:'Status', width:'10%'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
      })
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(BillDialogComponent, {
        maxWidth: '98vw',
        maxHeight: '98vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        disableClose: true,
        data: $event.value.row
      }).afterClosed().subscribe(result => {
        //if(result) this.reopenDialog(result);
        this.retrieveData();
      });
    }
  }
}