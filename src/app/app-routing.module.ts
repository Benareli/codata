import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/user_auth/login/login.component';
import { RegisterComponent } from './components/user_auth/register/register.component';
import { HomeComponent } from './components/main/home/home.component';
import { ProfileComponent } from './components/settings/profile/profile.component';
import { SettingComponent } from './components/settings/setting/setting.component';
import { ProductCatComponent } from './components/main/masterdata/product-cat/product-cat.component';
import { BrandComponent } from './components/main/masterdata/brand/brand.component';
import { ProductComponent } from './components/main/masterdata/product/product.component';
import { UomComponent } from './components/main/masterdata/uom/uom.component';
import { WarehouseComponent } from './components/main/masterdata/warehouse/warehouse.component';
import { StockmoveComponent } from './components/main/transaction/stockmove/stockmove.component';
import { PartnerComponent } from './components/main/masterdata/partner/partner.component';
import { PurchaseComponent } from './components/main/transaction/purchase/purchase.component';
import { SaleComponent } from './components/main/sale/sale.component';
import { PosComponent } from './components/main/pos/pos.component';
import { PosSessionComponent } from './components/main/pos-session/pos-session.component';
import { JournalComponent } from './components/main/accounting/journal/journal.component';
import { BomComponent } from './components/main/masterdata/bom/bom.component';
import { PayableComponent } from './components/main/accounting/payable/payable.component';
import { ReceivableComponent } from './components/main/accounting/receivable/receivable.component';
import { HelpdeskComponent } from './components/main/helpdesk/helpdesk.component';

import { PosReportComponent } from './components/main/report/pos-report/pos-report.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'productcategory', component: ProductCatComponent },
  { path: 'brand', component: BrandComponent },
  { path: 'product', component: ProductComponent },
  { path: 'uom', component: UomComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'stockmove', component: StockmoveComponent },
  { path: 'partner', component: PartnerComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'sale', component: SaleComponent },
  { path: 'pos', component: PosComponent },
  { path: 'pos-session', component: PosSessionComponent },
  { path: 'journal', component: JournalComponent },
  { path: 'bom', component: BomComponent },
  { path: 'payable', component: PayableComponent },
  { path: 'receivable', component: ReceivableComponent },
  { path: 'helpdesk', component: HelpdeskComponent },
  { path: 'report-pos', component: PosReportComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
