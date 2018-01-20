import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-common-simple-search',
  templateUrl: 'common-simple-search.html',
})
export class CommonSimpleSearchPage {
  private keyword: String;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.keyword = this.params.data.keyword;
  }

  clear() {
    this.keyword = "";
  }

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "keyword": this.keyword });
  }
}
