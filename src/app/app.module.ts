import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPrintModule } from 'ngx-print';
import { ColorPickerModule } from 'ngx-color-picker';
import { QRCodeModule } from 'angular2-qrcode';

import { LayoutModule } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';

import { TableModule } from 'ngx-easy-table';
import { NgxFileDragDropModule } from 'ngx-file-drag-drop';
import { WebdatarocksPivotModule } from 'ng-webdatarocks';
import { authInterceptorProviders } from './_helpers/auth.interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/main/home/home.component';

//User Auth
import { LoginComponent } from './components/user_auth/login/login.component';
import { RegisterComponent } from './components/user_auth/register/register.component';

//Settings
import { CompanyComponent } from './components/settings/company/company.component';
import { ProfileComponent } from './components/settings/profile/profile.component';
import { SettingComponent } from './components/settings/setting/setting.component';

//Masterdata
import { BomComponent } from './components/main/masterdata/bom/bom.component';
import { BrandComponent } from './components/main/masterdata/brand/brand.component';
import { PartnerComponent } from './components/main/masterdata/partner/partner.component';
import { ProductComponent } from './components/main/masterdata/product/product.component';
import { ProductCatComponent } from './components/main/masterdata/product-cat/product-cat.component';
import { UomComponent } from './components/main/masterdata/uom/uom.component';
import { WarehouseComponent } from './components/main/masterdata/warehouse/warehouse.component';


//Dialog
//Masterdata
import { BrandDialogComponent } from './components/main/dialog/masterdata/brand-dialog.component';
import { PartnerDialogComponent } from './components/main/dialog/masterdata/partner-dialog.component';
import { ProductDialogComponent } from './components/main/dialog/masterdata/product-dialog.component';
import { ProductcatDialogComponent } from './components/main/dialog/masterdata/productcat-dialog.component';
import { WarehouseDialogComponent } from './components/main/dialog/masterdata/warehouse-dialog.component';

//Transaction
import { SMDetailDialogComponent } from './components/main/dialog/stockmove/sm-detail-dialog.component';
import { SmpartDialogComponent } from './components/main/dialog/stockmove/smpart-dialog.component';
import { StockMoveDialogComponent } from './components/main/dialog/stockmove/stockmove-dialog.component';

//Purchase
import { PurchaseDialogComponent } from './components/main/dialog/purchase/purchase-dialog.component';

//Accounting - Bill
import { BillcreateDialogComponent } from './components/main/dialog/accounting/bill/billcreate-dialog.component';



import { PosComponent } from './components/main/pos/pos.component';
import { PosSessionComponent } from './components/main/pos-session/pos-session.component';

import { PurchaseComponent } from './components/main/transaction/purchase/purchase.component';
import { StockmoveComponent } from './components/main/transaction/stockmove/stockmove.component';
import { JournalComponent } from './components/main/accounting/journal/journal.component';

import { PayableComponent } from './components/main/accounting/payable/payable.component';
import { SaleComponent } from './components/main/sale/sale.component';
import { ReceivableComponent } from './components/main/accounting/receivable/receivable.component';
import { HelpdeskComponent } from './components/main/helpdesk/helpdesk.component';
import { PosReportComponent } from './components/main/report/pos-report/pos-report.component';

import { PosdetailDialogComponent } from './components/main/dialog/posdetail-dialog.component';
import { PaymentDialogComponent } from './components/main/dialog/payment-dialog.component';
import { UploadDialogComponent } from './components/main/dialog/upload-dialog.component';
import { SaleDialogComponent } from './components/main/dialog/sale-dialog.component';
import { PrintposDialogComponent } from './components/main/dialog/printpos-dialog.component';
import { EntryDialogComponent } from './components/main/dialog/entry-dialog.component';
import { UserroleDialogComponent } from './components/main/dialog/userrole-dialog.component';
import { TaxDialogComponent } from './components/main/dialog/tax-dialog.component';
import { StoreDialogComponent } from './components/main/dialog/store-dialog.component';
import { BomDialogComponent } from './components/main/dialog/bom-dialog.component';
import { BillDialogComponent } from './components/main/dialog/bill-dialog.component';
import { InvoicecreateDialogComponent } from './components/main/dialog/invoicecreate-dialog.component';
import { InvoiceDialogComponent } from './components/main/dialog/invoice-dialog.component';
import { TicketDialogComponent } from './components/main/dialog/ticket-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,

    //User Auth
    LoginComponent,
    RegisterComponent,

    //Settings
    CompanyComponent,
    ProfileComponent,
    SettingComponent,

    //Masterdata
    BomComponent,  
    BrandComponent,
    PartnerComponent,
    ProductComponent,
    ProductCatComponent,
    UomComponent,
    WarehouseComponent,

    //Dialog
    //Masterdata
    BrandDialogComponent,
    PartnerDialogComponent,
    ProductDialogComponent,
    ProductcatDialogComponent,

    //Stockmove
    SMDetailDialogComponent,
    SmpartDialogComponent,
    StockMoveDialogComponent,

    //Purchase
    PurchaseDialogComponent,

    //Accounting - Bill
    BillcreateDialogComponent,



    PosComponent,
    PosSessionComponent,
    PurchaseComponent,
    StockmoveComponent,
    JournalComponent,
    
    PayableComponent,
    SaleComponent,
    ReceivableComponent,
    HelpdeskComponent,
    PosReportComponent,
    WarehouseDialogComponent,
    PosdetailDialogComponent,
    PaymentDialogComponent,
    UploadDialogComponent,
    SaleDialogComponent,
    PrintposDialogComponent,
    EntryDialogComponent,
    UserroleDialogComponent,
    TaxDialogComponent,
    StoreDialogComponent,
    BomDialogComponent,
    BillDialogComponent,
    InvoicecreateDialogComponent,
    InvoiceDialogComponent,
    TicketDialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule,
    Ng2SearchPipeModule,
    NgxPrintModule,
    ColorPickerModule,
    QRCodeModule,

    LayoutModule,
    DragDropModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatProgressBarModule,
    MatTabsModule,

    TableModule,
    NgxFileDragDropModule,
    WebdatarocksPivotModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
