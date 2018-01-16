import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GetNoticeInfo } from './../../../apis/self/get-notice-info.api';
import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { UVNoticeBasicInfo } from './../../../models/self/notice-info.model';

@IonicPage()
@Component({
  selector: 'page-notice-message-center',
  templateUrl: 'notice-message-center.html',
})
export class NoticeMessageCenterPage {
  private noticeBasicInfo: UVNoticeBasicInfo;

  constructor(
    public navCtrl: NavController,
    public apiService: ApiService,
    public pageService: PageService,
    public navParams: NavParams) {

    this.apiService.sendApi(new GetNoticeInfo(this.navParams.data.keyID, localStorage.getItem("userId"))).subscribe(
      res => {
        if (res.success) {
          this.noticeBasicInfo = res.data.noticeInfoDetails;
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }
  close() {
    this.navCtrl.pop();
  }

}
