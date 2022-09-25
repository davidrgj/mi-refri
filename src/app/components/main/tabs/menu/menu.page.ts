import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// import { AdMob } from '@admob-plus/ionic/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils.service';

import { ProfileComponent } from '../../profile/profile.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  now: Date = new Date;
  appearance = [
    {
      "name": "Modo oscuro",
      "route": "dashboard",
      "icon": "moon",
      "component": "dark-mode",
      "color": "dark",
      "isToggle": "dark-mode"
    },
  ]
  us = [
    {
      "name": "Calificanos",
      "route": "dashboard",
      "icon": "star",
      "id": "rate-us",
      "component": "rate-us",
      "color": "warning",
    },
    {
      "name": "Politica de privacidad",
      "route": "dashboard",
      "icon": "hand-left",
      "id": "privacy-policies",
      "component": "privacy-policies",
      "color": "primary",
    },
    {
      "name": "Acerca de nosotros",
      "route": "dashboard",
      "icon": "people",
      "id": "about-us",
      "component": "about-us",
      "color": "success",
    }
  ];
  showHeaderTitle: boolean = false;
  isDarkMode: boolean = localStorage.getItem('isDarkMode') == '1' ? true : false;
  showProfileInfo: boolean = false;
  admins = [];
  showManageAdmin: boolean = false;
  userData = (JSON.parse(localStorage.getItem('user')) || null);

  constructor(
    private _platform: Platform,
    // private _admob: AdMob,
    private modalController: ModalController,
    private _utilsService: UtilsService,
    private _authService: AuthService,
    public _modalController: ModalController,
    private router: Router
  ) {
    this.showProfileInfo = (JSON.parse(localStorage.getItem('isAuth')) || false);
    if (!this.showProfileInfo) return;
    this._utilsService.getAdmins().then(admins => {
      if (admins) {
        this.admins = [];
        admins.map(admin => this.admins.push(admin.email));
        if (this.userData)
          this.admins.includes(this.userData.user.email) ? this.showManageAdmin = true : this.showManageAdmin = false;
      }
    });
  }

  ngOnInit() {
  }

  logScrolling(event) {
    if (parseFloat(event.detail.scrollTop / 10 as any) > parseFloat(2.3 as any)) {
      this.showHeaderTitle = true;
    } else {
      this.showHeaderTitle = false;
    }
  }

  async profileInfo() {
    const modal = await this._modalController.create({
      component: ProfileComponent,
      mode: 'ios',
      initialBreakpoint: 1,
      // breakpoints: [0.8, 1],
      swipeToClose: true,
      showBackdrop: true
      // backdropDismiss: false
    });
    return await modal.present();
  }

  logout() {
    this._authService.logout();
    this.router.navigateByUrl('pages/home');
    this.showManageAdmin = false;
    this.showProfileInfo = false;
  }

  changeTheme(event) {
    if (event.detail.checked) {
      localStorage.setItem('isDarkMode', '1');
      document.body.setAttribute('color-theme', 'dark');
    } else {
      localStorage.setItem('isDarkMode', '0');
      document.body.setAttribute('color-theme', 'light');
    }
  }

  async showRateUs() {
    const alert = await alertController.create({
      mode: 'ios',
      translucent: true,
      message: '<h6 class="ion-no-margin">Calificanos en la tienda de aplicaciones</h3><br><br><h5 class="ion-text-center ion-no-margin"><ion-icon name="star" color="warning"></ion-icon><ion-icon name="star" color="warning"></ion-icon><ion-icon name="star" color="warning"></ion-icon><ion-icon name="star" color="warning"></ion-icon><ion-icon name="star-half" color="warning"></ion-icon></h4>',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          window.open('https://play.google.com/store/apps/details?id=com.davdevco.mirefri')
        }
      }],
    });

    await alert.present();
  }

  goToSocialNetwork(network: string) {
    switch (network) {
      case 'instagram':
        window.open('https://www.instagram.com/davdevco/');
        break;
      case 'facebook':
        window.open('https://www.facebook.com/DavDev-CO-106204882061565/');
        break;
      case 'email':
        window.open('mailto:davdevco@gmail.com')
        break;
      case 'store':
        window.open('https://play.google.com/store/apps/dev/?id=9099417717412230100');
        break;
      default:
        window.open('https://play.google.com/store/apps/dev/?id=9099417717412230100');
        break;
    }
  }

  dismiss = () => this.modalController.dismiss({ 'dismissed': true });
}
