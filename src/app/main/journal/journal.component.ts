import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { API, APIDefinition } from 'ngx-easy-table';

import { Journal } from 'src/app/models/journal.model';
import { JournalService } from 'src/app/services/journal.service';
import { Entry } from 'src/app/models/entry.model';
import { EntryService } from 'src/app/services/entry.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { EntryDialogComponent } from '../dialog/entry-dialog.component';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class JournalComponent implements OnInit {
  journals: Journal[];
  entries: string[];
  isAccU = false;
  isAccM = false;
  isAdm = false;
  isShow = false;
  datas?: any;
  
  columns: Columns[];
  configuration: Config;
  @ViewChild('table', { static: true }) table: APIDefinition;
  toggledRows = new Set<number>();
  
  nestedConfiguration: Config;
  nestedColumns: Columns[] = [
    {key:'label', title:'Label', width:'50%'},
    {key:'debit', title:'Debit', width:'15%'},
    {key:'credit', title:'Credit', width:'15%'},
  ];

  currentIndex = -1;

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

    this.columns = [
      {key:'journal_id', title:'Journal ID', width: '30%'},
      {key:'origin', title:'Origin', width:'30%'},
      {key:'amount', title:'Amount', width:'20%'},
      {key:'date', title:'Date', orderBy:'desc', width:'12%'},
      {key:'',title:'Quick View', width:'8%'}
    ];
    this.configuration = { ...DefaultConfig };
    this.configuration.columnReorder = true;
    this.configuration.searchEnabled = false;
    this.configuration.detailsTemplate = true;
    this.configuration.tableLayout.hover = true;

    this.nestedConfiguration = { ...DefaultConfig };
    this.nestedConfiguration.paginationEnabled = false;
    this.nestedConfiguration.searchEnabled = false;
    this.nestedConfiguration.detailsTemplate = true;
    this.nestedConfiguration.tableLayout.striped = true;
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
    this.journalService.getAll()
      .subscribe(journal => {
        this.journals = Array.from(new Map(journal.reverse().map(item => [item.journal_id, item])).values());
        /*this.dataSource.data = Array.from(new Map(journal.reverse().map(item => [item.journal_id, item])).values());
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;*/
      })
  }

  onRowClickEvent($event: MouseEvent, index: number, row: any): void {
    $event.preventDefault();
    if(this.currentIndex >= 0){
      this.table.apiEvent({
        type: API.toggleRowIndex,
        value: this.currentIndex,
      });
    }

    this.journalService.get(row)
      .subscribe(ent => {
        this.entries = ent!.entries!;
        if (this.toggledRows.has(index)) {
          this.toggledRows.delete(index);
        }else{
          this.toggledRows.add(index);
        }
      })

    if(this.currentIndex != index){
      this.table.apiEvent({
        type: API.toggleRowIndex,
        value: index,
      });
      this.currentIndex = index;
    }else{
      this.currentIndex = -1;
    }
  }

  openDialog(row: any) {
    const dialog = this.dialog.open(EntryDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  openQuickAdd(): void {
    
  }

}
