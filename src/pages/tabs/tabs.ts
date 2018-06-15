import { Component } from '@angular/core';
import { IonicPage, Platform, IonicApp, NavParams, NavController, ToastController,ModalController} from 'ionic-angular';
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
  private showPatrol: boolean;
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
    public pageService: PageService,
    public modalCtrl:ModalController
  ) {
    super(navCtrl, file, fileTransfer, pageService,modalCtrl);

    this.showPatrol = super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.SearchPatrol) || super.hasRole(EnumAppRole.Volunteer);

    this.tab2Root = 'PatrolMapPage';
    this.tab3Root = 'SearchIndexPage';
    this.tab4Root = 'SelfIndexPage';
  }

  ionViewDidLoad() {
    this.statusBar.show();
    this.statusBar.backgroundColorByHexString("#826c50");
  }


  twoline() {
    var navOptions = { animation: 'wp-transition' };
    this.navCtrl.push("TwoLinePage", null, navOptions);
  }

  public showPatrolOnline() {
    this.navCtrl.getAllChildNavs()[0].select(0);
  }

}