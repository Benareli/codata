import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketService } from 'src/app/services/ticket.service';
import { Log } from 'src/app/models/settings/log.model';
import { LogService } from 'src/app/services/settings/log.service';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { TicketDialogComponent } from '../dialog/ticket-dialog.component';

@Component({
  selector: 'app-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class HelpdeskComponent implements OnInit {
  tickets: Ticket[];
  isTickU = false;
  isTickM = false;
  isAdm = false;
  isShow = false;

  columns: Columns[];
  configuration: Config;

  constructor(
    private router: Router,
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private ticketService: TicketService,
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
      if(this.globals.roles![x]=="ticket_user") this.isTickU=true;
      if(this.globals.roles![x]=="ticket_manager") this.isTickM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    this.retrieveData();
  }

  retrieveData(): void {
    this.ticketService.getAll()
      .subscribe(ticket => {
        this.tickets = ticket;
        this.columns = [
          {key:'ticketid', title:'Ticket Id', orderBy:'desc', width:'20%'},
          {key:'fullname', title:'Name', width:'20%'},
          {key:'phone', title:'Phone', width:'17%'},
          {key:'date_submitted', title:'Start Date', width:'16%'},
          {key:'date_expected', title:'Expected', width:'16%'},
          {key:'stage', title:'Stage', width:'10%'}
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
      });
  }

  /*saveBrand(): void {
    if(!this.brandadd.description || this.brandadd.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        description: this.brandadd.description,
        active: this.brandadd.active,
        user: this.globals.userid
      };
      this.brandService.create(data)
        .subscribe({
          next: (res) => {
            this.retrieveBrand();
            this.brandadd = {
              description: '',
              active: true
            };
          },
          error: (e) => {
            this._snackBar.open(e.error.message, "Tutup", {duration: 5000});
            return;
          }
        });
    }
  }*/

  openQuickAdd(): void {
    const dialog = this.dialog.open(TicketDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(TicketDialogComponent, {
        width: '100%',
        height: '100%',
        disableClose: true,
        data: $event.value.row
      })
        .afterClosed()
        .subscribe(() => this.retrieveData());
    }
  }
}
