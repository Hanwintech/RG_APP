import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the SearchIndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-index',
  templateUrl: 'search-index.html',
})
export class SearchIndexPage {
  statistics: string = "case";
  isAndroid: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchIndexPage');
  }

}
