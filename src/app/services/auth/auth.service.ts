import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';

// Firebase auth services

// import { Auth, getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, indexedDBLocalPersistence } from '@angular/fire/auth';


// import { getAuth, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider } from "firebase/auth/cordova";
import { getAuth, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider } from "firebase/auth";

// import { getAuth, signOut, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth/cordova";
const provider = new GoogleAuthProvider();

// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Capacitor } from '@capacitor/core';
// import { getApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    // private auth: Auth,
    // public _ngFireAuth: AngularFireAuth,
    // private router: Router
  ) { }

  authWithGoogleAccount() {
    /* var auth = getAuth();
    if (Capacitor.isNativePlatform()) {
      auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence
      });
    } else {
      auth = getAuth();
    }
    signInWithRedirect(auth, new GoogleAuthProvider())
      .then(() => getRedirectResult(auth)).then((result) => {
        console.log(result.user);
        localStorage.setItem('USER', JSON.stringify(result.user));
      }); */

    // return this._ngFireAuth.signInWithRedirect(new GoogleAuthProvider()).then(() => {
    //   this._ngFireAuth.getRedirectResult()     
    // });

    const auth = getAuth();
    return signInWithRedirect(auth, new GoogleAuthProvider()).then(() => getRedirectResult(auth));
  }

  /* authWithFacebookAccount() {
    return signInWithPopup(this.auth, new FacebookAuthProvider());
  } */

  logout() {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('user');
    localStorage.removeItem('login');

    const auth = getAuth();
    signOut(auth);


    // this.auth.signOut();
    // window.location.reload();
    // this.router.navigateByUrl('/pages/home');
  }
}
