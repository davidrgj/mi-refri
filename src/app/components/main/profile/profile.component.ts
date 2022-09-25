import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('user'));

  constructor(
    private router: Router,
    public _modalController: ModalController
  ) {
    if (!localStorage.getItem('user')) this.router.navigateByUrl('/pages/home')
  }

  ngOnInit() { }

  dismissModal = () => this._modalController.dismiss();
}
