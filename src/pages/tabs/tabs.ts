import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root: string;
  tab2Root: string;
  tab3Root: string;
  tab4Root: string;
  tab5Root: string;

  constructor(public navParams: NavParams, public navCtrl: NavController) {
    this.tab2Root = 'PatrolMapPage';
    this.tab3Root = 'SelfIndexPage';
    this.tab4Root = 'SearchIndexPage';
    this.tab5Root = 'SelfIndexPage';
  }

  twoline() {
    var navOptions = { animation: 'wp-transition' };
    this.navCtrl.push("TwoLinePage", null, navOptions);
  }
}