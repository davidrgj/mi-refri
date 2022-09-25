import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AlertController, LoadingController } from '@ionic/angular';
import { Storage, ref, getDownloadURL, uploadBytes, deleteObject } from '@angular/fire/storage';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  routeData: any = {};
  element: any = {};
  action: string;
  isLoading: boolean;
  @Output() newElement: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private _storage: Storage,
    private _alertController: AlertController,
    private _loadingController: LoadingController
  ) { }

  setData = (data) => this.routeData = data;
  getData = () => this.routeData;

  setElement = (obj) => this.element = obj;
  getElement = () => this.element;

  getElements = (type: any) => this.http.get(`${environment.apiURL}/${type}.json`).pipe(map(this.processResponse));

  getElementsP = (type: string): Promise<any> => this.http.get(`${environment.apiURL}/${type}.json`).pipe(map(this.processResponse)).toPromise();

  removeElement = (type: string, element: string) => this.http.delete(`${environment.apiURL}/${type}/${element}.json`);

  getImage(name: string) {
    const imgReference = ref(this._storage, name);
    return getDownloadURL(imgReference);
  }

  uploadImage(type: string, name: string, file: any) {
    const imgReference = ref(this._storage, `/img/${type}/${name.replace(/ /g, '').toLowerCase()}-${Math.floor(Date.now() / 1000)}`);
    return uploadBytes(imgReference, file);
  }

  deleteImage(name: string) {
    const imgReference = ref(this._storage, name);
    return deleteObject(imgReference);
  }

  private processResponse(responseObj: Object) {
    if (responseObj === null) { return []; }

    const elements = [];
    Object.keys(responseObj).forEach(key => {
      const element = responseObj[key];
      element.id = key;

      elements.push(element);
    });

    return elements;
  }

  async presentError(error) {
    const alert = await this._alertController.create({
      message: `A ocurrido un error inesperado, por favor, vuelva a intentarlo<br><br><b>Error:</b> ${error}`,
      buttons: ['De acuerdo']
    });

    await alert.present();
  }

  async presentLoading() {
    this.isLoading = true;
    return await this._loadingController.create({
      spinner: 'lines',
      message: 'Por favor, espera',
      translucent: true,
      backdropDismiss: false
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) { a.dismiss(); }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this._loadingController.dismiss();
  }
}
