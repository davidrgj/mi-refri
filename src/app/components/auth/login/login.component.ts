import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';
import { UserCredential } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private router: Router
  ) {
    localStorage.setItem('isAuth', 'false');
  }

  ngOnInit() { }

  start = () => (this.router.navigateByUrl('/pages/offerts'));

  authWithGoogleAccount() {
    this._authService.authWithGoogleAccount().then(response => {
      console.log("A");
      console.log(response);
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
