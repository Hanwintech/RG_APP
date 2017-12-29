import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { SearchPage } from './../../../../base-pages/search-page';
import { ReportQueryCaseSearchDataSource } from './../../../../models/search/report-query-patrol-search.model';
import { ReportQueryCaseSearch } from './../../../../models/search/report-query-case-search.model';
import { IntegerKeyValue } from "./../../../../models/integer-key-value.model";
import { AlertController } from 'ionic-angular';
import { PageService } from './../../../../services/page.service';

@IonicPage()
@Component({
  selector: 'page-case-condition-inquiry',
  templateUrl: 'case-condition-inquiry.html',
})
export class CaseConditionInquiryPage extends SearchPage<ReportQueryCaseSearch, ReportQueryCaseSearchDataSource> {
  public investigationProcedure: number[];
  public investigationProcedureName: string;
  public caseState: number[];
  public caseStateName: string;
  // public startDateTime: string;
  // public endDateTime: string;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public pageService: PageService
  ) {
    super(params, viewCtrl);
    this.investigationProcedure = eval("[" + this.search.investigationProcedure + "]");
    this.doCheckbox1();

    this.caseState = eval("[" + this.search.caseState + "]");
    this.doCheckbox2();
  }

  doCheckbox1() {
    this.investigationProcedureName = "";
    for (let item of this.searchDataSource.investigationProcedureList) {
      if (this.investigationProcedure.indexOf(item.key) > -1) {
        this.investigationProcedureName += "," + item.value;
      }
    }
    this.investigationProcedureName = this.investigationProcedureName.substring(1);
    //console.log(this.investigationProcedureName);
  }
  doCheckbox2() {
    this.caseStateName = "";
    for (let item of this.searchDataSource.caseStateList) {
      if (this.caseState.indexOf(item.key) > -1) {
        this.caseStateName += "," + item.value;
      }
    }
    this.caseStateName = this.caseStateName.substring(1);
    //console.log(this.caseStateName);
  }


  investigateProcedures() {
    let searchModal = this.modalCtrl.create("InvestigateProceduresPage", { "investigationProcedureList": this.searchDataSource.investigationProcedureList, "investigationProcedure": this.investigationProcedure });
    searchModal.onDidDismiss(data => {
      if (data) {
        this.investigationProcedure = data;
        //console.log(this.investigationProcedure);
        this.doCheckbox1();
        this.search.investigationProcedure = "";
        for (let item of this.investigationProcedure) {
          this.search.investigationProcedure += "," + item;
        }
        this.search.investigationProcedure = this.search.investigationProcedure.substring(1);
        console.log(this.search.investigationProcedure);
      }
    });
    searchModal.present();
  }
  caseStates() {
    let searchModal = this.modalCtrl.create("CaseStatesPage", { "caseStateList": this.searchDataSource.caseStateList, "caseState": this.caseState });
    searchModal.onDidDismiss(data => {
      if (data) {
        this.caseState = data;
        //console.log(this.caseState);
        this.doCheckbox2();
        this.search.caseState = "";
        for (let item of this.caseState) {
          this.search.caseState += "," + item;
        }
        this.search.caseState = this.search.caseState.substring(1);
        console.log(this.search.caseState);
      }
    });
    searchModal.present();
  }

  beforeSearch = () => {
    if (!this.investigationProcedureName&&!this.caseStateName) {
      this.pageService.showErrorMessage("请选择查处程序！请选择案件状态！");
      return false;
    }else if(!this.investigationProcedureName){
      this.pageService.showErrorMessage("请选择查处程序！");
      return false;
    }else if(!this.caseStateName){
      this.pageService.showErrorMessage("请选择案件状态！");
      return false;
    }
    return true;
  }

  clear() {
    this.search.startDateTime = "";
    this.search.endDateTime = "";
    this.investigationProcedureName = "";
    //this.search.investigationProcedure = "";
    this.investigationProcedure=[];
    this.caseStateName = "";
    //this.search.caseState = "";
    this.caseState=[];
  }
} 