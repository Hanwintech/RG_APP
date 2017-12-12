import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { InspectionNoticeInfoSearch, InspectionNoticeInfoSearchDataSource } from './../../../models/self/inspection-notice-info.model';

@IonicPage()
@Component({
  selector: 'page-inspection-notice-search',
  templateUrl: 'inspection-notice-search.html',
})
export class InspectionNoticeSearchPage {
  private search: InspectionNoticeInfoSearch;
  private searchDataSource: InspectionNoticeInfoSearchDataSource;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.search = params.data.search;
    this.searchDataSource = params.data.dataSource;
  }

  close() {
    this.viewCtrl.dismiss({ "needSearch": false });
  }

  clear() {
    this.search.startDateTime = "";
    this.search.endDateTime = "";
    this.search.culturalRelicName = "";
    this.search.fileTitle = "";
    this.search.fromManageUnitName = "";
    this.search.clearNumbers();
  }

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
  }
}
