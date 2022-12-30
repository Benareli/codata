import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Entry } from 'src/app/models/entry.model';
import { EntryService } from 'src/app/services/entry.service';

@Component({
  selector: 'app-entry-dialog',
  templateUrl: './entry-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class EntryDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;
  entrys: Entry[];

  a = 0; b = 0;
  journidtitle?: string;
  log = 0;
  debit = 0;
  credit = 0;

  //Table
  displayedColumns: string[] = 
  ['label', 'account', 'debit', 'credit'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialogRef: MatDialogRef<EntryDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private entryService: EntryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data){
      this.journidtitle = this.data.journal_id;
      this.entryService.getJournal(this.data.journal_id)
        .subscribe(entry => {
          this.entrys = entry;
          this.dataSource.data = this.entrys;
          console.log(this.entrys);
          this.countDebCred();
        })
    }
    this.checkRole();
  }

  countDebCred(): void {
    this.debit = 0; this.credit = 0;
    for(let y=0;y<this.entrys.length;y++){
      this.debit = this.debit + Number(this.entrys[y].debit ? this.entrys[y].debit: 0);
      this.credit = this.credit + Number(this.entrys[y].credit ? this.entrys[y].credit: 0);
    }
    const debcred = {
      total: "Total", debit: this.debit, credit: this.credit
    }
    this.entrys.push(debcred);
    this.dataSource.data = this.entrys;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
