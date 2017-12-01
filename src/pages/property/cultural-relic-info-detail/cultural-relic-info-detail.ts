import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cultural-relic-info-detail',
  templateUrl: 'cultural-relic-info-detail.html',
})
export class CulturalRelicInfoDetailPage {
  private culturalRelicID: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.culturalRelicID = this.navParams.data
    console.log(this.culturalRelicID);
  }

  showLocation() {
    console.log(this.culturalRelicID);
  }

}
