import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { UVNoticeBasicInfo } from './../../../models/self/notice-info.model';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-notice-detail',
  templateUrl: 'notice-detail.html',
})
export class NoticeDetailPage extends DetailPage {
  private noticeBasicInfo: UVNoticeBasicInfo;
  private innerHtmlData;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public fileTransfer: FileTransfer,
    private sanitize:DomSanitizer,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);
    this.noticeBasicInfo = this.navParams.data;
    this.innerHtmlData = this.sanitize.bypassSecurityTrustHtml(this.noticeBasicInfo.noticeText);
  }

  close() {
    this.navCtrl.pop();
  }
}
