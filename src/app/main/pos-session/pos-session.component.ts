import { Component, AfterContentInit, EventEmitter, 
  ViewChild, Output, OnInit, HostListener } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatGridList } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Id } from 'src/app/models/id.model';
import { IdService } from 'src/app/services/id.service';
import { Possession } from 'src/app/models/possession.model';
import { PossessionService } from 'src/app/services/possession.service';
import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';
import { Pos } from 'src/app/models/pos.model';
import { PosService } from 'src/app/services/pos.service';

@Component({
  selector: 'app-pos-session',
  templateUrl: './pos-session.component.html',
  styleUrls: ['../pos/pos.component.sass']
})
export class PosSessionComponent implements OnInit {
  isCalc = false;
  opened = false;
  isOpen = false;
  startB: string = '0';
  endingB?: number=0;
  user?: string;
  shiftSelect: string='1';
  transaction?: number=0;
  amount_total?: number=0;
  amount_untaxed?: number=0;
  amount_tax?: number=0;
  discount?: number=0;
  money_in?: number=0;
  bank?: number=0;
  money_out?: number=0;
  storeString?: string;

  possession?: string;
  prefixes?: string;

  posessiondones?: Possession[];
  stores?: Store[];

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private globals: Globals,
    private idService: IdService,
    private possessionService: PossessionService,
    private storeService: StoreService,
    private posService: PosService,
  ) { }

  ngOnInit(): void {
    this.user = this.globals.username;
    this.possessionService.getUserOpen(this.globals.userid)
      .subscribe(sess => {
        if (sess.length > 0){
          this.globals.pos_open = true;
          this.globals.pos_session = sess[0]!.session_id!;
          this.possession = sess[0]!.session_id!;
          this.globals.pos_session_id = sess[0]!.id!;
          this.opened = true;
          this.isOpen = sess[0]!.open!;
          this.startB = sess[0]!.start_balance!.toString();
          this.storeString = sess[0]!.store;
          this.shiftSelect = sess[0]!.shift!.toString();
          this.transaction = Number(sess[0]!.pos!.length);
          this.calculation(sess);
        }else{
          this.globals.pos_open = false;
          this.globals.pos_session = '';
          this.possession = '';
          this.globals.pos_session_id = '';
          this.opened = false;
        }
    });
    this.possessionService.getUserClose(this.globals.userid)
      .subscribe(sessclose => {this.posessiondones = sessclose});
    this.storeService.findAllActive()
      .subscribe(store => {this.stores = store;this.storeString=store[0].id});
  }

  toggleCalc(): void {
    this.isCalc = !this.isCalc;
  }

  onShiftChange(val: string) {
    this.shiftSelect = val;
  }

  calculation(sess: any){
    for(let x=0;x<sess[0].pos.length;x++){
      this.amount_total = this.amount_total + sess[0].pos[x].amount_total;
      this.amount_tax = this.amount_tax + sess[0].pos[x].amount_tax;
      this.amount_untaxed = this.amount_untaxed + sess[0].pos[x].amount_untaxed;
      this.discount = this.discount + sess[0].pos[x].discount;
    }
    this.calculate(sess);
  }

  calculate(sess: any){
    for(let x=0;x<sess[0].payment.length;x++){
      if(sess[0].payment[x].pay1method=="tunai"){
        this.money_in = this.money_in + sess[0].payment[x].payment1;
      }else{
        this.bank = this.bank + sess[0].payment[x].payment1;
      }
      if(sess[0].payment[x].pay2method=="tunai"){
        this.money_in = this.money_in + sess[0].payment[x].payment2;
      }else{
        this.bank = this.bank + sess[0].payment[x].payment2;
      }
      this.money_out = this.money_out + sess[0].payment[x].change;
      this.endingB = Number(this.startB) + this.money_in! - this.money_out!;
    }
  }

  openPOS(): void {
    this.router.navigate(['/pos']);
  }

  opening(): void {
    this.opened = true;
    this.isCalc = false;
    if(!this.globals.pos_open){
      this.idService.getPOSessId()
        .subscribe(idps => {
          this.possession = idps.message;
          if (!this.startB || this.startB==null) this.startB = '0';
          const current = new Date();
          const timestamp = current.getTime();
          const pos_session = {
            session_id: this.possession,
            store: this.storeString,
            time_open: timestamp,
            shift: Number(this.shiftSelect),
            start_balance: Number(this.startB),
            user: this.globals.userid,
            open: true
          };
          this.possessionService.create(pos_session)
            .subscribe(res => {
              console.log(res);
              this.globals.pos_session = this.possession;
              this.globals.pos_session_id = res.id;
              this.globals.pos_open = true;
              this.isOpen = true;
            })
        })
    }
  }

  closing(): void{
    const current = new Date();
    const timestamp = current.getTime();
    const pos_session = {
      session_id: this.possession,
      time_close: timestamp,
      end_balance: this.endingB,
      money_in: this.money_in,
      money_out: this.money_out,
      total_discount: this.discount,
      total_amount_untaxed: this.amount_untaxed,
      total_amount_tax: this.amount_tax,
      total_amount_total: this.amount_total,
      open: false
    };
    this.possessionService.update(this.globals.pos_session_id, pos_session)
      .subscribe(res => {
        this.globals.pos_open = false;
        this.globals.pos_session = '';
        this.globals.pos_session_id = '';
        this.opened = false;
        this.isOpen = false;
        this.startB = '0';
      })
  }

  press(key: string) {
    if(this.startB == '0'){
      this.startB = ''
    }
    if(key == 'C'){ 
      this.startB = '0';
      key = '';
    }
    this.startB += key;
  }

}
