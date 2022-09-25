import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffertsPage } from './offerts.page';

const routes: Routes = [
  {
    path: '',
    component: OffertsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffertsPageRoutingModule {}
