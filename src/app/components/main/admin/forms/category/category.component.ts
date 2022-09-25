import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { ActionSheetController, ModalController } from '@ionic/angular';

import { CategoryService } from 'src/app/services/main/pages/category.service';
import { DetailService } from 'src/app/services/main/detail.service';
import { Category } from 'src/app/interfaces/category.interface';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {

  category: Category;
  categoryForm: FormGroup;
  colors = [
    { id: 'blue', name: 'Azul' },
    { id: 'green', name: 'Verde' },
    { id: 'red', name: 'Rojo' },
    { id: 'pruple', name: 'Morado' }
  ];
  file: any;
  srcImage: any = '';
  showPreviewImg: boolean = false;
  showUploadImage: boolean = true;
  showSaveButton: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    public _actionSheetController: ActionSheetController,
    public _modalController: ModalController,
    private _sanitization: DomSanitizer,
    private _categoryService: CategoryService,
    private _detailService: DetailService
  ) { }

  ngOnInit() {
    this.categoryForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      color: ['', [Validators.required]],
      description: ['', []],
      image: ['', [Validators.required]]
    });

    if (this._detailService.action == 'update') {
      this.category = this._detailService.getElement();

      if (this.category.image) {
        this.srcImage = '';
        this.showUploadImage = false;
        this._detailService.getImage(this.category.image)
          .then((urlImage) => this.srcImage = urlImage)
          .catch(error => this._detailService.presentError(error));
        this.showPreviewImg = true;
      }

      this.categoryForm.patchValue({
        name: this.category.name,
        color: this.category.color,
        description: this.category.description,
        image: this.category.image
      });
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
      this.categoryForm.get('image').reset();
      this.showPreviewImg = false;

      if (this._detailService.action == 'update') {
        this._detailService.presentLoading();
        this._detailService.deleteImage(this.category.image)
          .then(() => this._detailService.dismissLoading())
          .catch(error => this._detailService.presentError(error));
      }
    }
  }

  savePetition() {
    let petition: Observable<any>;
    if (this._detailService.action == 'update') {
      petition = this._categoryService.update(this.category);
    } else {
      petition = this._categoryService.create(this.category);
    }
    petition.subscribe(response => {
      this._detailService.newElement.emit({ response: response, action: this._detailService.action });
      this._modalController.dismiss({
        'dismissed': true
      });
    });
  }

  save() {
    if (this.categoryForm.valid) {
      this.showSaveButton = false;
      this._detailService.presentLoading();
      let valueForm = this.categoryForm.getRawValue();
      this.category = {
        id: this._detailService.action == 'update' ? this.category.id : null,
        name: valueForm.name,
        color: valueForm.color,
        description: valueForm.description,
        image: '',
        date: new Date().getTime()
      }

      if (this.file) {
        this._detailService.uploadImage('category', valueForm.name, this.file).then(response => {
          this.category.image = response.metadata.fullPath;
          this.savePetition();
          this._detailService.dismissLoading();
        }).catch(error => this._detailService.presentError(error));
      } else {
        this.category.image = valueForm.image;
        this.savePetition();
        this._detailService.dismissLoading();
      }
    }
  }

  dismissModal() {
    if (!this.categoryForm.pristine) {
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
