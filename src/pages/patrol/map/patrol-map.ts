import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PatrolMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-patrol-map',
  templateUrl: 'patrol-map.html',
})
export class PatrolMapPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  list() {
    this.navCtrl.push('PatrolInfoListPage');
  }

}
