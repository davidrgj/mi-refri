import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ActionSheetController, ModalController } from '@ionic/angular';

// Components
import { CategoryComponent } from '../../forms/category/category.component';
import { ProductComponent } from '../../forms/product/product.component';
import { OfferComponent } from '../../forms/offer/offer.component';

//Services
import { DetailService } from 'src/app/services/main/detail.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {

  showHeaderTitle: boolean = false;
  dataComponent = this._detailService.getData();
  loading: boolean = true;
  data: any;
  component: any;

  constructor(
    private _router: Router,
    private _modalController: ModalController,
    private _actionSheetController: ActionSheetController,
    private _detailService: DetailService
  ) { }

  ngOnInit() {
    if (Object.keys(this.dataComponent).length == 0) {      
      this.ngOnDestroy();
      this._router.navigateByUrl('pages/menu/dashboard');
    }
    this._detailService.getElements(this.dataComponent.realName).subscribe(response => {
      this.data = response;
      this.loading = false;
    });

    this._detailService.newElement.subscribe(element => {
      if (element.action == 'update') {
        this.data.map(el => el.id == element.response.id ? Object.assign(el, element.response) : el)
      } else {
        this.data.push(element.response)
      }
    })
  }

  logScrolling(event) {
    if (parseFloat(event.detail.scrollTop / 10 as any) > parseFloat(2.4 as any)) {
      this.showHeaderTitle = true;
    } else {
      this.showHeaderTitle = false;
    }
  }

  async presetModalForm(component: string) {
    switch (component) {
      case 'CategoryComponent':
        this.component = CategoryComponent;
        break;
      case 'ProductComponent':
        this.component = ProductComponent;
        break;
      case 'OfferComponent':
        this.component = OfferComponent;
        break;
      default:
        break;
    }

    const modal = await this._modalController.create({
      component: this.component,
      mode: 'ios',
      initialBreakpoint: 1,
      breakpoints: [0.8, 1],
      // swipeToClose: false,
      showBackdrop: true,
      backdropDismiss: false
    });
    return await modal.present();
  }

  async presentActionOptions(element) {
    const actionSheet = await this._actionSheetController.create({
      buttons: [
        {
          text: 'Actualizar',
          icon: 'create-outline',
          handler: () => {
            this._detailService.setElement(element);
            this._detailService.action = 'update';
            this.presetModalForm(this.dataComponent.component);
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash-outline',
          id: 'delete-button',
          data: {
            type: 'delete'
          },
          handler: () => {
            let indexElement: number;
            this.data.map((el, i) => el.id == element.id ? indexElement = i : i);           
            this.data.splice(indexElement, 1);
            this._detailService.deleteImage(element.image).then().catch(error => this._detailService.presentError(error))
            this._detailService.removeElement(this.dataComponent.realName, element.id).subscribe();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
  }

  ngOnDestroy() {
    this._detailService.setElement(null);
    this._detailService.action = '';
  }
}
