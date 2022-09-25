import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { map } from 'rxjs/operators';

import { Storage, ref, getDownloadURL } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    showHeaderTitle: boolean = false;
    cart: any[] = (JSON.parse(localStorage.getItem('cart')) || []);
    productsCart = this.cart.filter(item => item.category);
    offertsCart = this.cart.filter(item => item.products);
    @Output() changeCart: EventEmitter<any> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private _storage: Storage
    ) { }

    getAdmins(): Promise<any> {
        return this.http.get(`${environment.apiURL}/admin.json`).pipe(map(this.processResponse)).toPromise();
    }

    getElements = (type: string) => this.http.get(`${environment.apiURL}/${type}.json`).pipe(map(this.processResponse));

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

    showTitlePage(event) {
        const position = event.detail.scrollTop;
        if (parseFloat(position / 10 as any) > parseFloat(2.4 as any)) {
            this.showHeaderTitle = true;
        } else {
            this.showHeaderTitle = false;
        }
    }

    countElementOfCart(id) {
        if (id) { return this.cart.filter(product => product.id == id).map(el => el.countTotal); }
    }

    addToCart(element) {
        let storageProducts = (JSON.parse(localStorage.getItem('cart')) || []);
        let notProducts = storageProducts.filter(product => product.id !== element.id);
        let products = storageProducts.filter(product => product.id === element.id);

        if (products.length > 0) {
            let prod = products[0];
            prod.countTotal = prod.countTotal + 1;
            this.calculateTotal(prod);

            this.cart = notProducts.concat(products);
        } else {
            let prod = element;
            prod.countTotal = 1;
            this.calculateTotal(prod);

            this.cart.push(prod);
            this.changeCart.emit();
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    removeCart(element) {
        let storageProducts = (JSON.parse(localStorage.getItem('cart')) || []);
        let notProducts = storageProducts.filter(product => product.id !== element.id);
        let products = storageProducts.filter(product => product.id === element.id);

        if (products.length > 0) {
            let prod = products[0];
            prod.countTotal = prod.countTotal - 1;
            if (prod.countTotal == 0) {
                products.splice(0, 1);
                setTimeout(() => this.changeCart.emit(), 100);
            }
            this.calculateTotal(prod);
        }

        this.cart = notProducts.concat(products);
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    calculateTotal(prod) {
        if (prod.is_offert) {
            prod.totalPrice = prod.real_price * prod.countTotal;
            prod.savingPrice = (prod.price * prod.countTotal) - prod.totalPrice;
        } else {
            prod.totalPrice = prod.price * prod.countTotal;
            prod.savingPrice = 0;
        };
    }

    totalPrice = () => this.cart.map(item => item.totalPrice).reduce((prev, curr) => prev + curr, 0);

    savingPrice = () => this.cart.map(item => item.savingPrice).reduce((prev, curr) => prev + curr, 0);

    getImage(name: string) {
        const imgReference = ref(this._storage, name);
        return getDownloadURL(imgReference);
    }
}
