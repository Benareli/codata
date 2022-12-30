import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.sass']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isSuccessful = false  isSignUpFailed = false;
  errorMessage = '';
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.register(username, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.dialogRef.close();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}