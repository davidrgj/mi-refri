import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { AdMob, NativeAd } from '@admob-plus/ionic/ngx';
import { Platform } from '@ionic/angular';

import { Offert } from 'src/app/interfaces/offert.interface';
import { Product } from 'src/app/interfaces/product.interface';

import { ProductService } from 'src/app/services/main/pages/product.service';
import { UtilsService } from 'src/app/services/utils.service';
import { OffertService } from 'src/app/services/main/pages/offert.service';

@Component({
  selector: 'app-offerts',
  templateUrl: './offerts.page.html',
  styleUrls: ['./offerts.page.scss'],
})
export class OffertsPage implements OnInit, OnDestroy {

  offerts: any[] = [];
  loadingOfferts: boolean = true;
  cart: any[] = (JSON.parse(localStorage.getItem('cart')) || []);

  searchTerm: string;
  results: any[];
  showResults: boolean = false;
  loadingSearch: boolean = false;

  adNative: NativeAd;

  constructor(
    private _platform: Platform,
    private _admob: AdMob,
    private _offertService: OffertService,
    private _productService: ProductService,
    private _utilsService: UtilsService
  ) {
    this._platform.ready().then(async () => {
      this.adNative = new this._admob.NativeAd({
        adUnitId: 'ca-app-pub-9891779926883848/6012300739',
      })

      await this.adNative.load();
      await this.adNative.show({
        x: 0,
        y: 420,
        width: window.screen.width,
        height: 35,
      });

    })
  }

  ngOnInit() {
    this.getOfferts();
  }

  getOfferts() {
    this._offertService.load(5).valueChanges().subscribe((offerts: any) => {
      offerts.map(offert => offert.products.map((product, i) => this.getProduct(product).subscribe(prod => offert.products[i] = prod)));

      this.offerts = [];
      this.offerts.push(...offerts);
      this.loadingOfferts = false;
    });

  }

  search(event) {
    this.searchTerm = event.target.value;
    if (!this.searchTerm) {
      this.showResults = false;
      this.results = [];
      return;
    };

    if (event.key === 'Enter' || event.keyCode === 13) {
      this.showResults = true;
      this.loadingSearch = true;
      this._offertService.search(this.searchTerm).then(offerts => {
        offerts.map(offert => offert.products.map((product, i) => this.getProduct(product).subscribe(prod => offert.products[i] = prod)));

        this.results = [];
        this.results.push(...offerts);
        this.loadingSearch = false;
      });
    }
  }

  resetSearch() {
    this.searchTerm = '';
    (document.getElementById('search') as HTMLInputElement).value = '';
    this.showResults = false;
    this.results = [];
  }

  getProduct(product) {
    return this._productService.getProduct(product).valueChanges().pipe(map((productObj: any) => {
      if (!productObj) { return null; }
      productObj.image = this._productService.getImage(productObj.image).then(src => src ? productObj.image = src : productObj.image = null).catch(() => productObj.image = null);
      return productObj;
    }));
  }

  getImages(items) {
    items.forEach((el: any) => {
      if (!el.image) { return null }
      return this._productService.getImage(el.image).then(src => src ? el.image = src : el.image = null).catch(() => el.image = null);
    });
  }

  async ngOnDestroy() {
    this._platform.ready().then(async () => await this.adNative.hide());
  }
}
