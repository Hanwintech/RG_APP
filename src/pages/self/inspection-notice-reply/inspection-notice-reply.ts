import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PostInspectorNoticeReply } from './../../../apis/self/post-inspector-notice-reply.api';
import { InspectionNoticeInfo } from './../../../models/self/inspection-notice-info.model';

@IonicPage()
@Component({
  selector: 'page-inspection-notice-reply',
  templateUrl: 'inspection-notice-reply.html',
})
export class InspectionNoticeReplyPage {
  private inspectionNotice: InspectionNoticeInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    this.inspectionNotice = this.navParams.data;
    this.inspectionNotice.userId = localStorage.getItem("userId");
    this.inspectionNotice.manageUnitId = localStorage.getItem("manageUnitId");
    this.inspectionNotice.inspectorNotice.replyUserID = localStorage.getItem("userId");
    this.inspectionNotice.inspectorNotice.replyUserName = localStorage.getItem("name");
  }

  submit() {
    if (!this.inspectionNotice.inspectorNotice.replyContent) {
      this.pageService.showErrorMessage('请输入回复内容！');
      return;
    }

    this.pageService.showLoading("提交中...");

    this.apiService.sendApi(new PostInspectorNoticeReply(this.inspectionNotice)).subscribe(
      res => {
        this.pageService.dismissLoading();
        if (res.success) {
          this.inspectionNotice = res.data;
          this.pageService.showMessage('提交成功!');
          this.close();
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.dismissLoading();
        this.pageService.showErrorMessage(error);
      })
  }

  close() {
    this.viewCtrl.dismiss(this.inspectionNotice);
  }
}
