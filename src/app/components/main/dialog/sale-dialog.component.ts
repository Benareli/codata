import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';

import { Columns, Config, DefaultConfig } from 'ngx-easy-table';

import { SmpartDialogComponent } from './transaction/stockmove/smpart-dialog.component';
import { InvoicecreateDialogComponent } from './invoicecreate-dialog.component';

import { Id } from 'src/app/models/settings/id.model';
import { IdService } from 'src/app/services/settings/id.service';
import { Sale } from 'src/app/models/transaction/sale.model';
import { SaleService } from 'src/app/services/transaction/sale.service';
import { Saledetail } from 'src/app/models/transaction/saledetail.model';
import { SaledetailService } from 'src/app/services/transaction/saledetail.service';
import { Log } from 'src/app/models/settings/log.model';
import { LogService } from 'src/app/services/settings/log.service';
import { Product } from 'src/app/models/masterdata/product.model';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';
import { Stockmove } from 'src/app/models/transaction/stockmove.model';
import { StockmoveService } from 'src/app/services/transaction/stockmove.service';
import { Journal } from 'src/app/models/accounting/journal.model';
import { JournalService } from 'src/app/services/accounting/journal.service';

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class SaleDialogComponent implements OnInit {
  lock = false;
  edit = false;
  edit_text = "Edit";
  isChecked = false;
  isSalU = false;
  isSalM = false;
  isAdm = false;
  isRes = false;
  draft?: boolean = false;
  term: string;
  openDropDown = false;

  partners?: Partner[];
  warehouses?: Warehouse[];
  products?: Product[];
  customerString?: string;
  warehouseString?: string;
  datid?: string;
  datprod?: any;
  datqty?: number;
  datprice?: number;
  datdisc?: number;
  dattax?: number;
  datsub?: number;
  datdate?: string;
  datuom?: string;
  datexpected?: Date;
  totalqty?: number = 0;
  totaldone?: number = 0;
  persenqty?: number = 0;
  thissub?: number = 0;
  thistax?: number = 0;
  thisdisc?: number = 0;
  thistotal?: number = 0;
  ph?: string = 'Ketik disini untuk cari';

  smtotal?: number;
  invtotal?: number;

  saleid?: string;
  saleHeader?: string;
  prefixes?: string;
  transid?: string;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'qty_done', 'price_unit', 'discount', 'tax', 'subtotal', 'action'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;
  currentIndex1 = -1;

  columns: Columns[];
  configuration: Config;

  constructor(
    public dialogRef: MatDialogRef<SaleDialogComponent>,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private globals: Globals,
    private logService: LogService,
    private idService: IdService,
    private saleService: SaleService,
    private saledetailService: SaledetailService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService,
    private productService: ProductService,
    private stockmoveService: StockmoveService,
    private journalService: JournalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.retrieveData();
    this.edit = true;
    if(this.data){
      this.lock = true;
      this.edit = false;
      this.retrieveSO();
      this.retrieveSODetail();
    }
    this.datas = [{product:"",qty:"",price_unit:""}]
    this.dataSource.data = this.datas;
    this.datdate = new Date().toISOString().split('T')[0];
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="sale_user") this.isSalU=true;
      if(this.globals.roles![x]=="sale_manager") this.isSalM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isSalM || !this.isAdm) this.isRes = true;
    this.retrieveLog();
    this.currentIndex1 = -1;
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe(logPR => {
        logPR = logPR.filter(dataPR => dataPR.sale === this.data);
        this.log = logPR.length;
      })
  }

  retrieveData(): void {
    this.partnerService.findAllActiveCustomer()
      .subscribe(dataSup => {
        this.partners = dataSup;
        this.customerString = dataSup[0].id;
      })
    this.warehouseService.findAllActive()
      .subscribe(datawh => {
        this.warehouses = datawh;
        this.warehouseString = datawh[0].id;
      })
    this.productService.findAllActive()
      .subscribe(dataProd => {
        this.products = dataProd;
      })
  }

  retrieveSO(): void {
    this.saleService.get(this.data)
      .subscribe(dataSO => {
        this.customerString = dataSO.customer._id;
        this.warehouseString = dataSO.warehouse._id;
        this.saleHeader = dataSO.id;
        this.thissub = dataSO.amount_untaxed;
        this.thisdisc = dataSO.discount;
        this.thistax = dataSO.amount_tax;
        this.thistotal = dataSO.amount_total;
        this.draft = dataSO.open;
        this.stockmoveService.findOrigin(dataSO.sale_id)
          .subscribe(sms => {
            this.smtotal = sms.length;
            this.journalService.findOrigin(dataSO.sale_id)
              .subscribe(js => {
                this.invtotal = js.length;
              })
          })
      })

  }

  retrieveSODetail(): void {
    this.saleService.get(this.data)
      .subscribe(SOId => {
        this.saleid = SOId.sale_id;
        this.saledetailService.getBySOId(SOId.sale_id)
          .subscribe(SOD => {
            if(this.datas[0].product=='') this.datas.splice(0,1);
            for(let x=0;x<SOD.length;x++){
              this.totalqty = Number(this.totalqty) + Number(SOD[x].qty) ?? 0;
              this.totaldone = Number(this.totaldone) + Number(SOD[x].qty_done) ?? 0;
              this.datas.push(SOD[x]);
              this.dataSource.data = this.datas;
            }
            this.persenqty = Number(this.totaldone) / Number(this.totalqty) * 100;
            
            this.columns = [
              {key:'product', title:'Product'},
              {key:'qty', title:'Qty'},
              {key:'qty_done', title:'Qty Sent'},
              {key:'price_unit', title:'Price Unit'},
              {key:'discount', title:'Discount'},
              {key:'tax', title:'Tax'},
              {key:'subtotal', title:'Subtotal'},
              {key:'', title:'Action'}
            ];
            this.configuration = { ...DefaultConfig };
            this.configuration.searchEnabled = false;
            this.configuration.headerEnabled = false;
            this.configuration.paginationEnabled = false;
          })
      })
  }

  getProd(product: Product, index: number): void {
    this.currentIndex1 = index;
    this.onF();
    this.term = product.name!.toString();
    this.ph = product.name;
    this.datprod = product;
    this.datid = product.id;
    this.datqty = 1;
    this.datuom = product.suom;
    this.datprice = product.listprice ?? 0;
    this.dattax = product.taxout.tax ?? 0;
  }

  pushing(): void {
    if(this.datas[0].product=='') this.datas.splice(0,1);
    if(this.datid){
      const dataPush = {
        id: this.datid, product: this.datprod, qty: this.datqty, qty_done: 0, uom: this.datuom,
        price_unit: this.datprice ?? 0, tax: this.dattax ?? 0, discount: this.datdisc,
        subtotal: (Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) - 
          (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) +
          (Number(this.dattax ?? 0)/100 * ((Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) - 
          (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0)))) ?? 0
      }
      this.datas.push(dataPush);
      this.dataSource.data = this.datas;
      this.ph = "Ketik disini untuk cari";
      this.term = "";
      this.calculateSub();
    }
  }

  deleteSODetail(index: number, id: any, product: any): void {
    if(product._id){
      if(this.datas[index].stockmove.length>0){
        this._snackBar.open("Sudah ada Penerimaan Barang!", "Tutup", {duration: 5000});
      }else{
        this.saledetailService.get(id)
          .subscribe(resa => {
            this.thissub = Number(this.thissub) - (Number(resa.qty) * Number(resa.price_unit));
            this.thisdisc = Number(this.thisdisc) +
              (Number(resa.discount ?? 0) / 100 * Number(resa.qty ?? 0) * Number(resa.price_unit ?? 0));
            this.thistax = Number(this.thistax) -
              (Number(resa.tax ?? 0)/100 * ((Number(resa.qty ?? 0) * Number(resa.price_unit ?? 0)) - 
              (Number(resa.discount ?? 0) / 100 * Number(resa.qty ?? 0) * Number(resa.price_unit ?? 0)))) ?? 0 + 
              Number(this.thistax??0);
            this.thistotal = Number(this.thistotal) - Number(resa.subtotal);
            const SOEd = {
              amount_tax: this.thistax ?? 0,
              amount_untaxed: this.thissub ?? 0,
              amount_discount: this.thisdisc ?? 0,
              amount_total: this.thistotal ?? 0,
              message: this.isUpdated + " ke " + this.thistotal,
              user: this.globals.userid
            };
            this.saleService.update(this.data, SOEd)
              .subscribe(resb => {
                this.saledetailService.delete(id)
                  .subscribe(resc => {
                    this.retrieveSO();
                    this.datas.splice(index, 1);
                    this.dataSource.data = this.datas;
                  })
              })
        })
      }
    }else{
      this.thissub = Number(this.thissub) - (Number(this.datas[index].qty) * Number(this.datas[index].price_unit));
      this.thisdisc = Number(this.thisdisc) +
        (Number(this.datas[index].discount ?? 0) / 100 * Number(this.datas[index].qty ?? 0) * Number(this.datas[index].price_unit ?? 0));
      this.thistax = Number(this.thistax) -
        (Number(this.datas[index].tax ?? 0)/100 * ((Number(this.datas[index].qty ?? 0) * Number(this.datas[index].price_unit ?? 0)) - 
        (Number(this.datas[index].discount ?? 0) / 100 * Number(this.datas[index].qty ?? 0) * Number(this.datas[index].price_unit ?? 0)))) ?? 0 + 
        Number(this.thistax??0);
      this.thistotal = Number(this.thistotal) - Number(this.datas[index].subtotal);
      this.datas.splice(index, 1);
      this.dataSource.data = this.datas;
    }
    if(this.datas.length==0){
      this.datas = [{product:"",qty:"",price_unit:""}];
      this.dataSource.data = this.datas;
    }
  }

  editSO(): void {
    this.edit = !this.edit;
    if(this.edit) {
      this.edit_text = "Simpan";
      this.lock = false;
    }else {
      this.edit_text = "Edit";
    }
  }

  onF(): void {
    this.openDropDown = !this.openDropDown;
  }

  calculate(): void {
    this.datsub = (Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) - 
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) +
      (Number(this.dattax ?? 0)/100 * ((Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) - 
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0)))) ?? 0;
  }

  calculateSub(): void {
    this.thissub = Number(this.thissub??0) + (Number(this.datqty??0) * Number(this.datprice??0));
    //this.thistotal = Number(this.thistotal??0) + Number(this.datsub??0);
    this.thistax = Number(this.thistax??0) +
      (Number(this.dattax ?? 0)/100 * ((Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) - 
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0)))) ?? 0 + Number(this.thistax??0);
    this.thisdisc = Number(this.thisdisc??0) -
      (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0));
    this.thistotal = this.thissub + this.thisdisc + this.thistax;
    this.datid = undefined;
    this.datdisc = undefined;
    this.datprod = undefined;
    this.datqty = undefined;
    this.datprice = undefined;
    this.dattax = undefined;
    this.datsub = undefined;
  }

  validate() {
    this.saleService.updateState(this.data, false)
      .subscribe(ustate => {
        this.closeBackDialog();
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  closeBackDialog() {
    this.dialogRef.close(this.saleHeader);
  }

  startSO(): void {
    if(this.saleid){
      const SOEd = {
        amount_tax: this.thistax ?? 0,
        amount_untaxed: this.thissub ?? 0,
        amount_discount: this.thisdisc ?? 0,
        amount_total: this.thistotal ?? 0,
        message: this.isUpdated + " ke " + this.thistotal,
        user: this.globals.userid
      };
      this.saleService.update(this.data, SOEd)
        .subscribe(resb => {
          this.rollingDetail(this.data);
        })
    }else{
      if(this.customerString){
        if(this.datas[0].product!=""&&this.datas[0].qty!=""){
          this.idService.getSaleId()
            .subscribe({
              next: (ids) => {
                this.saleid = ids.message;
                this.insertHeader();
              }
            })
        }else this._snackBar.open("Order Kosong", "Tutup", {duration: 5000});
      }else this._snackBar.open("Supplier Kosong", "Tutup", {duration: 5000});
    }
  }

  insertHeader(): void {
    const salHeaderData = {
      sale_id: this.saleid,
      date: this.datdate,
      expected: this.datexpected,
      discount: this.thisdisc,
      amount_tax: this.thistax ?? 0,
      amount_untaxed: this.thissub ?? 0,
      amount_discount: this.thisdisc ?? 0,
      amount_total: this.thistotal ?? 0,
      customer: this.customerString,
      warehouse: this.warehouseString,
      user: this.globals.userid,
      paid: 0,
      delivery_state: 0,
      open: true
    };
    this.saleService.create(salHeaderData)
      .subscribe({
        next: (res) => {
          this.saleHeader = res.id;
          this.rollingDetail(res.id);
        },error: (e) => console.error(e)
      });
  }

  rollingDetail(salid: string): void {
    if(this.datas.length>0){

      if(!this.datas[0].sale_id){
        this.createDetail(salid, this.datas[0].qty, this.datas[0].uom,
          this.datas[0].price_unit, this.datas[0].discount, this.datas[0].tax,
          this.datas[0].subtotal, this.datas[0].id, this.datas[0].partner,
          this.datas[0].warehouse);
      }else {
        this.datas.splice(0, 1);
        this.dataSource.data = this.datas;
        this.rollingDetail(salid);
      }
    }else{
      this.thissub = 0;
      this.thisdisc = 0;
      this.thistax = 0;
      this.thistotal = 0;
      this.closeBackDialog();
    }
  }

  createDetail(salid:string, qty:number, uom:string, price_unit:number, discount:number, tax:number,
    subtotal:number, product:string, partner:string, warehouse:string): void {
      const saleDetail = {
        ids: salid,
        sale_id: this.saleid,
        qty: qty,
        qty_done: 0,
        qty_inv: 0,
        uom: uom,
        price_unit: price_unit,
        discount: discount,
        tax: tax,
        subtotal: subtotal,
        product: product,
        partner: partner,
        warehouse: warehouse,
        date: this.datdate,
        user: this.globals.userid
      };
      this.saledetailService.create(saleDetail)
        .subscribe({
          next: (res) => {
            this.datas.splice(0, 1);
            this.dataSource.data = this.datas;
            this.rollingDetail(salid);
          },
          error: (e) => console.error(e)
        });
  }

  sendAll(): void {
    for(let x=0; x< this.datas.length; x++){
      this.datas[x].qty_rec = this.datas[x].qty - this.datas[x].qty_done;
    }
    this.saledetailService.updateSendAll(
      this.globals.userid, this.customerString, this.warehouseString, this.datdate, this.datas)
      .subscribe(res => {
        this.closeBackDialog();
      })
  }

  openSendPartial() {
    /*const dialog = this.dialog.open(ReceivepartDialogComponent, {
      width: '90vw',
      height: '80%',
      disableClose: true,
      data: this.saleHeader
    }).afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        this.saledetailService.updateReceiveAll(
          this.globals.userid, this.customerString, result[0].warehouse, result[0].date, result)
            .subscribe(res => {
              this.closeBackDialog();
            })
      }
    });*/
  }

  startInvoice() {
    const dialog = this.dialog.open(InvoicecreateDialogComponent, {
      width: '90vw',
      height: '80%',
      disableClose: true,
      data: this.saleHeader
    }).afterClosed().subscribe(result => {
      this.closeBackDialog();
    });
  }
}
