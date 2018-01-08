import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { BasePage } from './../../base-pages/base-page';
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
    public file: File,
    public fileTransfer: FileTransfer,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.showPatrol = super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.SearchPatrol) || super.hasRole(EnumAppRole.Volunteer);

    this.tab2Root = 'PatrolMapPage';
    this.tab3Root = 'SearchIndexPage';
    this.tab4Root = 'SelfIndexPage';
  }

  twoline() {
    var navOptions = { animation: 'wp-transition' };
    this.navCtrl.push("TwoLinePage", null, navOptions);
  }
}