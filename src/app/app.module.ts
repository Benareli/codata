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

import { AppComponent } from './app.component';
import { LoginComponent } from './landing/login/login.component';
import { HomeComponent } from './main/home/home.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { RegisterComponent } from './landing/register/register.component';
import { ProductCatComponent } from './main/product-cat/product-cat.component';
import { BrandComponent } from './main/brand/brand.component';
import { ProductComponent } from './main/product/product.component';
import { UomComponent } from './main/uom/uom.component';
import { WarehouseComponent } from './main/warehouse/warehouse.component';
import { PartnerComponent } from './main/partner/partner.component';
import { PosComponent } from './main/pos/pos.component';
import { PosSessionComponent } from './main/pos-session/pos-session.component';
import { SettingComponent } from './backend/setting/setting.component';
import { ProfileComponent } from './backend/profile/profile.component';
import { PurchaseComponent } from './main/purchase/purchase.component';
import { StockmoveComponent } from './main/stockmove/stockmove.component';
import { JournalComponent } from './main/journal/journal.component';
import { BomComponent } from './main/bom/bom.component';
import { PayableComponent } from './main/payable/payable.component';
import { SaleComponent } from './main/sale/sale.component';
import { ReceivableComponent } from './main/receivable/receivable.component';

import { HelpdeskComponent } from './main/helpdesk/helpdesk.component';
import { PosReportComponent } from './main/report/pos-report/pos-report.component';

import { BrandDialogComponent } from './main/dialog/brand-dialog.component';
import { ProductDialogComponent } from './main/dialog/product-dialog.component';
import { ProductcatDialogComponent } from './main/dialog/productcat-dialog.component';
import { WarehouseDialogComponent } from './main/dialog/warehouse-dialog.component';
import { PartnerDialogComponent } from './main/dialog/partner-dialog.component';
import { StockMoveDialogComponent } from './main/dialog/stockmove-dialog.component';
import { SMDetailDialogComponent } from './main/dialog/sm-detail-dialog.component';
import { SmpartDialogComponent } from './main/dialog/smpart-dialog.component';
import { PosdetailDialogComponent } from './main/dialog/posdetail-dialog.component';
import { PaymentDialogComponent } from './main/dialog/payment-dialog.component';
import { UploadDialogComponent } from './main/dialog/upload-dialog.component';
import { PurchaseDialogComponent } from './main/dialog/purchase-dialog.component';
import { SaleDialogComponent } from './main/dialog/sale-dialog.component';
import { PrintposDialogComponent } from './main/dialog/printpos-dialog.component';
import { EntryDialogComponent } from './main/dialog/entry-dialog.component';
import { UserroleDialogComponent } from './main/dialog/userrole-dialog.component';
import { TaxDialogComponent } from './main/dialog/tax-dialog.component';
import { StoreDialogComponent } from './main/dialog/store-dialog.component';
import { BomDialogComponent } from './main/dialog/bom-dialog.component';
import { BillcreateDialogComponent } from './main/dialog/billcreate-dialog.component';
import { BillDialogComponent } from './main/dialog/bill-dialog.component';
import { InvoicecreateDialogComponent } from './main/dialog/invoicecreate-dialog.component';
import { InvoiceDialogComponent } from './main/dialog/invoice-dialog.component';
import { TicketDialogComponent } from './main/dialog/ticket-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ProductCatComponent,
    BrandComponent,
    ProductComponent,
    UomComponent,
    WarehouseComponent,
    PartnerComponent,
    PosComponent,
    PosSessionComponent,
    SettingComponent,
    ProfileComponent,
    PurchaseComponent,
    UomComponent,
    StockmoveComponent,
    JournalComponent,
    BomComponent,
    PayableComponent,
    SaleComponent,
    ReceivableComponent,
    
    HelpdeskComponent,
    PosReportComponent,
    
    ProductcatDialogComponent,
    BrandDialogComponent,
    ProductDialogComponent,
    WarehouseDialogComponent,
    PartnerDialogComponent,
    StockMoveDialogComponent,
    SMDetailDialogComponent,
    SmpartDialogComponent,
    PosdetailDialogComponent,
    PaymentDialogComponent,
    UploadDialogComponent,
    PurchaseDialogComponent,
    SaleDialogComponent,
    PrintposDialogComponent,
    EntryDialogComponent,
    UserroleDialogComponent,
    TaxDialogComponent,
    StoreDialogComponent,
    BomDialogComponent,
    BillcreateDialogComponent,
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
