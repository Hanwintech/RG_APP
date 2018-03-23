import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-public-opinion-info-detail',
  templateUrl: 'public-opinion-info-detail.html',
})
export class PublicOpinionInfoDetailPage {
  private pageTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser) {
    this.pageTitle = this.navParams.data.pageTitle;
    let browser = this.iab.create(this.navParams.data.url);
    this.navCtrl.pop();
  }
}
