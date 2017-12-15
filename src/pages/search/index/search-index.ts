import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search-index',
  templateUrl: 'search-index.html',
})
export class SearchIndexPage {
  statistics: string = "cases";
  isAndroid: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform) {
    this.isAndroid = platform.is('android');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchIndexPage');
  }
  Statistics(chartType: number){
    this.navCtrl.push("SearchStatisticsPage", chartType);
  }
  inspectStatistics(chartType: number){
    this.navCtrl.push("InspectStatisticsPage", chartType);
  }
}
