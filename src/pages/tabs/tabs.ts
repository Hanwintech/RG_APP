import { Component, ViewChild } from '@angular/core';
import { IonicPage, Tabs, Platform,NavParams, AlertController } from 'ionic-angular';
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
  constructor( public navParams: NavParams) { 
    this.tab1Root = 'TwoLinePage';
    this.tab2Root = 'SelfIndexPage';
    this.tab3Root = 'SelfIndexPage';
    this.tab4Root = 'SelfIndexPage';
  }
  ionViewDidEnter(){
  }
}
