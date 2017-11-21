import { Component, ViewChild } from '@angular/core';
import { IonicPage, Tabs, Platform, AlertController } from 'ionic-angular';
import { CacheService } from './../../services/cache.service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = 'MyPage';
  tab2Root = 'StatisticsPage';
  tab3Root = 'StatisticsPage';
  tab4Root = 'InspectSearchPage';

  constructor() { }
  ionViewDidEnter() { }
}
