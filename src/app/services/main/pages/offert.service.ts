import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Offert } from 'src/app/interfaces/offert.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffertService {

  constructor(
    private http: HttpClient,
    private _fireDatabase: AngularFireDatabase
  ) { }

  load(offSet: number) {
    return this._fireDatabase.list('offert', ref => ref.limitToFirst(offSet));
  }

  loadNext(offSet: number, lastKey) {
    return this._fireDatabase.list('offert', ref => ref.orderByKey().startAfter(lastKey.toString()).limitToFirst(offSet));
  }

  getOffert(id: string) {
    return this._fireDatabase.object(`offert/${id}`);
  }

  search(value: string): Promise<any> {
    value = value.charAt(0).toUpperCase() + (value.slice(1)).toLocaleLowerCase();
    return this.http.get(`${environment.apiURL}/offert.json?orderBy="name"&startAt="${value}"&endAt="${value + '\uf8ff'}"`).pipe(map(this.processResponse)).toPromise();
  }

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

  create(offert: Offert) {
    return this.http.post(`${environment.apiURL}/offert.json`, offert).pipe(map((response: any) => {
      offert.id = response.name;
      return offert;
    }));
  }

  update(offert: Offert) {
    return this.http.put(`${environment.apiURL}/offert/${offert.id}.json`, offert);
  }
}
