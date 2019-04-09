import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../share/user.service';
import { LoginService } from './login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  warning = '';
  isPending: boolean;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    console.log(this.loginForm);
    this.loginForm.controls.username.markAsTouched();
    this.loginForm.controls.password.markAsTouched();
    if (this.loginForm.valid && !this.isPending) {
      this.isPending = true;
      this.loginService.login(this.loginForm.value).pipe(
        finalize(() => {
          this.isPending = false;
        })
      ).subscribe(
        data => {
          this.warning = '';
          this.userService.currentUser = data;
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.router.navigate(['']);
        },
        (error: HttpErrorResponse) => {
          this.warning = 'Username or password is incorrect.';
        }
      );
    }
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

}
