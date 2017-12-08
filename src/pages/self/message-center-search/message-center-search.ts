import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { MessageCenterInfoSearch, MessageCenterInfoSearchDataSource } from './../../../models/self/message-center-info.model';

@IonicPage()
@Component({
  selector: 'page-message-center-search',
  templateUrl: 'message-center-search.html',
})
export class MessageCenterSearchPage {
  private search: MessageCenterInfoSearch;
  private searchDataSource: MessageCenterInfoSearchDataSource;

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
    this.search.messageTitle = "";
    this.search.messageContent = "";
    this.search.addManageUnitName = "";
    this.search.adderName = "";
    this.search.clearNumbers();
  }

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
  }
}
