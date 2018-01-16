import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { EnumMessageCenterType } from './../../../models/enum';
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
    console.log(this.navParams.data.businessID);
  }

  detail() {
    switch (this.messageCenterEntity.messageType) {
      case EnumMessageCenterType["督察令通知"]:

        break;
      case EnumMessageCenterType["督察令回复"]:
        this.navCtrl.push('InspectionNoticeAlreadyReplyPage',{ "keyID": this.navParams.data.businessID });
        break;
      case EnumMessageCenterType["巡查自动预警"]:
        this.navCtrl.push('PatrolInfoListPage', { "culturalRelicID": this.navParams.data.businessID });
        break;
      case EnumMessageCenterType["人员进出两线范围提醒"]:

        break;
      case EnumMessageCenterType["通知公告"]:
        this.navCtrl.push('NoticeMessageCenterPage',{ "keyID": this.navParams.data.businessID });
        break;
      case EnumMessageCenterType["巡查处理"]:

        break;

      default:
      // picsName = "ic_cultural_relic_level1_normal";
    }
  }

  close() { }
}
