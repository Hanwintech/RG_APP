import { Component, ViewChild } from '@angular/core';
import { IonicPage, Tabs, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = 'SelfIndexPage';
  tab2Root = '';
  tab3Root = '';
  tab4Root = 'SelfIndexPage';

  constructor() { }
}
