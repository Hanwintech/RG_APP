import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ReportQueryCaseSearchDataSource } from './../../../models/search/report-query-patrol-search.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";
/**
 * Generated class for the CaseStatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-case-states',
  templateUrl: 'case-states.html',
})
export class CaseStatesPage {
  private caseStateList: IntegerKeyValue[];
  private caseState: number[];
  private checked: boolean[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.caseStateList = this.navParams.data.caseStateList;
    this.caseState = this.navParams.data.caseState;
    this.checked = new Array(this.caseStateList.length);
    for (let i = 0; i < this.caseStateList.length; i++) {
      this.checked[i] = this.caseState.indexOf(this.caseStateList[i].key) > -1
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaseStatesPage');
  }
  doSelectAll() {
    for (let i = 0; i < this.checked.length; i++) {
      this.checked[i] = true;
    }
  }

  doEmptied() {
    for (let i = 0; i < this.checked.length; i++) {
      this.checked[i] = false;
    }
  }

  doSearch() {
    this.caseState=[];
    for (let i = 0; i < this.checked.length; i++) {
      if(this.checked[i]){
        this.caseState.push(this.caseStateList[i].key);
      }
    }
    console.log(this.caseState);
    this.viewCtrl.dismiss(this.caseState);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
