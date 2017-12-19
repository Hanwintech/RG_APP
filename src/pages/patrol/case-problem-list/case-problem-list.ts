import { Component } from '@angular/core';
import { IonicPage,  NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-case-problem-list',
  templateUrl: 'case-problem-list.html',
})
export class CaseProblemListPage {
private list;
private selected;

  constructor(   public navParams: NavParams) {
    this.list = this.navParams.data.list;
    this.selected = this.navParams.data.selected;
  }
}
