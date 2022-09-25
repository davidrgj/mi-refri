import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Firebase auth services
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private router: Router
  ) { }

  authWithGoogleAccount() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  authWithFacebookAccount() {
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  }

  logout() {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    localStorage.removeItem('login');
    this.auth.signOut();
    // window.location.reload();
    // this.router.navigateByUrl('/pages/home');
  }
}
