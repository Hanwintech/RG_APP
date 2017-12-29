import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ReportQueryCaseSearchDataSource } from './../../../models/search/report-query-patrol-search.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";

@IonicPage()
@Component({
  selector: 'page-investigate-procedures',
  templateUrl: 'investigate-procedures.html',
})
export class InvestigateProceduresPage {
  private investigationProcedureList: IntegerKeyValue[];
  private investigationProcedure: number[];
  private checked: boolean[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.investigationProcedureList = this.navParams.data.investigationProcedureList;
    this.investigationProcedure = this.navParams.data.investigationProcedure;
    this.checked = new Array(this.investigationProcedureList.length);
    for (let i = 0; i < this.investigationProcedureList.length; i++) {
      this.checked[i] = this.investigationProcedure.indexOf(this.investigationProcedureList[i].key) > -1
    }
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
    this.investigationProcedure=[];
    for (let i = 0; i < this.checked.length; i++) {
      if(this.checked[i]){
        this.investigationProcedure.push(this.investigationProcedureList[i].key);
      }
    }
    console.log(this.investigationProcedure);
    this.viewCtrl.dismiss(this.investigationProcedure);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
