import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/global';
import { AuthService } from 'src/app/services/auth.service';
import { User2Service } from 'src/app/services/user2.service';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  LogOrReg = true;

  isLoggedIn = false;
  isLoginFailed = false;

  isSuccessful = false;
  isSignUpFailed = false;

  errorMessage = '';
  roles: string[] = [];

  roless?: Role[];
  listRoles: any = [];

  constructor(
    private authService: AuthService,
    private globals: Globals,
    private user2Service: User2Service,
    private roleService: RoleService,
    private tokenStorage: TokenStorageService
  ) { }
  ngOnInit(): void {
    this.user2Service.getAll()
      .subscribe(user2 => {
        if (user2.length == 0){
          this.LogOrReg = false;
        }
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    } 
    this.roleService.getAll()
      .subscribe(role => {
        this.roless = role;
      })
  }

  onSubmit(): void {
    if (this.LogOrReg){
      const { username, password } = this.form;
      this.authService.login(username, password).subscribe({
        next: data => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.reloadPage();
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      });
    }else{
      for(let x=0;x<this.roless!.length;x++){
        this.listRoles.push(this.roless![x]._id);
      }
      const { username, password } = this.form;
      this.authService.register(username, password).subscribe({
        next: data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          const dataRole = {
            roles: this.listRoles
          };
          this.reloadPage()
          /*this.user2Service.update(data._id, dataRole)
            .subscribe({
              next: (res) => {this.reloadPage();
              },error: (e) => console.error(e)
          });*/
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      });
    }
  }
  
  reloadPage(): void {
    window.location.reload();
  }
}
