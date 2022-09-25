import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartShopPageRoutingModule } from './cart-shop-routing.module';
import { CartShopPage } from './cart-shop.page';

@NgModule({
  imports: [
    CommonModule,
    CartShopPageRoutingModule,
    FormsModule,
    IonicModule
  ],
  declarations: [CartShopPage]
})
export class CartShopPageModule { }
