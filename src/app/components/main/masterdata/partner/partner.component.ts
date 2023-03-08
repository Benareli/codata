import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Partner } from 'src/app/models/masterdata/partner.model';

import { PartnerService } from 'src/app/services/masterdata/partner.service';

import { PartnerDialogComponent } from '../../dialog/masterdata/partner-dialog.component';
import { UploadDialogComponent } from '../../dialog/upload-dialog.component';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['../../../../style/main.sass']
})
export class PartnerComponent implements OnInit {
  partners: Partner[];
  
  columns: Columns[];
  configuration: Config;
 
  constructor(
    private partnerService: PartnerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrievePartner();
  }

  retrievePartner(): void {
    this.partnerService.getAll()
      .subscribe(partner => {
        this.partners = partner.filter
        (data => data.active === true)
        this.columns = [
          {key:'name', title:'Name', orderBy:'asc', width:'40%'},
          {key:'phone', title:'Phone', width:'20%'},
        ];
        this.configuration = { ...DefaultConfig };
        this.configuration.columnReorder = true;
        this.configuration.searchEnabled = false;
    });
  }

  openDialog($event: { event: string; value: any }) {
    if($event.event == "onClick"){
      const dialog = this.dialog.open(PartnerDialogComponent, {
        maxWidth: '98vw',
        maxHeight: '98vh',
        height: '100%',
        width: '100%',
        panelClass: 'full-screen-modal',
        disableClose: true,
        data: $event.value.row
      })
        .afterClosed()
        .subscribe(() => this.retrievePartner());
    }
  }

  openQuickAdd(): void {
    const dialog = this.dialog.open(PartnerDialogComponent, {
      maxWidth: '98vw',
      maxHeight: '98vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
    })
      .afterClosed()
      .subscribe(() => this.retrievePartner());
  }

  openUpload() {
    const dialog = this.dialog.open(UploadDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: "partner"
    })
      .afterClosed()
      .subscribe(() => this.retrievePartner());
  }

  toggleDisplay() {
    this.configuration.searchEnabled = !this.configuration.searchEnabled;
  }
}
