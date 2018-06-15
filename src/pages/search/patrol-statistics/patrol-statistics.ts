import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-patrol-statistics',
  templateUrl: 'patrol-statistics.html',
})
export class PatrolStatisticsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {


  }
  inspectStatistics(listType: number) {
    this.navCtrl.push("InspectStatisticsPage", listType);
  }
}
