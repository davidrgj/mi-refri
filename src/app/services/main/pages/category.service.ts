import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Category } from 'src/app/interfaces/category.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private _fireDatabase: AngularFireDatabase
  ) { }

  load(offSet: number) {
    return this._fireDatabase.list('category', ref => ref.limitToFirst(offSet));
  }

  create(category: Category) {
    return this.http.post(`${environment.apiURL}/category.json`, category).pipe(map((response: any) => {
      category.id = response.name;
      return category;
    }));
  }

  update(category: Category) {
    return this.http.put(`${environment.apiURL}/category/${category.id}.json`, category);
  }
}
