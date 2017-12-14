import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { MessageCenterEntity } from './../../../models/self/message-center-info.model';

@IonicPage()
@Component({
  selector: 'page-message-center-info-detail',
  templateUrl: 'message-center-info-detail.html',
})
export class MessageCenterInfoDetailPage extends DetailPage {
  private messageCenterEntity: MessageCenterEntity;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.messageCenterEntity = this.navParams.data;
  }

  detail() { }

  close() { }
}
