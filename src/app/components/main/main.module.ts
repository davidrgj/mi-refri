import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MainRoutingModule } from './main-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainPage } from './main.page';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderComponent } from './admin/order/order.component';

@NgModule({
  declarations: [MainPage, ProfileComponent, PaymentComponent, OrderComponent],
  imports: [
    CommonModule,
    IonicModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MainModule { }
