import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SearchPage } from './../../../base-pages/search-page';
import { InspectionNoticeInfoSearch, InspectionNoticeInfoSearchDataSource } from './../../../models/self/inspection-notice-info.model';

@IonicPage()
@Component({
  selector: 'page-inspection-notice-search',
  templateUrl: 'inspection-notice-search.html',
})
export class InspectionNoticeSearchPage extends SearchPage<InspectionNoticeInfoSearch, InspectionNoticeInfoSearchDataSource> {
  constructor(public params: NavParams, public viewCtrl: ViewController) {
    super(params, viewCtrl);
  }

  clear() {
    this.search.startDateTime = "";
    this.search.endDateTime = "";
    this.search.culturalRelicName = "";
    this.search.fileTitle = "";
    this.search.fromManageUnitName = "";
    this.search.clearNumbers();
  }
}
