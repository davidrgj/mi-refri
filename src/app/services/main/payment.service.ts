import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Delivery } from 'src/app/interfaces/delivery.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient,
    private _fireDatabase: AngularFireDatabase
  ) { }

  load = (offSet: number) => this._fireDatabase.list('delivery', ref => ref.limitToFirst(offSet));

  getElements = () => this.http.get(`${environment.apiURL}/delivery.json`).pipe(map(this.processResponse));

  create(delivery: Delivery) {
    return this.http.post(`${environment.apiURL}/delivery.json`, delivery).pipe(map((response: any) => {
      delivery.id = response.name;
      return delivery;
    })).toPromise();
  };

  update = (delivery: Delivery) => this.http.put(`${environment.apiURL}/delivery/${delivery.id}.json`, delivery);

  private processResponse(responseObj: Object) {
    if (responseObj === null) { return []; }

    const elements = [];
    Object.keys(responseObj).forEach(key => {
      const element = responseObj[key];
      element.id = key;

      elements.push(element);
    });

    return elements;
  }
}