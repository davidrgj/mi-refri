import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartShopPage } from './cart-shop.page';

const routes: Routes = [
  {
    path: '',
    component: CartShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartShopPageRoutingModule {}
