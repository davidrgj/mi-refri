import { Component, OnInit } from '@angular/core';

import { UtilsService } from 'src/app/services/utils.service';
import { ModalController, Platform } from '@ionic/angular';
import { AdMob } from '@admob-plus/ionic/ngx';

import { PaymentComponent } from '../../main/payment/payment.component';
import { DetailService } from 'src/app/services/main/detail.service';

@Component({
  selector: 'app-cart-shop',
  templateUrl: './cart-shop.page.html',
  styleUrls: ['./cart-shop.page.scss'],
})
export class CartShopPage implements OnInit {

  products = [];
  offerts = [];
  loading: boolean = true;
  // imgCart: string = null;

  constructor(
    private _platform: Platform,
    private _admob: AdMob,
    private _utilsService: UtilsService,
    private _modalController: ModalController,
    private _detailService: DetailService,
  ) { 
    this._platform.ready().then(async () => {
      const interstitial = new this._admob.InterstitialAd({
        adUnitId: 'ca-app-pub-9891779926883848/3476158072',
      });

      await interstitial.load();
      await interstitial.show();
    });
  }

  async ngOnInit() {

    this.loading = true;
    const productsP = await this._detailService.getElementsP('product');
    const offertsP = await this._detailService.getElementsP('offert');

    // Subscribe to changes of products
    if (this._utilsService.cart.length > 0) {
      this._utilsService.cart.map((item, i: number) => {

        // Update offerts
        if (item.products) {
          let newOffert = offertsP.filter(el => el.id == item.id);
          if (newOffert.length > 0 && item.id === newOffert[0].id) item = newOffert; else this._utilsService.cart.splice(i, 1);
        }

        // Update product
        if (item.category) {
          let newProduct = productsP.filter(el => el.id == item.id);
          if (newProduct.length > 0 && item.id === newProduct[0].id) item = newProduct; else this._utilsService.cart.splice(i, 1);
        }

      })
      if (productsP || offertsP) this.loading = false;            
    }

    this.products = this._utilsService.cart.filter(item => item.category);
    this.offerts = this._utilsService.cart.filter(item => item.products);

    this._utilsService.changeCart.subscribe(() => {
      this.offerts = this._utilsService.cart.filter(item => item.products);
      this.products = this._utilsService.cart.filter(item => item.category);
    });
  }

  async toPay() {
    const modal = await this._modalController.create({
      component: PaymentComponent,
      mode: 'ios',
      initialBreakpoint: 1,
      // breakpoints: [0.8, 1],
      swipeToClose: true,
      showBackdrop: true
      // backdropDismiss: false
    });
    return await modal.present();
  }
}
