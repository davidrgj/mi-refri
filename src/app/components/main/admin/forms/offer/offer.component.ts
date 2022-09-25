import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';

import { DetailService } from 'src/app/services/main/detail.service';
import { Offert } from 'src/app/interfaces/offert.interface';
import { OffertService } from 'src/app/services/main/pages/offert.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})

export class OfferComponent implements OnInit, OnDestroy {

  offert: Offert;
  offertForm: FormGroup;
  productsData = [];
  showSaveButton: boolean = true;
  showRealPrice: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    public _actionSheetController: ActionSheetController,
    public _modalController: ModalController,
    public _alertController: AlertController,
    private _offertService: OffertService,
    private _detailService: DetailService
  ) { }

  ngOnInit() {
    this._detailService.getElementsP('product').then(response => this.productsData = response);

    this.offertForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      price: [[], []],
      is_offert: [false, []],
      real_price: ['', []],
      products: this._formBuilder.array([])
    });

    if (this._detailService.action == 'create') { this.addProduct(); }

    if (this._detailService.action == 'update') {
      this.offert = this._detailService.getElement();
      this.offertForm.patchValue({
        name: this.offert.name,
        description: this.offert.description,
        price: this.offert.price,
        is_offert: this.offert.is_offert,
        real_price: this.offert.real_price,
      });

      setTimeout(() => {
        for (let i = 0; i < this.offert.products.length; i++) {
          (this.offertForm.controls.products as FormArray).push(new FormControl(this.offert.products[i], [Validators.required]))
        }
      }, 200);
    }

    this.changePrice();
  }

  get products() {
    return this.offertForm.get('products') as FormArray;
  }

  get productsControls() {
    return (this.offertForm.get('products') as FormArray).controls;
  }

  changePrice() {
    this.products.valueChanges.pipe().subscribe(value => {
      console.log(value);
    });
  }

  toggleOffert(event) {
    if (event.detail.checked) {
      this.offertForm.get('real_price').setValidators([Validators.required]);
      this.offertForm.updateValueAndValidity();
      this.showRealPrice = true;
    } else {
      this.offertForm.get('real_price').setValidators([]);
      this.offertForm.get('real_price').reset();
      this.offertForm.updateValueAndValidity();
      this.showRealPrice = false;
    }
  }

  async addProduct() {
    if (this.products.invalid) {
      const alert = await this._alertController.create({
        message: 'Por favor, seleccione un producto antes de agregar otro',
        buttons: ['De acuerdo']
      });

      return await alert.present();
    }

    (this.offertForm.controls.products as FormArray).push(new FormControl('', [Validators.required]))
  }

  async removeProduct(index: number) {
    if (this.productsControls.length == 1) {
      const alert = await this._alertController.create({
        message: 'Debe de agregar como mínimo un producto',
        buttons: ['De acuerdo']
      });
      return await alert.present();
    }
    this.products.removeAt(index)
  }

  async validateProduct(product: FormControl) {
    let values = this.products.getRawValue();
    let duplicateProducts = values.filter((val) => val == product.value);

    if (duplicateProducts.length > 1) {
      const alert = await this._alertController.create({
        message: 'Ya agregó este producto, por favor seleccione otro',
        buttons: ['De acuerdo']
      });

      product.reset();
      return await alert.present();
    }
    setTimeout(() => this.products.updateValueAndValidity(), 500);
  }

  savePetition() {
    let petition: Observable<any>;
    if (this._detailService.action == 'update') {
      petition = this._offertService.update(this.offert);
    } else {
      petition = this._offertService.create(this.offert);
    }
    petition.subscribe(response => {
      this._detailService.newElement.emit({ response: response, action: this._detailService.action });
      this._modalController.dismiss({ 'dismissed': true });
    });
  }

  save() {
    if (this.offertForm.valid) {
      this.showSaveButton = false;
      this._detailService.presentLoading();
      let valueForm = this.offertForm.getRawValue();
      let products = this.products.getRawValue();

      this.offert = {
        id: this._detailService.action == 'update' ? this.offert.id : null,
        name: valueForm.name,
        description: valueForm.description,
        products: products,
        price: valueForm.price,
        is_offert: valueForm.is_offert,
        real_price: valueForm.real_price,
        date: new Date().getTime()
      }

      this.savePetition();
      this._detailService.dismissLoading();
    }
  }

  dismissModal() {
    if (!this.offertForm.pristine) {
      this.canDismiss();
    } else {
      this._modalController.dismiss({
        'dismissed': true
      });
    }
  }

  async canDismiss() {
    const actionSheet = await this._actionSheetController.create({
      header: '¿Está seguro de descartar los cambios?',
      buttons: [
        {
          text: 'Descartar',
          role: 'destructive'
        },
        {
          text: 'Seguir editando',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();

    if (role === 'destructive') {
      this._modalController.dismiss({
        'dismissed': true
      });
    }

    return false;
  }

  ngOnDestroy() {
    this._detailService.setElement(null);
    this._detailService.action = '';
  }
}
