import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { ActionSheetController, ModalController } from '@ionic/angular';

import { DetailService } from 'src/app/services/main/detail.service';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from 'src/app/services/main/pages/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {

  product: Product;
  productForm: FormGroup;
  categories = [];
  file: any;
  srcImage: any = '';
  showPreviewImg: boolean = false;
  showUploadImage: boolean = true;
  showSaveButton: boolean = true;
  loadingCategories: boolean = false;
  showRealPrice: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    public _actionSheetController: ActionSheetController,
    public _modalController: ModalController,
    private _sanitization: DomSanitizer,
    private _productService: ProductService,
    private _detailService: DetailService
  ) { }

  ngOnInit() {
    this.productForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      grammage: ['', [Validators.required]],
      is_offert: [false, []],
      real_price: ['', []],
      description: ['', []],
      image: ['', [Validators.required]]
    });

    if (this._detailService.action == 'update') {
      this.product = this._detailService.getElement();
      this.getCategories();

      if (this.product.image) {
        this.srcImage = '';
        this.showUploadImage = false;
        this._detailService.getImage(this.product.image)
          .then((urlImage) => this.srcImage = urlImage)
          .catch(error => this._detailService.presentError(error));
        this.showPreviewImg = true;
      }

      this.productForm.patchValue({
        name: this.product.name,
        price: this.product.price,
        grammage: this.product.grammage,
        is_offert: this.product.is_offert,
        real_price: this.product.real_price,
        description: this.product.description,
        image: this.product.image
      });
      this.product.is_offert == true ? this.showRealPrice = true : this.showRealPrice = false;
      setTimeout(() => this.productForm.get('category').setValue(this.product.category), 200);
    }
  }

  getCategories() {
    if (this.categories.length == 0) {
      this.loadingCategories = true;
      this._detailService.getElements('category').subscribe(response => {
        this.categories = response;
        this.loadingCategories = false;
      });
    }
  }

  toggleOffert(event) {
    if (event.detail.checked) {
      this.productForm.get('real_price').setValidators([Validators.required]);
      this.productForm.updateValueAndValidity();
      this.showRealPrice = true;
    } else {
      this.productForm.get('real_price').setValidators([]);
      this.productForm.get('real_price').reset();
      this.productForm.updateValueAndValidity();
      this.showRealPrice = false;
    }
  }

  loadImage(event) {
    this.file = [];
    this.srcImage = '';
    this.file = event.target.files[0];
    if (this.file) {
      this.srcImage = this._sanitization.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
      this.showPreviewImg = true;
    }
  }

  async removeImage() {
    const actionSheet = await this._actionSheetController.create({
      header: '¿Está seguro de eliminar la imagen?',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive'
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();

    if (role === 'destructive') {
      if (this._detailService.action == 'update') { this.showUploadImage = true }
      this.productForm.get('image').reset();
      this.showPreviewImg = false;

      if (this._detailService.action == 'update') {
        this._detailService.presentLoading();
        this._detailService.deleteImage(this.product.image)
          .then(() => this._detailService.dismissLoading())
          .catch(error => this._detailService.presentError(error));
      }
    }
  }

  savePetition() {
    // let petition: Promise<any>;
    let petition: Observable<any>;
    if (this._detailService.action == 'update') {
      petition = this._productService.update(this.product);
    } else {
      petition = this._productService.create(this.product);
    }
    // petition.then(response => {
    //   this._detailService.newElement.emit({ response: response, action: this._detailService.action });
    //   this._modalController.dismiss({
    //     'dismissed': true
    //   });
    // });

    petition.subscribe(response => {
      this._detailService.newElement.emit({ response: response, action: this._detailService.action });
      this._modalController.dismiss({
        'dismissed': true
      });
    })
  }

  save() {
    if (this.productForm.valid) {
      this.showSaveButton = false;
      this._detailService.presentLoading();
      let valueForm = this.productForm.getRawValue();
      this.product = {
        id: this._detailService.action == 'update' ? this.product.id : null,
        name: valueForm.name,
        category: valueForm.category,
        price: valueForm.price,
        grammage: valueForm.grammage,
        is_offert: valueForm.is_offert,
        real_price: valueForm.real_price,
        description: valueForm.description,
        image: '',
        date: new Date().getTime()
      }

      if (this.file) {
        this._detailService.uploadImage('product', valueForm.name, this.file).then(response => {
          this.product.image = response.metadata.fullPath;
          this.savePetition();
          this._detailService.dismissLoading();
        }).catch(error => this._detailService.presentError(error));
      } else {
        this.product.image = valueForm.image;
        this.savePetition();
        this._detailService.dismissLoading();
      }
    }
  }

  dismissModal() {
    if (!this.productForm.pristine) {
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
