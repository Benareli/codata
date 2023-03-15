import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { Globals } from 'src/app/global';
import { Journal } from 'src/app/models/accounting/journal.model';
import { Entry } from 'src/app/models/accounting/entry.model';
import { Coa } from 'src/app/models/accounting/coa.model';

import { JournalService } from 'src/app/services/accounting/journal.service';
import { EntryService } from 'src/app/services/accounting/entry.service';
import { CoaService } from 'src/app/services/accounting/coa.service';

@Component({
  selector: 'app-entry-dialog',
  templateUrl: './entry-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
})
export class EntryDialogComponent implements OnInit {
  isChecked = false;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;
  new = false;
  jourtype?: string;
  entrys: Entry[];
  coas: Coa[];
  jourtypes: any;
  term: string;
  ph?: string = 'Ketik disini untuk cari';
  coaid?: number;
  coasel?: any;
  balance?: string;
  openDropDown = false;

  a = 0; b = 0;
  journidtitle?: string;
  datlabel?: string;
  datdate?: string;
  datdebit: number = 0;
  datcredit: number = 0;
  log = 0;
  debit = 0;
  credit = 0;
  currentIndex1 = -1;

  //Table
  displayedColumns: string[] = 
  ['label', 'account', 'debit', 'credit', 'action'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    public dialogRef: MatDialogRef<EntryDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private journalService: JournalService,
    private entryService: EntryService,
    private coaService: CoaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.retrieveData();
    if (!this.data){
      this.new = true;
      this.journidtitle = "New Draft";
      this.entrys = [];
    }else{
      this.journidtitle = this.data.name;
      this.journalService.get(this.data.id)
      //this.entryService.getJournal(this.data.journal_id)
        .subscribe(entry => {
          this.entrys = entry.entrys;
          this.datdate = entry.date?.toString().split('T')[0];
          this.jourtype = entry.type;
          /*this.columns = [
            {key:'label', title:'Label', width: '25%'},
            {key:'debit_id', title:'Account', width:'35%'},
            {key:'debit', title:'Debit', width:'15%'},
            {key:'credit', title:'Credit', orderBy:'desc', width:'15%'},
            {key:'',title:'Quick View', width:'10%'}
          ];
          this.configuration = { ...DefaultConfig };
          this.configuration.columnReorder = true;
          this.configuration.searchEnabled = false;
          this.configuration.headerEnabled = true;
          this.configuration.detailsTemplate = true;
          this.configuration.tableLayout.hover = true;*/
          this.countDebCred();
        })
    }
    this.checkRole();
  }

  retrieveData(): void {
    this.coaService.findAllActive()
      .subscribe(coa => {
        this.coas = coa;
      })
    this.journalService.findJourType()
      .subscribe(type => {
        this.jourtypes = [];
        for(let x=0; x<type.length; x++){
          if(type[x].toString() == 'invoice' || type[x].toString() == 'bill'){
            //Do Nothing
          }else{
            this.jourtypes.push(type[x]);
          }
        }
        if (!this.data){
          this.jourtype = 'miscellaneous'
        }
        //this.jourtypes = type;
      })
  }

  onF(): void {
    this.openDropDown = !this.openDropDown;
  }

  getCoa(coa: Coa, index: number): void {
    this.currentIndex1 = index;
    this.onF();
    this.coasel = coa;
    this.coaid = coa.id;
    this.term = coa.code + ' - ' + coa.name!.toString();
    this.ph = coa.code + ' - ' + coa.name;
  }

  pushing(): void {
    if(!this.datlabel){
      this._snackBar.open("Label Harus Diisi!", "Tutup", {duration: 5000});
    }else if(this.ph == "Ketik disini untuk cari"){
      this._snackBar.open("Akun Harus Diisi!", "Tutup", {duration: 5000});
    }else if(!this.datdebit && !this.datcredit){
      this._snackBar.open("Nilai Harus Diisi!", "Tutup", {duration: 5000});
    }else if(this.datdebit > 0 && this.datcredit > 0){
      this._snackBar.open("Silahkan isi Debit atau Credit Saja!", "Tutup", {duration: 5000});
    }else{
      if(this.datdebit > 0){
        this.entrys.push({
          label: this.datlabel, debit: this.datdebit, debits: this.coasel,
        });
        this.cleanInputBar();
      }else if(this.datcredit > 0){
        this.entrys.push({
          label: this.datlabel, credit: this.datcredit, credits: this.coasel,
        });
        this.cleanInputBar();
      }
    }
  }

  cleanInputBar(): void {
    this.dataSource.data = this.entrys;
    this.ph = "Ketik disini untuk cari";
    this.term = "";
    this.datlabel = undefined;
    this.datdebit = 0;
    this.datcredit = 0;
    this.countDebCred();
  }

  countDebCred(): void {
    this.debit = 0; this.credit = 0;
    for(let y=0;y<this.entrys.length;y++){
      this.debit = this.debit + Number(this.entrys[y].debit ? this.entrys[y].debit: 0);
      this.credit = this.credit + Number(this.entrys[y].credit ? this.entrys[y].credit: 0);
    }
    if(this.debit == this.credit){
      this.balance = 'balance';
    }else{
      this.balance = 'not balance';
    }
    if(this.data){
      const debcred = {
        total: "Total", debit: this.debit, credit: this.credit
      }
      this.entrys.push(debcred);
      this.dataSource.data = this.entrys;
    }
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
  }

  saveJournal() {
    if(!this.datdate){
      this._snackBar.open("Tanggal Tidak Boleh Kosong!", "Tutup", {duration: 5000});
    }else{
      const Jour = {
        date: this.datdate,
        type: this.jourtype,
        entry: this.entrys,
        amount: this.debit,
        company: this.globals.companyid,
        user: this.globals.userid
      }
      this.journalService.createJour(Jour)
        .subscribe(inputJour => {
          if(inputJour.message == 'done') this.closeDialog();
        })
    }
    
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
