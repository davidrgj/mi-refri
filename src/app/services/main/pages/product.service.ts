import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AngularFireDatabase } from '@angular/fire/compat/database';
// import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { Product } from 'src/app/interfaces/product.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private itemsCollection: AngularFirestoreCollection<Product>;
  showLoadProducts: boolean = false;
  products: Product[] = [];
  srcImage: string;

  constructor(
    private http: HttpClient,
    private _fireDatabase: AngularFireDatabase,
    // private _angularFireStore: AngularFirestore,
    private _storage: Storage
  ) { }

  load(offSet: number) {
    return this._fireDatabase.list('product', ref => ref.limitToFirst(offSet));
  }

  loadNext(offSet: number, lastKey) {
    return this._fireDatabase.list('product', ref => ref.orderByKey().startAfter(lastKey.toString()).limitToFirst(offSet));
  }

  getProduct(id: string) {
    return this._fireDatabase.object(`product/${id}`);
    // this._fireDatabase.object(`product/${id}`).valueChanges().pipe(map((product: any) => {
    // console.log(product.payload.val());
    // product.image = this.getImage(product.image).then(src => src ? product.image = src : product.image = null).catch(() => product.image = null);
    // return product;
    // }));
  }

  /* loadCollection() {
    this.itemsCollection = this._angularFireStore.collection<Product>('product', ref => ref.orderBy('date', 'desc').limit(6));
    return this.itemsCollection.valueChanges().pipe(map((products: Product[]) => {
      this.products = products;
      this.showLoadProducts = true;
    }));
  } */

  getImage(name: string) {
    // const element = [];
    const imgReference = ref(this._storage, name);
    return getDownloadURL(imgReference);
    /* .then(src => {
      element.push(src);
      return element.toString();
    }).catch(() => null); */
  }

  search(value: string): Promise<any> {
    value = value.charAt(0).toUpperCase() + (value.slice(1)).toLocaleLowerCase();
    return this.http.get(`${environment.apiURL}/product.json?orderBy="name"&startAt="${value}"&endAt="${value + '\uf8ff'}"`).pipe(map(this.processResponse)).toPromise();
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

  create(product: Product) {
    // return this.itemsCollection.add(product);
    return this.http.post(`${environment.apiURL}/product.json`, product).pipe(map((response: any) => {
      product.id = response.name;
      return product;
    }));
  }

  update(product: Product) {
    // return this.itemsCollection.doc(product.id).set(product);
    return this.http.put(`${environment.apiURL}/product/${product.id}.json`, product);
  }
}
