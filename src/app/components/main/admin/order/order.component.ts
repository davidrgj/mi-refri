import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

import { PaymentService } from 'src/app/services/main/payment.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit, OnDestroy {

  ordersOpen: any[];
  ordersClosed: any[];
  loading: boolean = true;
  isModalOpen: boolean = false;
  showHeaderTitle: boolean = false;
  dataModal: any;
  products: any;
  offerts: any;
  isLoading: boolean;

  constructor(
    private _orderService: PaymentService,
    public _modalController: ModalController,
    public _alertController: AlertController,
    public _loadingController: LoadingController
  ) { }

  ngOnInit() {
    this._orderService.getElements().subscribe(response => {
      this.ordersOpen = response.filter(item => item.status === 'open');
      this.ordersClosed = response.filter(item => item.status === 'closed');
      this.loading = false;
    });
  }

  logScrolling(event) {
    if (parseFloat(event.detail.scrollTop / 10 as any) > parseFloat(2.3 as any)) {
      this.showHeaderTitle = true;
    } else {
      this.showHeaderTitle = false;
    }
  }

  openModal(data) {
    this.dataModal = data;
    this.products = this.dataModal.products.filter(item => item.category);
    this.offerts = this.dataModal.products.filter(item => item.products);
    this.isModalOpen = true;
  }

  countElement = (produts, id) => produts.filter(product => product.id == id).map(el => el.countTotal);

  markAsManaged(element, index: number) {
    element.status = 'closed';
    this.ordersOpen.splice(index, 1);
    this.ordersClosed.push(element);

    this._orderService.update(element).toPromise().then().catch(error => {
      this.ordersClosed.splice(-1);
      this.ordersOpen.push(element);
      this.presentError(error);
    });
  }

  async presentError(error) {
    const alert = await this._alertController.create({
      message: `A ocurrido un error inesperado, por favor, vuelva a intentarlo<br><br><b>Error:</b> ${error}`,
      buttons: ['De acuerdo']
    });

    await alert.present();
  }

  ngOnDestroy() {
    this._modalController.dismiss({ 'dismiss': true });
    this.isModalOpen = false;
    this.dataModal = [];
  }
}
