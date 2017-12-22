import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CaseConditionInquiryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-case-condition-inquiry',
  templateUrl: 'case-condition-inquiry.html',
})
export class CaseConditionInquiryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaseConditionInquiryPage');
  }
  investigateProcedures() {
    this.navCtrl.push("InvestigateProceduresPage");
}
}
