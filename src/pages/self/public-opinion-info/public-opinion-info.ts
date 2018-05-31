import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

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

  publicOpinionHuaiAnYuQin(){
    this.navCtrl.push('PublicOpinionInfoListPage', EnumPublicOpinionShowType.淮安市文物舆情信息);
  }

  publicOpinionHuaiAnWenBo(){
    this.navCtrl.push('PublicOpinionInfoListPage', EnumPublicOpinionShowType.淮安市文博大事);
  }
}
