import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { EnumMessageCenterReadState} from './../../../models/enum';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { SetMessageStatus } from './../../../apis/self/set-message-status.api';
import { UVNoticeBasicInfo } from './../../../models/self/notice-info.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from './../../../services/api.service';

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
    public apiService: ApiService,
    private sanitize:DomSanitizer,
    public viewCtrl: ViewController,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);
    this.noticeBasicInfo = this.navParams.data;
    console.log(this.noticeBasicInfo );
    this.innerHtmlData = this.sanitize.bypassSecurityTrustHtml(this.noticeBasicInfo.noticeText);
  }

  close() {
    if (this.navParams.data.state == EnumMessageCenterReadState["未阅"]) { 
      this.apiService.sendApi(new SetMessageStatus(this.navParams.data.msgCenterID, localStorage.getItem("userId"), EnumMessageCenterReadState["已阅"])).subscribe(
        res => {
          if (res.success) {
            if (this.viewCtrl) {
              this.viewCtrl.dismiss(EnumMessageCenterReadState["已阅"]);
            }
            else {
              this.navCtrl.pop();
            }
          } else {
            this.pageService.showErrorMessage(res.reason);
          }
        },
        error => {
          this.pageService.showErrorMessage(error);
        });
    }
    this.navCtrl.pop();
  }
}
