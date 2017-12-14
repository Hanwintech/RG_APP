import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SearchPage } from './../../../base-pages/search-page';
import { NoticeInfoSearch, NoticeInfoSearchDataSource } from './../../../models/self/notice-info.model';

@IonicPage()
@Component({
  selector: 'page-notice-search',
  templateUrl: 'notice-search.html',
})
export class NoticeSearchPage extends SearchPage<NoticeInfoSearch, NoticeInfoSearchDataSource> {
  constructor(public params: NavParams, public viewCtrl: ViewController) {
    super(params, viewCtrl);
  }

  clear() {
    this.search.title = "";
    this.search.briefIntroduction = "";
    this.search.sendDeptName = "";
    this.search.relatedDepartmentName = "";
    this.search.sendDateStart = "";
    this.search.sendDateEnd = "";
    this.search.clearNumbers();
  }
}
