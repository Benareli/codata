import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Setting } from 'src/app/models/settings/setting.model';
import { SettingService } from 'src/app/services/settings/setting.service';
import { Store } from 'src/app/models/settings/store.model';
import { StoreService } from 'src/app/services/settings/store.service';
import { Possession } from 'src/app/models/transaction/possession.model';
import { PossessionService } from 'src/app/services/transaction/possession.service';
import { Pos } from 'src/app/models/transaction/pos.model';
import { PosService } from 'src/app/services/transaction/pos.service';
import { Posdetail } from 'src/app/models/transaction/posdetail.model';
import { PosdetailService } from 'src/app/services/transaction/posdetail.service';
import { Payment } from 'src/app/models/accounting/payment.model';
import { PaymentService } from 'src/app/services/accounting/payment.service';

@Component({
  selector: 'app-printpos-dialog',
  templateUrl: './printpos-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class PrintposDialogComponent implements OnInit {
  comp_name?: string;
  comp_addr?: string;
  comp_phone?: string;
  comp_email?: string;

  constructor(
    public dialogRef: MatDialogRef<PrintposDialogComponent>,
    private settingService: SettingService,
    private globals: Globals,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    this.settingService.getAll()
      .subscribe(setting => {
        this.comp_name = setting[0].comp_name;
        this.comp_addr = setting[0].comp_addr;
        this.comp_phone = setting[0].comp_phone;
        this.comp_email = setting[0].comp_email;
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
