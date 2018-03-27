import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { EnumMessageCenterReadState } from './../../../models/enum';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { SetMessageStatus } from './../../../apis/self/set-message-status.api';
import { UVNoticeBasicInfo } from './../../../models/self/notice-info.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from './../../../services/api.service';
import { GetNoticeInfo } from './../../../apis/self/get-notice-info.api';

@IonicPage()
@Component({
  selector: 'page-notice-detail',
  templateUrl: 'notice-detail.html',
})
export class NoticeDetailPage extends DetailPage {
  private noticeBasicInfo: UVNoticeBasicInfo;
  private innerHtmlData;
  private footerControl=true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    private sanitize: DomSanitizer,
    public viewCtrl: ViewController,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);
    this.apiService.sendApi(new GetNoticeInfo(this.navParams.data.keyID, localStorage.getItem("userId"))).subscribe(
      res => {
        if (res.success) {
          this.noticeBasicInfo = res.data.noticeInfoDetails;
          this.innerHtmlData = this.sanitize.bypassSecurityTrustHtml(this.noticeBasicInfo.noticeText);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  close() {
    this.footerControl=false;
    this.navCtrl.pop();
  }
}
