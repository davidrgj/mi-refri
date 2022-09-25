import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { UtilsService } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  admins = [];
  user = (JSON.parse(localStorage.getItem('user')) || null);

  constructor(private _utilsService: UtilsService) {
    this._utilsService.getAdmins().then(admins => this.admins = admins);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.admins.length > 0) {
      let isAdmin = this.admins.map(admin => admin.email).includes(this.user.user.email);
      if (isAdmin) return true;
    }

    return false;
  }
}
