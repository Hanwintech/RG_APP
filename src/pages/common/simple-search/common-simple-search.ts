import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-common-simple-search',
  templateUrl: 'common-simple-search.html',
})
export class CommonSimpleSearchPage {
  private keyWord: String;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.keyWord = params.data.keyWord;
  }

  close() {
    this.viewCtrl.dismiss({ "needSearch": false });
  }

  clear() {
    this.keyWord = "";
  }

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "keyWord": this.keyWord });
  }
}
