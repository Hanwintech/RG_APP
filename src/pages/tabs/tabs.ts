import { Component, ViewChild } from '@angular/core';
import { IonicPage, Tabs, Platform, NavParams, AlertController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  tab5Root: any;
  constructor(public navParams: NavParams, public navCtrl: NavController, ) {
    // this.tab1Root = 'TwoLinePage';
    this.tab2Root = 'SelfIndexPage';
    this.tab3Root = 'SelfIndexPage';
    this.tab4Root = 'SelfIndexPage';
    this.tab5Root = 'SelfIndexPage';
  }
  ionViewDidEnter() {
  }
  twoline() {
    var navOptions = {
      animation: 'wp-transition'
    };
    this.navCtrl.push("TwoLinePage", null, navOptions);
  }
}
