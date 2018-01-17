import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { EnumMessageCenterType, EnumMessageCenterReadState } from './../../../models/enum';
import { ApiService } from './../../../services/api.service';
import { SetMessageStatus } from './../../../apis/self/set-message-status.api';
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
    if (this.navParams.data.readState == EnumMessageCenterReadState["未阅"]) {
      let readStauts = EnumMessageCenterReadState["已阅"];
      this.apiService.sendApi(new SetMessageStatus(this.navParams.data.msgCenterID, localStorage.getItem("userId"),readStauts)).subscribe(
        res => {
          if (res.success) {
            
          } else {
            this.pageService.showErrorMessage(res.reason);
          }
        },
        error => {
          this.pageService.showErrorMessage(error);
        });
    }
  }

  detail() {
    switch (this.messageCenterEntity.messageType) {
      case EnumMessageCenterType["督察令通知"]:
        this.navCtrl.push("InspectionNoticeDetailPage", { "keyID": this.navParams.data.businessID });
        break;
      case EnumMessageCenterType["督察令回复"]:
        this.navCtrl.push('InspectionNoticeDetailPage', { "keyID": this.navParams.data.businessID });
        break;
      case EnumMessageCenterType["巡查自动预警"]:
        this.navCtrl.push('PatrolInfoListPage', { "culturalRelicID": this.navParams.data.businessID });
        break;
      case EnumMessageCenterType["通知公告"]:
        this.navCtrl.push('NoticeMessageCenterPage', { "keyID": this.navParams.data.businessID });
        break;
      case EnumMessageCenterType["巡查处理"]:

        break;

      default:
        this.pageService.showMessage("请到PC端处理或查看详情！");
    }
  }

  close() {
    this.navCtrl.pop();
   }
}
