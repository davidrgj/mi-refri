import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffertsPageRoutingModule } from './offerts-routing.module';

import { OffertsPage } from './offerts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffertsPageRoutingModule
  ],
  declarations: [OffertsPage]
})
export class OffertsPageModule {}
