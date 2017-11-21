import { SearchCondition } from './../../models/search-condition';
import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

/**
 * Generated class for the AssetCondition page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-condition',
  templateUrl: 'search-condition.html',
})
export class SearchConditionPage {
  condition : SearchCondition;
  constructor(public viewCtrl: ViewController) {
    this.condition = viewCtrl.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssetCondition');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
