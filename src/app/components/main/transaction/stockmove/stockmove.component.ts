import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Stockmove } from 'src/app/models/transaction/stockmove.model';
import { Stockrequest } from 'src/app/models/transaction/stockrequest.model';

import { StockmoveService } from 'src/app/services/transaction/stockmove.service';
import { StockrequestService } from 'src/app/services/transaction/stockrequest.service';

import { SMDetailDialogComponent } from '../../dialog/transaction/stockmove/sm-detail-dialog.component';

@Component({
  selector: 'app-stockmove',
  templateUrl: './stockmove.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class StockmoveComponent implements OnInit {
  stockmoves!: Stockmove[];
  stockrequests!: Stockrequest[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  datas!: Stockmove[];
  
  columns!: Columns[];
  configuration!: Config;

  constructor(
    private router: Router,
    private globals: Globals,
    private stockmoveService: StockmoveService,
    private stockrequestService: StockrequestService,
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
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void {
    this.datas = [];
    this.stockrequestService.getAll()
      .subscribe(stockreq => {
        this.stockrequests = Array.from(new Map(stockreq.reverse().map(item => [item.trans_id, item])).values());
        this.stockmoveService.getAll()
          .subscribe(stockmove => {
            this.stockmoves = Array.from(new Map(stockmove.reverse().map(item => [item.trans_id, item])).values());
            this.datas = [ ...this.stockrequests, ...this.stockmoves];
            this.columns = [
              {key:'trans_id', title:'Transaction', orderBy:'desc', width: '35%'},
              {key:'origin', title:'Origin', width:'35%'},
              {key:'date', title:'Date', width:'15%'},
              {key:'req', title:'Status', width:'15%'}
            ];
            this.configuration = { ...DefaultConfig };
            this.configuration.columnReorder = true;
            this.configuration.searchEnabled = false;
          })
      })
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
      })
        .afterClosed()
        .subscribe(() => this.retrieveData());
    }
  }

  addStockmove(): void {
    const dialog = this.dialog.open(SMDetailDialogComponent, {
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }

}
