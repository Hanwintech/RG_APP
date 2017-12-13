import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EnumPublicOpinionShowType } from './../../../models/enum';

@IonicPage()
@Component({
  selector: 'page-public-opinion-info',
  templateUrl: 'public-opinion-info.html',
})
export class PublicOpinionInfoPage {
  constructor(public navCtrl: NavController) {
  }

  publicOpinionCountry() {
    this.navCtrl.push('PublicOpinionInfoListPage', EnumPublicOpinionShowType.全国文物舆情信息);
  }

  publicOpinionProvinceBad() {
    this.navCtrl.push('PublicOpinionInfoListPage', EnumPublicOpinionShowType.省内文物舆情信息);
  }

  publicOpinionProvinceGood() {
    this.navCtrl.push('PublicOpinionInfoListPage', EnumPublicOpinionShowType.省内文博大事);
  }
}
