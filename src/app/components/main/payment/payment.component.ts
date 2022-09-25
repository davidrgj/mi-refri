import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Delivery } from 'src/app/interfaces/delivery.interface';
import { PaymentService } from 'src/app/services/main/payment.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _paymentService: PaymentService,
    public _modalController: ModalController,
    public _alertController: AlertController,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {

    ;

    this.paymentForm = this._formBuilder.group({
      name: [localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.displayName : null, [Validators.required, , Validators.minLength(5)]],
      email: [localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user.email : null, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      note: ['', []],
      paymentType: ['effective', [Validators.required]],
      products: [this._utilsService.cart, [Validators.required]],
      totalVaue: [this._utilsService.totalPrice(), [Validators.required]],
      status: ['open', []],
      date: [Date.now(), []]
    });

  }

  dismissModal = () => this._modalController.dismiss({ 'dismissed': true });

  finishPayment() {
    if (this.paymentForm.invalid) return;
    let message: string;
    let subHeader: string;
    this._paymentService.create(this.paymentForm.getRawValue()).then((delivery: Delivery) => {
      this._utilsService.cart = [];
      localStorage.removeItem('cart');
      subHeader = 'Hemos recibido tu pedido!';
      message = `Trabajamos para ofrecerte el mejor servicio. Te pondremos en contacto para darte la hora de la entrega de tu pedido.`
      this.dismissModal();
      this.finishedPayment(message, subHeader);

      setTimeout(() => window.open(`https://api.whatsapp.com/send?phone=573222308028&text=Hola,%20he%20realizado%20mi%20pedido%20n%C3%BAmero%20${delivery.date}%20por%20la%20aplicaci%C3%B3n%20Mi%20Refi%20📋🚚`), 6500);
    }).catch(error => message = error);
  }

  async finishedPayment(message: string, subHeader: string) {
    const alert = await this._alertController.create({
      subHeader: subHeader,
      message: message,
      buttons: ['De acuerdo']
    });

    return await alert.present();
  }
}
