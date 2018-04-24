import { Component } from '@angular/core';
import { IonicPage, Platform, IonicApp, NavParams, NavController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { BasePage } from './../../base-pages/base-page';
import { ApiService } from './../../services/api.service';
import { PageService } from './../../services/page.service';
import { EnumAppRole } from "./../../models/enum";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage extends BasePage {
  private backButtonPressed: boolean;  //用于判断返回键是否触发

  private showPatrol: boolean;
  private searchDefaultPage: string;

  private tab1Root: string;
  private tab2Root: string;
  private tab3Root: string;
  private tab4Root: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ionicApp: IonicApp,
    public platform: Platform,
    public statusBar: StatusBar,
    public file: File,
    public fileTransfer: FileTransfer,
    public toastCtrl: ToastController,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.backButtonPressed = false

    this.showPatrol = super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.SearchPatrol) || super.hasRole(EnumAppRole.Volunteer);

    this.tab2Root = 'PatrolMapPage';
    this.tab3Root = 'SearchIndexPage';
    this.tab4Root = 'SelfIndexPage';
  }

  ionViewDidLoad() {
    this.statusBar.show();
    this.statusBar.backgroundColorByHexString("#2ead8c");
  }
  ionViewWillEnter() { }
  ionViewDidEnter() {
    //注册返回按键事件
    //this.registerBackButtonAction();
  }
  ionViewWillLeave() { }
  ionViewDidLeave() { }
  ionViewWillUnload() { }

  twoline() {
    var navOptions = { animation: 'wp-transition' };
    this.navCtrl.push("TwoLinePage", null, navOptions);
  }

  public showPatrolOnline() {
    this.navCtrl.getAllChildNavs()[0].select(0);
  }

  public showMoveableStatistic() {
    this.searchDefaultPage = "culturalRelic";
    this.navCtrl.getAllChildNavs()[0].select(1);
  }

  public showPatrolStatistic() {
    this.searchDefaultPage = "inspect";
    this.navCtrl.getAllChildNavs()[0].select(1);
  }

  public searchSelected() {
    this.searchDefaultPage = "";
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      let tabs = this.navCtrl.getAllChildNavs()[0]._tabs;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].canGoBack()) {
          console.log(tabs[i].first())
          return tabs[i].dismiss();
        }
      }
      return this.showExit()
    }, 2000);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'bottom'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
}