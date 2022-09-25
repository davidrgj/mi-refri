import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoryComponent } from './forms/category/category.component';
import { ProductComponent } from './forms/product/product.component';
import { OfferComponent } from './forms/offer/offer.component';

@NgModule({
  declarations: [DashboardComponent, CategoryComponent, ProductComponent, OfferComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
