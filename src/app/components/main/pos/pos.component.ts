import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/shared.service';
import * as CryptoJS from 'crypto-js';
import { BaseURL } from 'src/app/baseurl';
import { Globals } from 'src/app/global';

import { Product } from 'src/app/models/masterdata/product.model';
import { Productcat } from 'src/app/models/masterdata/productcat.model';
import { Brand } from 'src/app/models/masterdata/brand.model';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';
import { Store } from 'src/app/models/settings/store.model';
import { Pos } from 'src/app/models/transaction/pos.model';
import { Posdetail } from 'src/app/models/transaction/posdetail.model';

import { IdService } from 'src/app/services/settings/id.service';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { ProductCatService } from 'src/app/services/masterdata/product-cat.service';
import { BrandService } from 'src/app/services/masterdata/brand.service';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';
import { QopService } from 'src/app/services/transaction/qop.service';
import { StoreService } from 'src/app/services/settings/store.service';
import { PossessionService } from 'src/app/services/transaction/possession.service';
import { PosService } from 'src/app/services/transaction/pos.service';
import { PosdetailService } from 'src/app/services/transaction/posdetail.service';
import { PaymentService } from 'src/app/services/accounting/payment.service';

import { PosdetailDialogComponent } from '../dialog/posdetail-dialog.component';
import { PaymentDialogComponent } from '../dialog/accounting/payment/payment-dialog.component';
import { PrintposDialogComponent } from '../dialog/printpos-dialog.component';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['../../../style/main.sass']
})
export class PosComponent {
  products?: Product[];
  oriprods?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  warehouses?: Warehouse[];
  partners?: Partner[];
  stores?: Store[];
  pss?: Pos[];
  posdetails?: Posdetail[];
  partnerid?: string;
  storeid?: string;
  warehouseid?: string;
  orders: Array<any> = [];
  cols!: number;
  rowHeight!: string;

  baseUrl = BaseURL.BASE_URL;

  //qops
  qopss?: any;
  isqop = false;

  //disc
  isCalc = false;
  isPercent = true;
  disc: string="0";
  discType: string='percent';

  isPOSU = false;
  isPOSM = false;
  isAdm = false;

  currentIndex1 = -1;
  currentIndex2 = -1;
  currentIndex3 = -1;
  subtotal = 0;
  untaxed = 0;
  tax = 0;
  discount = 0;
  discadd = 0;
  total = 0;

  term!: string;
  posid?: string;
  payid?: string;
  prefixes?: string;
  today?: Date;

  isRightShow = false;

  //pos session
  pos_open = false;
  session: string='';
  session_id: string='';
  sess_id?: string;

  //Select Partner
  selectedPartner: string = "";
  selectedData1: { valuePartner: string; textPartner: string } = {
    valuePartner: "",
    textPartner: ""
  };
  selectedPartnerControl = new FormControl(this.selectedPartner);
  selectedValue(event: MatSelectChange) {
    this.partnerid = event.value;
  }

  //Select WH
  selectedStore: string = "";
  selectedData2: { valueStore: string; textStore: string } = {
    valueStore: "",
    textStore: ""
  };
  selectedStoreControl = new FormControl(this.selectedStore);
  selectedValue2(event: MatSelectChange) {
    //this.warehouseid = event.value;
    this.storeService.get(event.value)
      .subscribe(sw => {
        this.warehouseid = sw.warehouse._id;
        this.selectedStore = sw.id;
      })
  }

  //Grid
  width = 0;
  @HostListener('window:resize', ['$event'])
    onResize() {
      if(window.innerWidth>=1024){this.cols = 4; this.rowHeight = "60pt";}
      else if(window.innerWidth<1024&&window.innerWidth>=800){this.cols = 4; this.rowHeight = "60pt";}
      else if(window.innerWidth<800){this.cols = 1; this.rowHeight = "25pt";}
    }

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private globals: Globals,
    private sharedService: SharedService,
    private idService: IdService,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private warehouseService: WarehouseService,
    private qopService: QopService,
    private storeService: StoreService,
    private partnerService: PartnerService,
    private possessionService: PossessionService,
    private posService: PosService,
    private posDetailService: PosdetailService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.possessionService.getUserOpen(this.globals.userid)
      .subscribe(abc => {
        if(abc.length>0 && !this.globals.pos_open) this.router.navigate(['/pos-session']);
      })
    if(this.globals.pos_open){
      this.pos_open = true;
      this.session = this.globals!.pos_session!;
      this.session_id = this.globals!.pos_session_id!;
    }
    this.retrieveData();
    this.checkRole();
    this.qopss = [{partner:''}];
    if(window.innerWidth>=1024){this.cols = 4; this.rowHeight = "60pt";}
    else if(window.innerWidth<1024&&window.innerWidth>=800){this.cols = 4; this.rowHeight = "60pt";}
    else if(window.innerWidth<800){this.cols = 1; this.rowHeight = "25pt";}
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="pos_user") this.isPOSU=true;
      if(this.globals.roles![x]=="pos_manager") this.isPOSM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPOSU) this.router.navigate(['/']);
    this.retrieveData();
  }

  retrieveData(): void{
    //this.sharedService.setLoading(true)
    this.productCatService.findAllActive()
      .subscribe({
        next: (dataPC) => {
          this.productcats = dataPC;
        },
        error: (e) => console.error(e)
    });

    this.brandService.findAllActive()
      .subscribe({
        next: (dataB) => {
          this.brands = dataB;
        },
        error: (e) => console.error(e)
    });

    this.warehouseService.findAllActive()
      .subscribe(wh => {
        this.warehouses = wh;
    });

    this.storeService.findAllActive(JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
      .subscribe(store => {
        this.stores = store;
        this.selectedStore = store[0].id;
        this.warehouseid = this.stores.filter(stor => stor.id === store[0].id)[0].warehouse_id;
        console.log(this.stores, this.selectedStore, this.warehouseid)
    });

    this.partnerService.findAllActiveCustomer()
      .subscribe(partn => {
        this.partners = partn;
    });
    
    if(this.globals.cost_general){
      this.productService.findAllActive(JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
        .subscribe(prod => {
          this.products = prod;
          this.oriprods = this.products;
          this.sharedService.setLoading(false);
      });
    }else{
      this.productService.findAllReady(JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)))
        .subscribe(prod => {
          this.products = prod;
          this.oriprods = this.products;
          this.sharedService.setLoading(false);
      });
    }
    
    this.currentIndex1 = -1;
    this.currentIndex2 = -1;
  }

  filterCategory(productCat: Productcat, index: number): void {
    this.currentIndex1 = index;
    this.products = this.products!
        .filter(prod => 
          prod.category?._id === productCat.id
      );
  }

  filterBrands(brand: Brand, index: number): void {
    this.currentIndex2 = index;
    this.products = this.products!
        .filter(prod => 
          prod.brand?._id === brand.id
      );
  }

  clearFilter(): void{
    this.products = this.globals.product_global;
    this.currentIndex1 = -1;
    this.currentIndex2 = -1;
  }

  toggleCalc(): void {
    this.isCalc = !this.isCalc;
    this.populateDisc();
    //this.calculateTotal();
  }

  press(key: string) {
    if(this.disc == '0'){
      this.disc = ''
    }
    if(key == 'C'){ 
      this.disc = '0';
      key = '';
      this.calculateTotal();
    }
    this.disc += key;
    if(Number(this.disc)>100) this.disc = '100';
  }

  populateDisc() {
    for(let h=0; h<this.orders.length; h++){
      this.orders[h].discount = Number(this.disc)/100 * Number(this.orders[h].qty_rec) * Number(this.orders[h].price_unit)
      if(this.orders[h].include){
        this.orders[h].subtotal = (this.orders[h].qty_rec * this.orders[h].price_unit) - 
          this.orders[h].discount - this.orders[h].discadd;
      }else{
        this.orders[h].subtotal = Number(this.orders[h].qty_rec) * 
          (Number(this.orders[h].price_unit) - (Number(this.disc)/100 * Number(this.orders[h].price_unit)) - Number(this.orders[h].discadd) + 
            (Number(this.orders[h].tax)/100 * 
              (Number(this.orders[h].price_unit) - (Number(this.disc)/100 * Number(this.orders[h].price_unit)) - Number(this.orders[h].discadd)
            )
          ));
      }
    }
    this.calculateTotal();
  }

  /*onDiscChange(val: string) {
    this.discType = val;
    if (this.discType == 'percent'){
      this.isPercent = true;
      this.disc = '0';
      this.calculateTotal();
    }else{
      this.isPercent = false;
      this.disc = '0';
      this.calculateTotal();
    }
  }*/
 
  calculateTotal() {
    this.subtotal = 0; this.discadd = 0; this.untaxed = 0; this.tax = 0; this.total = 0;
    for(let g=0; g<this.orders.length; g++){
      this.subtotal = this.subtotal + (this.orders[g].qty_rec * this.orders[g].price_unit);
      this.discadd = this.discadd + Number(this.orders[g].discadd);
      if(this.orders[g].include){
        this.untaxed = this.untaxed + (Number(this.orders[g].subtotal) / 
                        (1 + (Number(this.orders[g].tax)/100)));
        this.tax = this.tax + (Number(this.orders[g].subtotal) - 
                        (Number(this.orders[g].subtotal) / 
                        (1 + (Number(this.orders[g].tax)/100))));
        this.total = this.untaxed + this.tax;
      }else{
        this.untaxed = this.untaxed + (
                        (Number(this.orders[g].qty_rec) * Number(this.orders[g].price_unit)) - 
                        ((Number(this.disc) / 100) * (Number(this.orders[g].qty_rec) * Number(this.orders[g].price_unit)) ) - 
                        Number(this.orders[g].discadd));
        this.tax = this.tax + (this.orders[g].tax / 100 * 
                        ((Number(this.orders[g].qty_rec) * Number(this.orders[g].price_unit)) -
                        ((Number(this.disc) / 100) * (Number(this.orders[g].qty_rec) * Number(this.orders[g].price_unit))) -
                        Number(this.orders[g].discadd)));
        this.total = this.untaxed + this.tax;
      }
    }
  }

  posDetailAdd(index: number): void {
    let qtyold = this.orders[index].qty_rec;
    this.orders[index].qty_rec = qtyold + 1;
    this.orders[index].discount = Number(this.disc)/100 * Number(this.orders[index].qty_rec) * Number(this.orders[index].price_unit)
    if(this.orders[index].include){
      this.orders[index].subtotal = (this.orders[index].qty_rec * this.orders[index].price_unit) - 
        this.orders[index].discount - this.orders[index].discadd;
    }else{
      this.orders[index].subtotal = 
      (Number(this.orders[index].qty_rec) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount) - Number(this.orders[index].discadd)
        + (Number(this.orders[index].tax)/100 * ((Number(this.orders[index].qty_rec) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount)
          - Number(this.orders[index].discadd)));
    }
    this.calculateTotal();
  }

  posDetailMin(index: number): void {
    //this.currentIndex3 = index;
    let qtyold = this.orders[index].qty_rec;
    this.orders[index].qty_rec = qtyold - 1;
    this.orders[index].discount = Number(this.disc)/100 * Number(this.orders[index].qty_rec) * Number(this.orders[index].price_unit)
    if(this.orders[index].include){
      this.orders[index].subtotal = (this.orders[index].qty_rec * this.orders[index].price_unit) - 
        this.orders[index].discount - this.orders[index].discadd;
    }else{
      this.orders[index].subtotal = 
      (Number(this.orders[index].qty_rec) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount) - Number(this.orders[index].discadd)
        + (Number(this.orders[index].tax)/100 * ((Number(this.orders[index].qty_rec) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount)
          - Number(this.orders[index].discadd)));
    }
    if(qtyold==1) this.orders.splice(index, 1);
    this.calculateTotal();
  }

  openPosDetail(index: number) {
    const dialog = this.dialog.open(PosdetailDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: {
        product: this.orders[index].product,
        qty_rec: this.orders[index].qty_rec,
        price_unit: this.orders[index].price_unit,
        discadd: this.orders[index].discadd,
        index: index
      }
    })
      .afterClosed()
      .subscribe(res => {
        this.orders[res.index].qty_rec = Number(res.qty_rec);
        this.orders[res.index].price_unit = Number(res.price_unit);
        this.orders[res.index].discadd = Number(res.discadd);
        this.orders[res.index].discount = Number(this.disc)/100 * Number(this.orders[res.index].qty) * Number(this.orders[res.index].price_unit)
        if(this.orders[res.index].include){
          this.orders[res.index].subtotal = (this.orders[res.index].qty * this.orders[res.index].price_unit) - 
            this.orders[res.index].discount - this.orders[res.index].discadd;
        }else{
          this.orders[res.index].subtotal = 
          (Number(this.orders[res.index].qty_rec) * Number(this.orders[res.index].price_unit)) - Number(this.orders[res.index].discount) - Number(this.orders[res.index].discadd)
            + (Number(this.orders[res.index].tax)/100 * 
              ((Number(this.orders[res.index].qty_rec) * Number(this.orders[res.index].price_unit)) - Number(this.orders[res.index].discount) - Number(this.orders[res.index].discadd)));
        }
        if(this.orders[res.index].qty_rec == '0' || !this.orders[res.index].qty_rec){
          this.orders.splice(res.index, 1);}
        this.calculateTotal();
      });
  }

  adding(product: Product): void {
    if(this.globals.cost_general){
      let avail = false;
      let taxes = 0;
      let include = false;
      if(product.taxouts) {taxes = product.taxouts.tax; include = product.taxouts.include;}
      for (let x=0; x < this.orders.length; x++){
        if(product.id == this.orders[x].product){
          avail = true;
          let qtyold = this.orders[x].qty_rec;
          let oI = this.orders.findIndex((obj => obj.product == product.id));
          this.orders[oI].qty_rec = qtyold + 1;
          this.orders[oI].discount = Number(this.disc)/100 * (Number(this.orders[oI].qty_rec) * (Number(this.orders[oI].price_unit)))
          if(this.orders[oI].include){
            this.orders[oI].subtotal = (this.orders[oI].qty_rec * this.orders[oI].price_unit) -
              this.orders[oI].discount - this.orders[oI].discadd;
          }else{
            this.orders[oI].subtotal = this.orders[oI].qty_rec * (
              (this.orders[oI].price_unit - (Number(this.disc)/100 * this.orders[oI].price_unit) - Number(this.orders[oI].discadd)) + 
              this.orders[oI].tax/100 * (this.orders[oI].price_unit - (Number(this.disc)/100 * this.orders[oI].price_unit)
                - Number(this.orders[oI].discadd)));
          }
          this.calculateTotal();
        }
      }
      
      if (!avail){
        const data = {
          order_id: this.posid,
          qty_rec: 1,
          price_unit: product.listprice,
          discount: Number(this.disc)/100 * product!.listprice!,
          discadd: 0,
          subtotal: include
            ? product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))
            : product!.listprice! - (Number(this.disc)/100 * (product!.listprice!)) + taxes/100 * (product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))),
          product_data: product,
          product: product.id,
          product_name: product.name,
          suom: product.uoms.uom_name,
          uom_id: product.uom_id,
          bund: product.bund,
          tax: taxes,
          include: include,
          taxes: include 
            ? (product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))) - ((product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))) / (1+(taxes/100)))
            : taxes/100 * (product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))),
          isStock: product.isStock,
          user: this.globals.userid,
          company_id: JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8))
        };
        this.orders.push(data);
        this.calculateTotal();
      }
    }else{
      this.qopss = [{partner:''}];
      this.qopService.getProd(product.id, this.warehouseid)
        .subscribe({
          next: (qop) => {
            if(this.qopss[0].partner=='') this.qopss.splice(0,1);
            for(let x=0;x<qop.length;x++){
              if(!qop[x].partner){
                this.qopss.push({id:qop[x].id,partner:'No Supplier',
                qop:qop[x].qop,product:qop[x].product,part_id:''});
              }else{
                this.qopss.push({id:qop[x].id,partner:qop[x].partner.name,
                qop:qop[x].qop,product:qop[x].product,part_id:qop[x].partner._id});
              }
            }
            this.isqop = true;
          },error: (e) => console.error(e)
        })
    }
  }    

  insertQop(qops: any, index: number){
    this.productService.get(qops.product)
      .subscribe({
        next: (pro) => {
          let avail = false;
          let taxes = 0;
          let include = false;
          if(pro.taxout) taxes = pro.taxout.tax; include = pro.taxout.include;
          for (let x=0; x < this.orders.length; x++){
            if(qops.id == this.orders[x].qop){
              avail = true;
              let qtyold = this.orders[x].qty;
              let oI = this.orders.findIndex(obj => obj.qop == qops.id);
              this.orders[oI].qty = qtyold + 1;
              this.orders[oI].discount = Number(this.disc)/100 * (Number(this.orders[oI].qty) * (Number(this.orders[oI].price_unit)))
              if(include){
                this.orders[oI].subtotal = this.orders[oI].qty * this.orders[oI].price_unit -
                  this.orders[oI].discount - this.orders[oI].discadd;
              }else{
                this.orders[oI].subtotal = this.orders[oI].qty * (
                (this.orders[oI].price_unit - Number(this.disc)/100 * this.orders[oI].price_unit) + 
                this.orders[oI].tax/100 * (this.orders[oI].price_unit - Number(this.disc)/100 * this.orders[oI].price_unit));
              }
              this.qopss = [{partner:''}];
              this.isqop = false;
              this.calculateTotal();
            }
          }
          if(!avail){
            if(include){
              const data = {
                order_id: this.posid,
                qty: 1,
                price_unit: pro.listprice,
                discount: Number(this.disc)/100 * pro!.listprice!,
                discadd: 0,
                subtotal: pro!.listprice! - 
                  (Number(this.disc)/100 * (pro!.listprice!)),
                product_data: pro,
                product: pro.id,
                product_name: pro.name,
                suom: pro.suom.uom_name,
                uom: pro.suom._id,
                bund: pro.bund,
                partner: qops.part_id,
                qop: qops.id,
                tax: taxes,
                include: include,
                taxes: (pro!.listprice! - (Number(this.disc)/100 * (pro!.listprice!))) / (1+(taxes/100)),
                isStock: pro.isStock,
                user: this.globals.userid
              };
              this.orders.push(data);
              this.qopss = [{partner:''}];
              this.isqop = false;
            }else{
              const data = {
                order_id: this.posid,
                qty: 1,
                price_unit: pro.listprice,
                discount: Number(this.disc)/100 * pro!.listprice!,
                discadd: 0,
                subtotal: pro!.listprice! - 
                  (Number(this.disc)/100 * (pro!.listprice!)) +
                  taxes/100 * (pro!.listprice! - (Number(this.disc)/100 * (pro!.listprice!))),
                product_data: pro,
                product: pro.id,
                product_name: pro.name,
                suom: pro.suom.uom_name,
                uom: pro.suom._id,
                bund: pro.bund,
                partner: qops.part_id,
                qop: qops.id,
                tax: taxes,
                include: include,
                taxes: taxes/100 * (pro!.listprice! - (Number(this.disc)/100 * (pro!.listprice!))),
                isStock: pro.isStock,
                user: this.globals.userid
              };
              this.orders.push(data);
              this.qopss = [{partner:''}];
              this.isqop = false;
            }
            this.calculateTotal();
          }
        },error:(e) => console.error(e)
      })
  }

  startPay(): void{
    if(this.orders.length>0){
      this.idService.getPOSId()
        .subscribe({
          next: (ids) => {
            this.posid = ids.message;
            this.openPayment();
          }
        })
    }else{
      this._snackBar.open("Order Kosong", "Tutup", {duration: 5000});
    }
  }

  openPayment() {
    const dialog = this.dialog.open(PaymentDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: {
        order_id: this.posid,
        subtotal: this.subtotal,
        discount: this.discount,
        total: this.total,
        typePay: "in",
      }
    })
      .afterClosed()
      .subscribe(res => {
        //this.openPrint(res);
        this.paying(res);
      });
  }

  openPrint(orderid: string) {
    const dialog = this.dialog.open(PrintposDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: {
        orders: this.orders,
        posid: this.posid,
        subtotal: this.subtotal,
        untaxed: this.untaxed,
        tax: this.tax,
        discount: this.disc,
        total: this.total
      }
    })
      .afterClosed()
      .subscribe(res => {
        //this.rollingDetail(orderid);
      });
  }

  paying(res: any): void {
    //console.log(filtered![0].receivables);
    this.today = new Date();
    if(Number(res.payment1)==0) res.pay1Type = null;
    if(Number(res.payment2)==0) res.pay2Type = null;
    if(!this.globals.pos_session_id || this.globals.pos_session_id == null
      || this.globals.pos_session_id==''){ this.sess_id = "null" }
      else{ this.sess_id = this.globals.pos_session_id};
    this.idService.getPaymentId()
      .subscribe(idp => {
        this.payid = idp.message;
        const payments = {pay_id: this.payid,session: this.sess_id,order_id: this.posid,
          amount_total: this.total, payment: res.payment, pay_method: res.pay_type,
          change: res.change, changeMethod: "tunai", date: this.today, type: "in", pos: true, 
          cross: this.selectedPartner ? this.partners?.filter(part => part.id === Number(this.selectedPartner))[0].receivables : 
            this.stores?.filter(stor => stor.id === this.selectedStore)[0].receivables,
          company: JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8))
        };
        this.paymentService.create(payments)
          .subscribe(res => {
            if(res.message === "done") this.createPOS();
          })
      })
  }

  createPOS(): void {
    if(!this.globals.pos_session_id || this.globals.pos_session_id == null
      || this.globals.pos_session_id==''){ this.sess_id = "null" }
      else{ this.sess_id = this.globals.pos_session_id}
    const posdata = {
      order_id: this.posid,
      date: this.today,
      disc_type: this.discType,
      discount: this.disc,
      amount_untaxed: this.untaxed,
      amount_tax: this.tax,
      amount_subtotal: this.subtotal,
      amount_total: this.total,
      partner: this.selectedPartner,
      user: this.globals.userid,
      open: true,
      store: this.selectedStore,
      warehouse: this.warehouseid,
      company: JSON.parse((CryptoJS.AES.decrypt(localStorage.getItem("comp")!, BaseURL.API_KEY)).toString(CryptoJS.enc.Utf8)),
      cross: this.selectedPartner 
        ? this.partners?.filter(part => part.id === Number(this.selectedPartner))[0].receivables
        : this.stores?.filter(stor => stor.id === Number(this.selectedStore))[0].receivables,
      data: this.orders,
      //payment: payment,
      //session: this.sess_id
    };
    this.posService.create(posdata)
      .subscribe({
        next: (res) => {
          if(res.message == 'done'){
            this.orders = [];
            this.total = 0;
            this.subtotal = 0;
            this.disc = "0";
            this.discount = 0;
            this.tax = 0;
          }else{
            this._snackBar.open("Failed to save", "Tutup", {duration: 5000});
          }
        },error: (e) => console.error(e)
      });
    
  }
}
