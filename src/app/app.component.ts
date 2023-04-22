import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { BaseURL } from 'src/app/baseurl';
import { Globals } from 'src/app/global';
import { Company } from 'src/app/models/settings/company.model';
import { User } from 'src/app/models/user_auth/user.model';

import { TokenStorageService } from 'src/app/services/user_auth/token-storage.service';
import { CompanyService } from 'src/app/services/settings/company.service';
import { User2Service } from 'src/app/services/user_auth/user2.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./style/main.sass']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'Codata';
  baseUrl = BaseURL.BASE_URL;

  layPOS = false;
  maxWidth = false;
  logo?: string;
  comp_name?: string;
  nav_color?: string;
  title_color?: string;

  isIU = false;
  isIM = false;
  isPU = false;
  isPM = false;
  isAU = false;
  isAM = false;
  isAdm = false;
  isPOSU = false;
  isPOSM = false;
  isPurU = false;
  isPurM = false;
  isSalU = false;
  isSalM = false;
  isProdU = false;
  isProdM = false;
  isTickU = false;
  isTickM = false;
  isProjU = false;
  isProjM = false;
  pos_shift?: boolean;

  isProductShow = false;
  isPartnerShow = false;
  isTransacShow = false;
  isPurShow = false;
  isSalShow = false;
  isAccShow = false;
  isProductionShow = false;
  isReportShow = false;
  isTicketShow = false;
  isProjectShow = false;

  rute?: string;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;
  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private globals: Globals,
    private user2Service: User2Service,
    private companyService: CompanyService,
    public breakpointObserver: BreakpointObserver,
    private tokenStorageService: TokenStorageService
  ){ 
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.rute = '';
        if(event.url=="/pos"){
          this.rute = 'POS';
          this.layPOS = true;
          if(this.maxWidth) this.router.navigate(['/']);
        }else if(event.url=="/pos-session"){
          this.rute = this.rute + 'Sesi POS';
          this.layPOS = true;
          this.wiggle();
        }else if(event.url=="/purchase"){
          this.rute = this.rute + 'Pembelian';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/sale"){
          this.rute = this.rute + 'Penjualan';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/stockmove"){
          this.rute = this.rute + 'Pergerakan Barang';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/partner"){
          this.rute = this.rute + 'Pelanggan/Supplier';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/warehouse"){
          this.rute = this.rute + 'Gudang';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/product"){
          this.rute = this.rute + 'Produk';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/productcategory"){
          this.rute = this.rute + 'Kategori Produk';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/uom"){
          this.rute = this.rute + 'Satuan Produk';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/brand"){
          this.rute = this.rute + 'Merek';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/journal"){
          this.rute = this.rute + 'Jurnal';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/payable"){
          this.rute = this.rute + 'Hutang';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/receivable"){
          this.rute = this.rute + 'Piutang';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/bom"){
          this.rute = this.rute + 'Bahan Pembentuk';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/setting"){
          this.rute = this.rute + 'Setting';
          this.layPOS = false;
          this.wiggle();
        }else{
          this.layPOS = false;
          this.wiggle();
        }
      }
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.handleLocalStorage();
    }
    else{
      this.router.navigate(['/login']);
    }
  }

  handleLocalStorage() {
    const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.username = user.username;
      this.globals.username = user.username;
      this.globals.userid = user.id;
      this.globals.roles = user.roles;
      this.companyService.getAll()
        .subscribe(company => {
          if(company && this.globals.companyid != company[0].id) {
            this.globals.pos_shift = company[0].pos_shift;
            this.pos_shift = company[0].pos_shift;
            this.logo = company[0].image;
            this.comp_name = company[0].comp_name;
            this.nav_color = "#" + company[0].nav_color;
            this.title_color = "#" + company[0].title_color;
            localStorage.setItem("comp", company[0].id);
            this.globals.cost_general = company[0].cost_general;
            this.globals.companyid = company[0].id;
          }
          if(this.globals.pos_shift){
            this.user2Service.get(user.id)
              .subscribe(users => {
                this.checkRole();
              })
          }else{ this.checkRole(); }
        });
  }

  checkRole() {
    for(let x=0; x<this.roles!.length;x++){
      if(this.roles![x]=="inventory_user"){ this.isIU=true;}
      if(this.roles![x]=="inventory_manager"){ this.isIM=true;}
      if(this.roles![x]=="partner_user"){ this.isPU=true;}
      if(this.roles![x]=="partner_manager"){ this.isPM=true;}
      if(this.roles![x]=="purchase_user"){ this.isPurU=true;}
      if(this.roles![x]=="purchase_manager"){ this.isPurM=true;}
      if(this.roles![x]=="sale_user"){ this.isSalU=true;}
      if(this.roles![x]=="sale_manager"){ this.isSalM=true;}
      if(this.roles![x]=="pos_user"){ this.isPOSU=true;}
      if(this.roles![x]=="pos_manager"){ this.isPOSM=true;}
      if(this.roles![x]=="acc_user"){ this.isAU=true;}
      if(this.roles![x]=="acc_manager"){ this.isAM=true;}
      if(this.roles![x]=="production_user"){ this.isProdU=true;}
      if(this.roles![x]=="production_manager"){ this.isProdM=true;}
      if(this.roles![x]=="ticket_user"){ this.isTickU=true;}
      if(this.roles![x]=="ticket_manager"){ this.isTickM=true;}
      if(this.roles![x]=="project_user"){ this.isProjU=true;}
      if(this.roles![x]=="project_manager"){ this.isProjM=true;}
      
      if(this.roles![x]=="admin"){ this.isAdm=true;}
    };
  }

  ngAfterViewInit(){
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((res) => {
        if (res.matches) {
          //this.maxWidth = true;
          this.wiggle();
        } else {
          //this.maxWidth = false;
          this.wiggle();
        }
      });
  }

  toggleProduct() {
    this.isProductShow = !this.isProductShow;
  }

  toggleTransac() {
    this.isTransacShow = !this.isTransacShow;
  }

  togglePur() {
    this.isPurShow = !this.isPurShow;
  }

  toggleSal() {
    this.isSalShow = !this.isSalShow;
  }

  toggleAcc() {
    this.isAccShow = !this.isAccShow;
  }

  toggleProduction() {
    this.isProductionShow = !this.isProductionShow;
  }

  toggleReport() {
    this.isReportShow = !this.isReportShow;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  wiggle() {
    this.sidenav.mode = 'over';
    this.sidenav.close();
    /*if(this.layPOS && this.maxWidth){
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }else if(!this.layPOS && this.maxWidth){
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }else if(this.layPOS && !this.maxWidth){
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }else if (!this.layPOS && !this.maxWidth){
      //This should be 'side' and open
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }*/
  }
}
