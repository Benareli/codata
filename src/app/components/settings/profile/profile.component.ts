import { Component, OnInit } from '@angular/core';

import { Globals } from 'src/app/global';
import { Role } from 'src/app/models/user_auth/role.model';

import { TokenStorageService } from 'src/app/services/user_auth/token-storage.service';
import { RoleService } from 'src/app/services/user_auth/role.service';
import { User2Service } from 'src/app/services/user_auth/user2.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../../style/main.sass']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  roles?: Role[];
  isInvenDisabled = false;
  isPartnerDisabled = false;
  isAccDisabled = false;
  isPurDisabled = false;
  isPOSDisabled = false;
  isIManager = false;
  isPManager = false;
  isAManager = false;
  isPURManager = false;
  isPOSManager = false;
  isIUser = false;
  isPUser = false;
  isAUser = false;
  isPURUser = false;
  isPOSUser = false;
  isAdmin = false;
  listRoles: any = [];

  constructor(
    private globals: Globals,
    private token: TokenStorageService,
    private roleService: RoleService,
    private user2Service: User2Service,
    private tokenStorageService: TokenStorageService
  ){
    this.retrieveRole();
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onAdmin(enable: boolean) {if(enable){this.isAdmin=true;}else{this.isAdmin=false;}}

  onInven(enable: boolean) {if(enable){this.isInvenDisabled=false;}else{this.isInvenDisabled=true;}}
  onIManager(enable: boolean) {if(enable){this.isIManager=true;}else{this.isIManager=false;}}

  onPartner(enable: boolean) {if(enable){this.isPartnerDisabled=false;}else{this.isPartnerDisabled = true;}}
  onPManager(enable: boolean) {if(enable){this.isPManager=true;}else{this.isPManager=false;}}

  onPur(enable: boolean) {if(enable){this.isPurDisabled=false;}else{this.isPurDisabled=true;}}
  onPurManager(enable: boolean) {if(enable){this.isPURManager=true;}else{this.isPURManager=false;}}

  onPOS(enable: boolean) {if(enable){this.isPOSDisabled=false;}else{this.isPOSDisabled=true;}}
  onPOSManager(enable: boolean) {if(enable){this.isPOSManager=true;}else{this.isPOSManager=false;}}

  onAcc(enable: boolean) {if(enable){this.isAccDisabled=false;}else{this.isAccDisabled=true;}}
  onAManager(enable: boolean) {if(enable){this.isAManager=true;}else{this.isAManager=false;}}

  retrieveRole(): void {
    this.user2Service.get(this.globals.userid)
      .subscribe(user => {
        this.checkSlider(user);
    });

    this.roleService.getAll()
      .subscribe(role => {
        this.roles = role;
      })
  }

  checkSlider(user: any): void {
    for(let x=0; x < user.roles.length; x++){
      if(user.roles[x].name == "admin") this.isAdmin=true;
      if(user.roles[x].name == "inventory_user") {this.isIUser=true;this.isInvenDisabled=false;}
      if(user.roles[x].name == "inventory_manager") this.isIManager=true;
      if(user.roles[x].name == "partner_user") {this.isPUser=true;this.isPartnerDisabled=false;}
      if(user.roles[x].name == "partner_manager") this.isPManager=true;
      if(user.roles[x].name == "purchase_user") {this.isPURUser=true;this.isPurDisabled=false;}
      if(user.roles[x].name == "purchase_manager") this.isPURManager=true;
      if(user.roles[x].name == "pos_user") {this.isPOSUser=true;this.isPOSDisabled=false;}
      if(user.roles[x].name == "pos_manager") this.isPOSManager=true;
      if(user.roles[x].name == "acc_user") {this.isAUser=true;this.isAccDisabled=false;}
      if(user.roles[x].name == "acc_manager") this.isAManager=true;
    }
  }
  

  test(): void {
    this.listRoles = [];
        //console.log(this.roles?.filter(role => role.name === "inventory_manager").map(role => role._id));
    if(this.isAdmin){
      this.listRoles.push(this.roles?.filter(role => role.name === "admin").map(role => role._id));
    }
    if(!this.isInvenDisabled){
      if(this.isIManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "inventory_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "inventory_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "inventory_user").map(role => role._id));
    }
    if(!this.isPartnerDisabled){
      if(this.isPManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "partner_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "partner_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "partner_user").map(role => role._id));
    }
    if(!this.isPurDisabled){
      if(this.isPURManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "purchase_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "purchase_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "purchase_user").map(role => role._id));
    }
    if(!this.isPOSDisabled){
      if(this.isPOSManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "pos_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "pos_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "pos_user").map(role => role._id));
    }
    if(!this.isAccDisabled){
      if(this.isAManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "acc_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "acc_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "acc_user").map(role => role._id));
    }
    const dataRole = {
      roles: this.listRoles,
    };
    this.user2Service.update(this.globals.userid, dataRole)
      .subscribe({
        next: (res) => {
          this.tokenStorageService.signOut();
          window.location.reload();
        },
        error: (e) => console.error(e)
      });

  }
}