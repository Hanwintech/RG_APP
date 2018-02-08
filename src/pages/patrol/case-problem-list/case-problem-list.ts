import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-case-problem-list',
  templateUrl: 'case-problem-list.html',
})
export class CaseProblemListPage {
  private list;
  private selected;
  constructor(public navParams: NavParams) {
    let tempList = this.navParams.data.list;
    this.selected = this.navParams.data.selected;
    for (let listItem of tempList) {
      for (let arrayItem of this.selected) {
        if (listItem.caseValue == arrayItem) {
          listItem.selectedCheck = true;
          break;
        }
        else{
          listItem.selectedCheck = false;
        }
      }
    }
    this.list = tempList;
  }
}
