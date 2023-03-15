import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Globals } from 'src/app/global';
import { Product } from 'src/app/models/masterdata/product.model';
import { Uom } from 'src/app/models/masterdata/uom.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';

import { IdService } from 'src/app/services/settings/id.service';
import { SaleService } from 'src/app/services/transaction/sale.service';
import { SaledetailService } from 'src/app/services/transaction/saledetail.service';
import { LogService } from 'src/app/services/settings/log.service';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { UomService } from 'src/app/services/masterdata/uom.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';
import { StockmoveService } from 'src/app/services/transaction/stockmove.service';
import { JournalService } from 'src/app/services/accounting/journal.service';

import { SmpartDialogComponent } from '../stockmove/smpart-dialog.component';
import { InvoicecreateDialogComponent } from '../../invoicecreate-dialog.component';

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['../../../../../style/main.sass']
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
  uoms?: Uom[];
  customerString?: number;
  warehouseString?: number;
  datid?: string;
  datprod?: any;
  datqty?: number;
  datprice?: number;
  datdisc?: number;
  dattax?: number;
  datsub?: number;
  datdate?: string;
  datuom?: string;
  datuomid?: number;
  datexpected?: Date;
  totalqty?: number = 0;
  totaldone?: number = 0;
  persenqty?: number = 0;
  thissub?: number = 0;
  thistax?: number = 0;
  thisdisc?: number = 0;
  thistotal?: number = 0;
  ph?: string = 'Ketik disini untuk cari';

  smtotal: number = 0;
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
    private uomService: UomService,
    private stockmoveService: StockmoveService,
    private journalService: JournalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.retrieveData();
    this.checkRole();
    this.edit = true;
    this.lock = false;
    this.saleid = "New Draft"
    this.datas = [{products:"",qty:"",price_unit:""}];
    this.datdate = new Date().toISOString().split('T')[0];
    if(this.data){
      this.lock = true;
      this.edit = false;
      this.retrieveSO();
      this.retrieveSODetail();
    }
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="sale_user") this.isSalU=true;
      if(this.globals.roles![x]=="sale_manager") this.isSalM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isSalM || !this.isAdm) this.isRes = true;
    this.currentIndex1 = -1;
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe(logSR => {
        logSR = logSR.filter(dataSR => dataSR.sale === this.data);
        this.log = logSR.length;
      })
  }

  retrieveData(): void {
    this.partnerService.findAllActiveCustomer()
      .subscribe(dataSup => {
        this.partners = dataSup;
        this.customerString = 0;
      });
    this.warehouseService.findAllActive()
      .subscribe(datawh => {
        this.warehouses = datawh;
        this.warehouseString = datawh[0].id;
      });
    this.productService.findAllPOReady()
      .subscribe(dataProd => {
        this.products = dataProd;
      });
    this.uomService.getAll()
      .subscribe(dataUom => {
        this.uoms = dataUom;
      });
  }

  retrieveSO(): void {
    this.saleService.get(this.data)
      .subscribe(dataSO => {
        this.saleid = dataSO.sale_id;
        this.customerString = dataSO.partner_id;
        this.warehouseString = dataSO.warehouse_id;
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
                this.retrieveLog();
              })
          })
      })
  }

  retrieveSODetail(): void {
    this.saledetailService.getBySOId(this.data)
    .subscribe(SOD => {
      console.log(SOD);
      if(this.datas[0].products=='') this.datas.splice(0,1);
      for(let x=0;x<SOD.length;x++){
        this.totalqty = Number(this.totalqty) + Number(SOD[x].qty) ?? 0;
        this.totaldone = Number(this.totaldone) + Number(SOD[x].qty_done) ?? 0;
        this.datas.push(SOD[x]);
        this.dataSource.data = this.datas;
      }
      this.persenqty = Number(this.totaldone) / Number(this.totalqty) * 100;
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
    this.datuom = product.uoms;
    this.datuomid = product.uoms.id;
    this.datprice = product.listprice ?? 0;
    this.dattax = product.taxouts.tax ?? 0;
  }

  pushing(): void {
    if(this.datid){
      this.uomService.get(this.datuomid).subscribe(uomz => {
        this.datas.push({
          id: this.datid, products: this.datprod, qty: this.datqty, qty_done: 0, uoms: uomz, 
          uom_id: Number(this.datuomid), price_unit: this.datprice ?? 0, tax: this.dattax ?? 0, discount: this.datdisc,
          subtotal: (Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) - 
            (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) +
            (Number(this.dattax ?? 0)/100 * ((Number(this.datqty ?? 0) * Number(this.datprice ?? 0)) - 
            (Number(this.datdisc ?? 0) / 100 * Number(this.datqty ?? 0) * Number(this.datprice ?? 0)))) ?? 0
        });
        if(this.datas[0].products=='') this.datas.splice(0,1);
        this.dataSource.data = this.datas;
        this.ph = "Ketik disini untuk cari";
        this.term = "";
        this.calculateSub();
      })
    }else{
      this.retrieveData();
    }
  }

  deleteSODetail(index: number, id: any, product: any): void {
    if(product.id){
      if(this.smtotal > 0){
        this._snackBar.open("Sudah ada Penerimaan Barang!", "Tutup", {duration: 5000});
      }else{
        if(this.data){
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
              const POEd = {
                amount_tax: this.thistax ?? 0,
                amount_untaxed: this.thissub ?? 0,
                amount_discount: this.thisdisc ?? 0,
                amount_total: this.thistotal ?? 0,
                message: this.isUpdated + " ke " + this.thistotal,
                user: this.globals.userid
              };
              this.saleService.update(this.data, POEd)
                .subscribe(resb => {
                  this.saledetailService.delete(id)
                    .subscribe(resc => {
                      if(resc.message == 'done'){
                        this.retrieveSO();
                        this.datas.splice(index, 1);
                        this.dataSource.data = this.datas;
                      }
                    })
                  })
          })
        }else{
          this.deleteDraftSODetail(index);
        }
      }
    }else{
      this.deleteDraftSODetail(index);
    }
    if(this.datas.length==0){
      this.datas = [{product:"",qty:"",price_unit:""}];
    }
  }

  deleteDraftSODetail(index: number): void {
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
    this.datuomid = undefined;
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
    if(this.data){
      const POEd = {
        partner_id: this.customerString,
        warehouse_id: this.warehouseString,
        amount_tax: this.thistax ?? 0,
        amount_untaxed: this.thissub ?? 0,
        amount_discount: this.thisdisc ?? 0,
        amount_total: this.thistotal ?? 0,
        message: this.isUpdated + " ke " + this.thistotal,
        user: this.globals.userid
      };
      this.saleService.update(this.data, POEd)
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
      supplier: this.customerString,
      warehouse: this.warehouseString,
      user: this.globals.userid,
      paid: 0,
      delivery_state: 0,
      open: true,
      company: this.globals.companyid
    };
    console.log("header", salHeaderData);
    this.saleService.create(salHeaderData)
      .subscribe({
        next: (res) => {
          console.log("response", res);
          this.saleHeader = res.id;
          this.rollingDetail(res.id);
        },error: (e) => console.error(e)
      });
  }

  rollingDetail(salid: string): void {
    if(this.datas.length>0){
      if(!this.datas[0].purchase_id){
        this.createDetail(salid, this.datas[0].qty, this.datas[0].uom_id,
          this.datas[0].price_unit, this.datas[0].discount, this.datas[0].tax,
          this.datas[0].subtotal, this.datas[0].id);
      }else {
        this.datas.splice(0, 1);
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

  createDetail(salid:string, qty:number, uom:number, price_unit:number, discount:number, tax:number,
    subtotal:number, product:number): void {
      const saleDetail = {
        sale_id: salid,
        qty: qty,
        qty_done: 0,
        qty_inv: 0,
        uom: uom,
        price_unit: price_unit,
        discount: discount,
        tax: tax,
        subtotal: subtotal,
        product: product,
        partner: this.customerString,
        warehouse: this.warehouseString,
        date: this.datdate,
        user: this.globals.userid,
        company: this.globals.companyid
      };
      this.saledetailService.create(saleDetail)
        .subscribe({
          next: (res) => {
            this.datas.splice(0, 1);
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
