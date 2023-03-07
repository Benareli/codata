import { Component, ViewChild, OnInit } from '@angular/core';
import { Globals } from 'src/app/global';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { BaseURL } from 'src/app/baseurl';

import { Company } from 'src/app/models/company.model';
import { Id } from 'src/app/models/id.model';
import { Possession } from 'src/app/models/possession.model';
import { Store } from 'src/app/models/store.model';
import { Tax } from 'src/app/models/tax.model';
import { User } from 'src/app/models/user.model';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { CompanyService } from 'src/app/services/company.service';
import { IdService } from 'src/app/services/id.service';
import { PossessionService } from 'src/app/services/possession.service';
import { StoreService } from 'src/app/services/store.service';
import { TaxService } from 'src/app/services/tax.service';
import { User2Service } from 'src/app/services/user2.service';

import { RegisterComponent } from '../../user_auth/register/register.component';
import { UserroleDialogComponent } from '../../main/dialog/userrole-dialog.component';
import { TaxDialogComponent } from '../../main/dialog/tax-dialog.component';
import { StoreDialogComponent } from '../../main/dialog/store-dialog.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../../../style/main.sass']
})
export class SettingComponent implements OnInit {
  titlecolor: string = "#2889e9";
  navcolor: string = "#ffffff";
  stores?: Store[];
  users?: User[];
  taxs?: Tax[];
  ids?: Id[];
  companyid?: string;
  cost_general?: boolean = true;
  pos_shift?: boolean = false;
  restaurant?: boolean = false;
  comp_name?: string;
  comp_addr?: string;
  comp_phone?: string;
  comp_email?: string;
  prepos?: string;
  prepossession?: string;
  pretransfer?: string;
  prepay?: string;
  prepurchase?: string;
  prejournal?: string;
  prebill?: string;
  isAdm?: boolean = false;
  explain1?: string = "";
  explain2?: string = "";

  //Upload File
  fileName: string | undefined;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;
  oriimage?: string;

  //API QR
  width: number = 200;
  api1: string = "apikey";
  api2: string = "apikey2";

  //Table Store
  displayedColumns: string[] = ['name','address','phone','warehouse'];
  dataSource = new MatTableDataSource<Store>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Table Tax
  displayedColumnsTax: string[] = ['name','tax','include'];
  dataSourceTax = new MatTableDataSource<Tax>();
  @ViewChild(MatPaginator, { static: true }) paginatorTax!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortTax!: MatSort;

  //Table User
  displayedColumnsUser: string[] = ['name'];
  dataSourceUser = new MatTableDataSource<User>();
  @ViewChild(MatPaginator, { static: true }) paginatorUser!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortUser!: MatSort;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private token: TokenStorageService,
    private uploadService: FileUploadService,
    private companyService: CompanyService,
    private storeService: StoreService,
    private user2Service: User2Service,
    private idService: IdService,
    private possessionService: PossessionService,
    private taxService: TaxService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveCompany();
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isAdm) {
      this.router.navigate(['/']);
    }else{
      this.api1 = BaseURL.API_KEY;
      this.api2 = BaseURL.API_KEY2;
    }
    this.imageInfos = this.uploadService.getFiles();    
  }

  retrieveCompany(): void {
    this.companyService.getAll()
      .subscribe(company => {
        this.companyid = company[0].id;
        this.cost_general = company[0].cost_general;
        this.explainer1();
        this.comp_name = company[0].comp_name;
        this.comp_addr = company[0].comp_addr;
        this.comp_phone = company[0].comp_phone;
        this.comp_email = company[0].comp_email;
        this.navcolor = company[0].nav_color!.toString();
        this.titlecolor = company[0].title_color!.toString();
        this.oriimage = company[0].image;
        this.pos_shift = company[0].pos_shift;
        this.restaurant = company[0].restaurant;
      })
    this.storeService.getAll()
      .subscribe(store => {
        this.dataSource.data = store;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    this.user2Service.getAll()
      .subscribe(user2 => {
        this.dataSourceUser.data = user2;
        this.dataSourceUser.paginator = this.paginatorUser;
        this.dataSourceUser.sort = this.sortUser;
      })
    this.idService.getAll()
      .subscribe(ids => {
        this.prepos = ids[0].pre_pos_id;
        this.prepossession = ids[0].pre_pos_session;
        this.pretransfer = ids[0].pre_transfer_id;
        this.prepay = ids[0].pre_pay_id;
        this.prepurchase = ids[0].pre_purchase_id;
        this.prejournal = ids[0].pre_journal_id;
        this.prebill = ids[0].pre_bill_id;
      })
    this.taxService.getAll()
      .subscribe(taxs => {
        this.dataSourceTax.data = taxs;
        this.dataSourceTax.paginator = this.paginatorTax;
        this.dataSourceTax.sort = this.sortTax;
      })
    this.explainer2();
  }

  ngModelChange1(event: boolean) {
    this.cost_general = event;
    this.explainer1();
  }
  explainer1(): void {
    if(this.cost_general) {
      this.explain1 = "1. Harga HPP akan dihitung secara rata-rata\n"+
          "2. Penjualan melalui POS tidak terganggu dengan stock barang yang kurang dari/sama dengan 0"
    }else if(!this.cost_general){
      this.explain1 = "1. Harga HPP akan dihitung secara rata-rata per supplier\n" +
          "2. Penjualan melalui POS tidak bisa dilakukan jika stock barang kurang dari/sama dengan 0";
    }
  }
  ngModelChange2(event: boolean) {
    this.pos_shift = event;
    this.explainer2();
  }

  explainer2(): void {
    if(this.pos_shift) {
      this.explain2 = "1. POS akan dibatasi per sesi per pengguna.\n" +
          "2. Pengguna disarankan menutup sesi setiap selesai shift untuk meng-kalkulasi penjualan dan pembayaran."
    }else if(!this.pos_shift) {
      this.explain2 = "1. POS dapat digunakan dengan bebas\n"
    }
  }

  selectFiles(event: any): void {
    this.message = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          const msg = 'Uploaded the file successfully: ' + file.name;
          this.fileName = file.name;
          this.message.push(msg);
          this.imageInfos = this.uploadService.getFiles();
        },
        error: (err: any) => {
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
    const setImage = {
      image: this.fileName
    }
    this.companyService.update(this.companyid, setImage)
      .subscribe({
        next: (res) => {
          this.reloadPage();
        },
        error: (e) => console.error(e)
      })
  }

  save1(): void {
    const save1 = {
      comp_name: this.comp_name,
      comp_addr: this.comp_addr,
      comp_phone: this.comp_phone,
      comp_email: this.comp_email,
      nav_color: this.navcolor,
      title_color: this.titlecolor
    }

    this.companyService.update(this.companyid, save1)
        .subscribe({
          next: (res) => {
            this.retrieveCompany();
          },
          error: (e) => console.error(e)
        });
  }

  save2(): void {
    const save2 = {
      cost_general: this.cost_general
    }

    this.companyService.update(this.companyid, save2)
      .subscribe(res => {
        this.retrieveCompany();
        this.reloadPage();
      });
  }

  save3(): void {
    this.possessionService.getAllOpen()
      .subscribe(poss => {
        if(poss.length>0){
          this._snackBar.open("Tidak bisa menutup karena ada POS Session Terbuka", "Tutup", {duration: 10000});
          this.retrieveCompany();
        }else{
          const save3 = {
            pos_shift: this.pos_shift,
            restaurant: this.restaurant,
          }
          this.companyService.update(this.companyid, save3)
            .subscribe({
              next: (res) => {
                this.retrieveCompany();
                this.reloadPage();
              },
              error: (e) => console.error(e)
            });
        }
      })
  }

  addTax(): void {
    const dialog = this.dialog.open(TaxDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true
    })
      .afterClosed()
      .subscribe(() => this.retrieveCompany());
  }

  openTax(row: Tax): void {
    const dialog = this.dialog.open(TaxDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveCompany());
  }

  addStore(): void {
    const dialog = this.dialog.open(StoreDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true
    })
      .afterClosed()
      .subscribe(() => this.retrieveCompany());
  }

  openStore(row: Tax): void {
    const dialog = this.dialog.open(StoreDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveCompany());
  }

  addUser(): void {
    const dialog = this.dialog.open(RegisterComponent, {
      width: '50%',
      height: '50%',
      disableClose: true
    })
      .afterClosed()
      .subscribe(() => this.retrieveCompany());
  }

  userRole(row: User): void {
    const dialog = this.dialog.open(UserroleDialogComponent, {
      width: '90%',
      height: '98%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveCompany());
  }

  reloadPage(): void {
    window.location.reload();
  }
}
