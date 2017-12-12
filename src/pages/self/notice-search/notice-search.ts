import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { NoticeInfoSearch, NoticeInfoSearchDataSource } from './../../../models/self/notice-info.model';

@IonicPage()
@Component({
  selector: 'page-notice-search',
  templateUrl: 'notice-search.html',
})
export class NoticeSearchPage {
  private search: NoticeInfoSearch;
  private searchDataSource: NoticeInfoSearchDataSource;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.search = params.data.search;
    this.searchDataSource = params.data.dataSource;
  }

  close() {
    this.viewCtrl.dismiss({ "needSearch": false });
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

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
  }
}
