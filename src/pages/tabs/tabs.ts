import { Component, ViewChild } from '@angular/core';
import { IonicPage, Tabs, NavParams, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  tab4Root: any;

  constructor(public navParams: NavParams, public navCtrl: NavController) {
    this.tab2Root = 'SelfIndexPage';
    this.tab3Root = 'SearchIndexPage';
    this.tab4Root = 'SelfIndexPage';
  }

  twoline() {
    var navOptions = {
      animation: 'wp-transition'
    };
    this.navCtrl.push("TwoLinePage", null, navOptions);
  }
}