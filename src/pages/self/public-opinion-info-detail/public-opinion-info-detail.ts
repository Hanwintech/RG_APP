import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-public-opinion-info-detail',
  templateUrl: 'public-opinion-info-detail.html',
})
export class PublicOpinionInfoDetailPage {
  private pageTitle: string;
  private iframe: SafeResourceUrl;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitizer: DomSanitizer) {
    this.pageTitle = this.navParams.data.pageTitle;
    this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl(this.navParams.data.url);
  }
}
