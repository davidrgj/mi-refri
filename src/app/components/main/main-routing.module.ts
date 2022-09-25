import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/services/main/admin.guard';
import { OrderComponent } from './admin/order/order.component';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./tabs/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'offerts',
        loadChildren: () => import('./tabs/offerts/offerts.module').then(m => m.OffertsPageModule)
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () => import('./tabs/menu/menu.module').then(m => m.MenuPageModule)
          },
          {
            path: 'dashboard',
            loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
            canActivate: [AdminGuard]
          },
          {
            path: 'cart',
            loadChildren: () => import('../shared/cart-shop/cart-shop.module').then(m => m.CartShopPageModule)
          },
          {
            path: 'order',
            component: OrderComponent
          },
        ]
      },
      {
        path: 'support',
        loadChildren: () => import('./tabs/support/support.module').then(m => m.SupportPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
