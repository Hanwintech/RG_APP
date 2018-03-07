import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { EnumMessageCenterType, EnumMessageCenterReadState, EnumInspectorNoticeState } from './../../../models/enum';
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
  private state: number;
  private viewDetail;
  private isDispose;
  private pageTitle;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);
    this.messageCenterEntity = this.navParams.data;
    this.viewDetail = this.messageCenterEntity.messageType == EnumMessageCenterType["巡查处理"] ? false : true;
    if (this.messageCenterEntity.messageType == EnumMessageCenterType["巡查处理"] || this.messageCenterEntity.messageType == EnumMessageCenterType["督察令通知"]) {
      this.pageTitle = "待办详情";
    }
    else{
      this.pageTitle="消息详情";
    }
  }

  detail() {
    switch (this.messageCenterEntity.messageType) {
      case EnumMessageCenterType["督察令通知"]:
        let InspectionNoticeDetailPage = this.modalCtrl.create('InspectionNoticeDetailPage', { "keyID": this.navParams.data.businessID, "segmentIndex": "0" });
        InspectionNoticeDetailPage.onDidDismiss(data => {
          if (data) {
            if (data.inspectorNotice.recordState == EnumInspectorNoticeState["已回复"]) {
              this.state = EnumMessageCenterReadState["已处理"];
              this.uploadStatus();
            }
            else {
              this.state = EnumMessageCenterReadState["已阅未处理"];
            }
          }
        });
        InspectionNoticeDetailPage.present();
        break;
      case EnumMessageCenterType["督察令回复"]:
        this.navCtrl.push('InspectionNoticeDetailPage', { "keyID": this.navParams.data.businessID });
        this.state = EnumMessageCenterReadState["已阅"];
        break;
      case EnumMessageCenterType["巡查自动预警"]:
        this.navCtrl.push('PatrolInfoListPage', { "culturalRelicID": this.navParams.data.businessID });
        this.state = EnumMessageCenterReadState["已阅"];
        break;
      case EnumMessageCenterType["通知公告"]:
        this.navCtrl.push('NoticeMessageCenterPage', { "keyID": this.navParams.data.businessID });
        this.state = EnumMessageCenterReadState["已阅"];
        break;
      case EnumMessageCenterType["巡查处理"]:
        let detailPage = this.modalCtrl.create('PatrolInfoDetailPage', { "keyID": this.navParams.data.businessID, "patrolReplay": true });
        detailPage.onDidDismiss(data => {
          this.isDispose = data;
          if (data) {
            this.state = EnumMessageCenterReadState["已处理"];
            this.uploadStatus();
          }
          else {
            this.state = EnumMessageCenterReadState["已阅未处理"];
          }
        });
        detailPage.present();
        break;

      default:
        this.pageService.showMessage("请到PC端处理或查看详情！");
    }
  }

  close() {
    this.setMessageStatu();
  }

  setMessageStatu() {
    //在没有打开详情页面的情况下，根据当页面的messageType,赋值messageCenterReadState;
    //产生此操作原因为，“代办事宜”和“消息中心”公用同一页面
    if (!this.state) {
      if (this.messageCenterEntity.messageType == EnumMessageCenterType["督察令通知"] || this.messageCenterEntity.messageType == EnumMessageCenterType["巡查处理"]) {
        this.state = EnumMessageCenterReadState["已阅未处理"];
      }
      else {
        this.state = EnumMessageCenterReadState["已阅"];
      }
    }
    this.uploadStatus();
  }

  uploadStatus() {
    if (this.navParams.data.readState == EnumMessageCenterReadState["未阅"] || this.navParams.data.readState == EnumMessageCenterReadState["已阅未处理"]) {
      this.apiService.sendApi(new SetMessageStatus(this.navParams.data.msgCenterID, localStorage.getItem("userId"), this.state)).subscribe(
        res => {
          if (res.success) {
            if (this.viewCtrl) {
              this.viewCtrl.dismiss(this.state);
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
    else{
      if (this.viewCtrl) {
        this.viewCtrl.dismiss(this.state);
      }
      else {
        this.navCtrl.pop();
      }
    }
  }
}
