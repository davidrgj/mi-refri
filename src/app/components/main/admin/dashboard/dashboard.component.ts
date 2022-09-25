import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';
import { DetailService } from 'src/app/services/main/detail.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  storeManagementList = [
    {
      "name": "Categorías",
      "realName": "category",
      "icon": "bookmarks",
      "component": "CategoryComponent",
      "color": "primary",
    },
    {
      "name": "Productos",
      "realName": "product",
      "icon": "list",
      "component": "ProductComponent",
      "color": "success"
    },
    {
      "name": "Ofertas",
      "realName": "offert",
      "icon": "pricetags",
      "component": "OfferComponent",
      "color": "warning"
    },
  ];
  showHeaderTitle: boolean = false;

  constructor(
    private _navController: NavController,
    private _detailService: DetailService
  ) { }

  ngOnInit() { }

  logScrolling(event) {
    if (parseFloat(event.detail.scrollTop / 10 as any) > parseFloat(2.4 as any)) {
      this.showHeaderTitle = true;
    } else {
      this.showHeaderTitle = false;
    }
  }

  entryComponent(data) {
    this._detailService.setData(data);
    this._navController.navigateForward('pages/menu/dashboard/detail');
  }
}
