import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SearchPage } from './../../../base-pages/search-page';
import { MessageCenterInfoSearch, MessageCenterInfoSearchDataSource } from './../../../models/self/message-center-info.model';

@IonicPage()
@Component({
  selector: 'page-message-center-search',
  templateUrl: 'message-center-search.html',
})
export class MessageCenterSearchPage extends SearchPage<MessageCenterInfoSearch, MessageCenterInfoSearchDataSource> {
  constructor(public params: NavParams, public viewCtrl: ViewController) {
    super(params, viewCtrl);
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
}
