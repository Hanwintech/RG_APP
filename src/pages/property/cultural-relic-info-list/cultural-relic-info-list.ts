import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { CulturalRelicInfo, CulturalRelicInfoSearch } from './../../../models/property/cultural-relic-info.model';

@IonicPage()
@Component({
  selector: 'page-cultural-relic-info-list',
  templateUrl: 'cultural-relic-info-list.html',
})
export class CulturalRelicInfoListPage {
  private datasource: CulturalRelicInfo[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommonSimpleSearchPage');
  }
  
  search() { 
    this.navCtrl.push('CommonSimpleSearchPage');
  }

}
