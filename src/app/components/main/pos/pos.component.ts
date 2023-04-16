import { Component, AfterContentInit, EventEmitter, 
  ViewChild, Output, OnInit, HostListener } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatGridList } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPrintModule } from 'ngx-print';

import { PosdetailDialogComponent } from '../dialog/posdetail-dialog.component';
import { PaymentDialogComponent } from '../dialog/accounting/payment/payment-dialog.component';
import { PrintposDialogComponent } from '../dialog/printpos-dialog.component';

import { Id } from 'src/app/models/settings/id.model';
import { IdService } from 'src/app/services/settings/id.service';
import { Product } from 'src/app/models/masterdata/product.model';
import { ProductService } from 'src/app/services/masterdata/product.service';
import { Productcat } from 'src/app/models/masterdata/productcat.model';
import { ProductCatService } from 'src/app/services/masterdata/product-cat.service';
import { Brand } from 'src/app/models/masterdata/brand.model';
import { BrandService } from 'src/app/services/masterdata/brand.service';
import { Partner } from 'src/app/models/masterdata/partner.model';
import { PartnerService } from 'src/app/services/masterdata/partner.service';
import { Warehouse } from 'src/app/models/masterdata/warehouse.model';
import { WarehouseService } from 'src/app/services/masterdata/warehouse.service';
import { Qop } from 'src/app/models/transaction/qop.model';
import { QopService } from 'src/app/services/transaction/qop.service';
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
import { BaseURL } from 'src/app/baseurl';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.sass']
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
  cols: number;
  rowHeight: string;

  loaded: boolean = false;

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

  term: string;
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
    this.loaded = true;
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

    this.storeService.findAllActive()
      .subscribe(store => {
        this.stores = store;
        this.selectedStore = store[0].id;
        this.storeService.get(store[0].id)
          .subscribe(sw => {
            this.warehouseid=sw.warehouse._id;
          })
    });

    this.partnerService.findAllActiveCustomer()
      .subscribe(partn => {
        this.partners = partn;
    });
    
    if(this.globals.cost_general){
      this.productService.findAllActive(this.globals.companyid)
        .subscribe(prod => {
          this.products = prod;
          this.oriprods = this.products;
          this.loaded = false;
      });
    }else{
      this.productService.findAllReady(this.globals.companyid)
        .subscribe(prod => {
          this.products = prod;
          this.oriprods = this.products;
          this.loaded = false;
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
      this.orders[h].discount = Number(this.disc)/100 * Number(this.orders[h].qty) * Number(this.orders[h].price_unit)
      if(this.orders[h].include){
        this.orders[h].subtotal = (this.orders[h].qty * this.orders[h].price_unit) - 
          this.orders[h].discount - this.orders[h].discadd;
      }else{
        this.orders[h].subtotal = Number(this.orders[h].qty) * 
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
      this.subtotal = this.subtotal + (this.orders[g].qty * this.orders[g].price_unit);
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
                        (Number(this.orders[g].qty) * Number(this.orders[g].price_unit)) - 
                        ((Number(this.disc) / 100) * (Number(this.orders[g].qty) * Number(this.orders[g].price_unit)) ) - 
                        Number(this.orders[g].discadd));
        this.tax = this.tax + (this.orders[g].tax / 100 * 
                        ((Number(this.orders[g].qty) * Number(this.orders[g].price_unit)) -
                        ((Number(this.disc) / 100) * (Number(this.orders[g].qty) * Number(this.orders[g].price_unit))) -
                        Number(this.orders[g].discadd)));
        this.total = this.untaxed + this.tax;
      }
    }
  }

  posDetailAdd(index: number): void {
    let qtyold = this.orders[index].qty;
    this.orders[index].qty = qtyold + 1;
    this.orders[index].discount = Number(this.disc)/100 * Number(this.orders[index].qty) * Number(this.orders[index].price_unit)
    if(this.orders[index].include){
      this.orders[index].subtotal = (this.orders[index].qty * this.orders[index].price_unit) - 
        this.orders[index].discount - this.orders[index].discadd;
    }else{
      this.orders[index].subtotal = 
      (Number(this.orders[index].qty) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount) - Number(this.orders[index].discadd)
        + (Number(this.orders[index].tax)/100 * ((Number(this.orders[index].qty) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount)
          - Number(this.orders[index].discadd)));
    }
    this.calculateTotal();
  }

  posDetailMin(index: number): void {
    //this.currentIndex3 = index;
    let qtyold = this.orders[index].qty;
    this.orders[index].qty = qtyold - 1;
    this.orders[index].discount = Number(this.disc)/100 * Number(this.orders[index].qty) * Number(this.orders[index].price_unit)
    if(this.orders[index].include){
      this.orders[index].subtotal = (this.orders[index].qty * this.orders[index].price_unit) - 
        this.orders[index].discount - this.orders[index].discadd;
    }else{
      this.orders[index].subtotal = 
      (Number(this.orders[index].qty) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount) - Number(this.orders[index].discadd)
        + (Number(this.orders[index].tax)/100 * ((Number(this.orders[index].qty) * Number(this.orders[index].price_unit)) - Number(this.orders[index].discount)
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
        qty: this.orders[index].qty,
        price_unit: this.orders[index].price_unit,
        discadd: this.orders[index].discadd,
        index: index
      }
    })
      .afterClosed()
      .subscribe(res => {
        this.orders[res.index].qty = Number(res.qty);
        this.orders[res.index].price_unit = Number(res.price_unit);
        this.orders[res.index].discadd = Number(res.discadd);
        this.orders[res.index].discount = Number(this.disc)/100 * Number(this.orders[res.index].qty) * Number(this.orders[res.index].price_unit)
        if(this.orders[res.index].include){
          this.orders[res.index].subtotal = (this.orders[res.index].qty * this.orders[res.index].price_unit) - 
            this.orders[res.index].discount - this.orders[res.index].discadd;
        }else{
          this.orders[res.index].subtotal = 
          (Number(this.orders[res.index].qty) * Number(this.orders[res.index].price_unit)) - Number(this.orders[res.index].discount) - Number(this.orders[res.index].discadd)
            + (Number(this.orders[res.index].tax)/100 * 
              ((Number(this.orders[res.index].qty) * Number(this.orders[res.index].price_unit)) - Number(this.orders[res.index].discount) - Number(this.orders[res.index].discadd)));
        }
        if(this.orders[res.index].qty == '0' || !this.orders[res.index].qty){
          this.orders.splice(res.index, 1);}
        this.calculateTotal();
      });
  }

  adding(product: Product): void {
    if(this.globals.cost_general){
      let avail = false;
      let taxes = 0;
      let include = false;
      if(product.taxout) {taxes = product.taxout.tax; include = product.taxout.include;}
      for (let x=0; x < this.orders.length; x++){
        if(product.id == this.orders[x].product){
          avail = true;
          let qtyold = this.orders[x].qty;
          let oI = this.orders.findIndex((obj => obj.product == product.id));
          this.orders[oI].qty = qtyold + 1;
          this.orders[oI].discount = Number(this.disc)/100 * (Number(this.orders[oI].qty) * (Number(this.orders[oI].price_unit)))
          if(this.orders[oI].include){
            this.orders[oI].subtotal = (this.orders[oI].qty * this.orders[oI].price_unit) -
              this.orders[oI].discount - this.orders[oI].discadd;
          }else{
            this.orders[oI].subtotal = this.orders[oI].qty * (
              (this.orders[oI].price_unit - (Number(this.disc)/100 * this.orders[oI].price_unit) - Number(this.orders[oI].discadd)) + 
              this.orders[oI].tax/100 * (this.orders[oI].price_unit - (Number(this.disc)/100 * this.orders[oI].price_unit)
                - Number(this.orders[oI].discadd)));
          }
          this.calculateTotal();
        }
      }
      
      if (!avail){
        if(include){
          const data = {
            order_id: this.posid,
            qty: 1,
            price_unit: product.listprice,
            discount: Number(this.disc)/100 * product!.listprice!,
            discadd: 0,
            subtotal: product!.listprice! - 
              (Number(this.disc)/100 * (product!.listprice!)),
            product: product.id,
            product_name: product.name,
            suom: product.suom.uom_name,
            uom: product.suom._id,
            fg: product.fg,
            tax: taxes,
            include: include,
            taxes: (product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))) / (1+(taxes/100)),
            isStock: product.isStock,
            user: this.globals.userid
          };
          this.orders.push(data);
        }else{
          const data = {
            order_id: this.posid,
            qty: 1,
            price_unit: product.listprice,
            discount: Number(this.disc)/100 * product!.listprice!,
            discadd: 0,
            subtotal: product!.listprice! - 
              (Number(this.disc)/100 * (product!.listprice!)) +
              taxes/100 * (product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))),
            product: product.id,
            product_name: product.name,
            suom: product.uoms.uom_name,
            uom: product.uoms.id,
            fg: product.fg,
            tax: taxes,
            include: include,
            taxes: taxes/100 * (product!.listprice! - (Number(this.disc)/100 * (product!.listprice!))),
            isStock: product.isStock,
            user: this.globals.userid
          };
          this.orders.push(data);
        }
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
                product: pro.id,
                product_name: pro.name,
                suom: pro.suom.uom_name,
                uom: pro.suom._id,
                fg: pro.fg,
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
                product: pro.id,
                product_name: pro.name,
                suom: pro.suom.uom_name,
                uom: pro.suom._id,
                fg: pro.fg,
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
        //console.log (res);

        this.rollingDetail(orderid);
      });
  }

  paying(res: any): void {
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
          amount_total: this.total,payment1: res.payment1,pay1method: res.pay1Type,
          payment2: res.payment2,pay2method: res.pay2Type,change: res.change,changeMethod: "tunai",
          date: this.today, type: "in"
        };
        this.paymentService.create(payments)
          .subscribe(res => {
            this.createPOS(res.id);
          })
      })
  }

  createPOS(payment: any): void {
    if(!this.globals.pos_session_id || this.globals.pos_session_id == null
      || this.globals.pos_session_id==''){ this.sess_id = "null" }
      else{ this.sess_id = this.globals.pos_session_id}
    const posdata = {
      order_id: this.posid,
      store: this.selectedStore,
      partner: this.partnerid ?? "null",
      disc_type: this.discType,
      discount: this.disc,
      amount_untaxed: this.untaxed,
      amount_tax: this.tax,
      amount_subtotal: this.subtotal,
      amount_total: this.total,
      user: this.globals.userid,
      payment: payment,
      date: this.today,
      session: this.sess_id
    };
    this.posService.create(posdata)
      .subscribe({
        next: (res) => {
          this.openPrint(res.id);
          //this.rollingDetail(res.id);
        },error: (e) => console.error(e)
      });
    
  }

  rollingDetail(orderid: string): void {
    if(this.orders.length>0){
      this.createDetail(orderid, this.orders[0].qty, this.orders[0].price_unit, this.orders[0].discount+this.orders[0].discadd, 
        this.orders[0].tax, this.orders[0].subtotal, this.orders[0].product, this.orders[0].partner,
        this.orders[0].isStock.toString(), this.orders[0].qop, this.orders[0].uom,
        this.orders[0].fg, this.orders[0].include);
    }else{
      this.total = 0;
      this.subtotal = 0;
      this.disc = "0";
      this.discount = 0;
      this.tax = 0;
    }
  }

  createDetail(orderid:string, qty:number, price_unit:number, discount:number, tax: number, subtotal:number, 
    product:string, partner:string, isStock:string, qop: string, uom: string, fg: boolean, include: boolean): void {
      const posdetail = {
        ids: orderid,
        order_id: this.posid,
        qty: qty,
        uom: uom,
        fg: fg,
        include: include,
        partner: partner ?? "null",
        price_unit: price_unit,
        discount: discount,
        tax: tax,
        subtotal: subtotal,
        product: product,
        isStock: isStock,
        qop: qop,
        store: this.selectedStore,
        date: this.today,
        warehouse: this.warehouseid,
        user: this.globals.userid,
        meth: this.globals.cost_general
      };
      this.posDetailService.create(posdetail)
        .subscribe({
          next: (res) => {
            //console.log(res);
            this.orders.splice(0, 1);
            this.rollingDetail(orderid);
          },
          error: (e) => console.error(e)
        });
  }

}
