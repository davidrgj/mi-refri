import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss']
})
export class MainPage {

  @ViewChild(IonTabs, { static: true }) ionTabs: IonTabs;
  current_tab = "home";

  constructor() { }

  setCurrentTab(event: any) {
    this.current_tab = event.tab;
  }

  overrideTabContainer() {
    setTimeout(() => {
      const routerOutlet = (this.ionTabs.outlet as any).nativeEl as HTMLElement;
      const container = routerOutlet.querySelector('ion-content');
      if (container) {
        container.style.setProperty('--padding-bottom', '80px');
      }
    });
  }
}
