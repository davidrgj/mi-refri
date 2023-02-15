import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    localStorage.setItem('isAuth', 'false');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern('([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@gmail([\.])com')]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    });
   }

  start = () => (this.router.navigateByUrl('/pages/offerts'));

  login(){
    // const data = this.loginForm.getRawValue();
    // this._authService.authWithAccountPassword(data).then((data) =>{
    //   console.log(data)
    // })
  }

  authWithGoogleAccount() {
    this._authService.authWithGoogleAccount().then(response => {
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('login', 'google');
      this.router.navigateByUrl('/pages/home');
    });

  }

  /* authWithFacebookAccount() {
    this._authService.authWithFacebookAccount().then((value: UserCredential) => {
      localStorage.setItem('user', JSON.stringify(value));
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('login', 'facebook');
      this.router.navigateByUrl('/pages/home');
    })
  } */
}
