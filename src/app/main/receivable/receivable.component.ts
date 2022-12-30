import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Journal } from 'src/app/models/journal.model';
import { JournalService } from 'src/app/services/journal.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { InvoiceDialogComponent } from '../dialog/invoice-dialog.component';

@Component({
  selector: 'app-receivable',
  templateUrl: './receivable.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class ReceivableComponent implements OnInit {
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
    this.journalService.findInv()
      .subscribe(journal => {
        this.journals = Array.from(new Map(journal.reverse().map(item => [item.journal_id, item])).values());

        this.columns = [
          {key:'journal_id', title:'Journal ID', orderBy:'desc', width: '20%'},
          {key:'partner.name', title:'Partner', width:'30%'},
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
      const dialog = this.dialog.open(InvoiceDialogComponent, {
        width: '98%',
        height: '90%',
        disableClose: true,
        data: $event.value.row
      }).afterClosed().subscribe(result => {
        //if(result) this.reopenDialog(result);
        this.retrieveData();
      });
    }
  }
}