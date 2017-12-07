import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, App, NavParams, ActionSheetController } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { EnumAreaCode } from './../../../models/enum'

@IonicPage()
@Component({
  selector: 'page-self-index',
  templateUrl: 'self-index.html',
})
export class SelfIndexPage {

  private area: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private app: App,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private apiService: ApiService
  ) {
    this.area = EnumAreaCode[this.apiService.areaCode];
  }

  editInfo() {
    this.navCtrl.push("SelfEditInfoPage");
  }

  culturalRelicInfoList() {
    this.navCtrl.push("CulturalRelicInfoListPage");
  }

  museumInfoList() {
    this.navCtrl.push("MuseumInfoListPage");
  }

  constructionSiteList() {
    this.navCtrl.push("ConstructionSiteInfoListPage");
  }
}
