import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LawFileDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-law-file-detail',
  templateUrl: 'law-file-detail.html',
})
export class LawFileDetailPage {
  //private dataList: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // this.dataList=this.navParams.data;
    // console.log(this.navParams.data);
    // console.log(this.dataList);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LawFileDetailPage');
  }

}
