import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { GetUnreadMessageCountInfo } from './../../../apis/self/get-unread-message-count-info.api';
import { EnumAppRole, EnumMessageShowType } from './../../../models/enum'
import { MessageCenterUnreadInfo } from './../../../models/self/message-center-unread-info.model';
import { BasePage } from "./../../../base-pages/base-page";

@IonicPage()
@Component({
  selector: 'page-self-index',
  templateUrl: 'self-index.html',
})
export class SelfIndexPage extends BasePage {
  private manageUnitName: string;
  private userName: string;

  private hasCulturalRelicTwoLine: boolean;
  private hasAllTodo: boolean;
  private hasInspectionNotice: boolean;
  private hasNotice: boolean;
  private hasMessageCenter: boolean;
  private hasPatrolAdd: boolean;
  private hasPatrolOnline: boolean;
  private hasMoveableStatistic: boolean;
  private hasPatrolStatistic: boolean;
  private hasPublicOpinion: boolean;

  private allTodoBadge: number;
  private inspectionNoticeBadge: number;
  private noticeBadge: number;
  private messageCenterBadge: number;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public statusBar: StatusBar,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.manageUnitName = localStorage.getItem('manageUnitName');
    this.userName = localStorage.getItem('name');

    this.hasCulturalRelicTwoLine = false;
    this.hasAllTodo = false;
    this.hasInspectionNotice = false;
    this.hasNotice = false;
    this.hasMessageCenter = false;
    this.hasPatrolAdd = false;
    this.hasPatrolOnline = false;
    this.hasMoveableStatistic = false;
    this.hasPatrolStatistic = false;
    this.hasPublicOpinion = false;

    // 地级市、区级管理员、巡查录入人员
    if (super.hasRole(EnumAppRole.Patrol)) {
      this.hasCulturalRelicTwoLine = true;
      this.hasAllTodo = true;
      this.hasInspectionNotice = true;
      this.hasNotice = true;
      this.hasMessageCenter = true;
      this.hasPatrolAdd = true;
      this.hasPatrolOnline = true;
      this.hasMoveableStatistic = true;
      this.hasPatrolStatistic = true;
      this.hasPublicOpinion = true;
    }

    // 巡查数据查看人员
    if (super.hasRole(EnumAppRole.SearchPatrol)) {
      this.hasCulturalRelicTwoLine = true;
      this.hasAllTodo = true;
      this.hasInspectionNotice = true;
      this.hasNotice = true;
      this.hasMessageCenter = true;
      this.hasPatrolOnline = true;
      this.hasMoveableStatistic = true;
      this.hasPatrolStatistic = true;
      this.hasPublicOpinion = true;
    }

    // 志愿者 文保员 志愿者管理员
    if (super.hasRole(EnumAppRole.Volunteer)) {
      this.hasCulturalRelicTwoLine = true;
      this.hasPatrolAdd = true;
      this.hasPatrolOnline = true;
    }
    setInterval(() => {
      this.GetUnreadMsgCountInfo();
    }, 60000);
  }

  ionViewWillEnter() {
    this.statusBar.backgroundColorByHexString("#5d2102");
    this.GetUnreadMsgCountInfo();
  }

  ionViewDidLeave() {
    this.statusBar.backgroundColorByHexString("#2ead8c");
  }

  GetUnreadMsgCountInfo() {
    let unreadMessageCountInfo = new MessageCenterUnreadInfo();
    unreadMessageCountInfo.userId = localStorage.getItem("userId");
    unreadMessageCountInfo.manageUnitId = localStorage.getItem("manageUnitId");
    unreadMessageCountInfo.userType = Number(localStorage.getItem("userType"));
    unreadMessageCountInfo.messageShowTypeList = [
      { "key": EnumMessageShowType.待办事宜, "value": -1 },
      { "key": EnumMessageShowType.消息中心, "value": -1 },
      { "key": EnumMessageShowType.督察通知, "value": -1 },
      { "key": EnumMessageShowType.通知公告, "value": -1 }
    ];

    this.apiService.sendApi(new GetUnreadMessageCountInfo(unreadMessageCountInfo)).subscribe(
      res => {
        if (res.success) {
          for (let kvp of res.data.messageShowTypeList) {
            switch (kvp.key) {
              case EnumMessageShowType.待办事宜:
                this.allTodoBadge = kvp.value;
                break;
              case EnumMessageShowType.消息中心:
                this.messageCenterBadge = kvp.value;
                break;
              case EnumMessageShowType.督察通知:
                this.inspectionNoticeBadge = kvp.value;
                break;
              case EnumMessageShowType.通知公告:
                this.noticeBadge = kvp.value;
                break;
              default:
                break;
            }
          }
        } else {
          this.pageService.dismissLoading();
        }
        this.pageService.dismissLoading();
      },
      error => {
        this.pageService.dismissLoading();
      });
  }

  editInfo() {
    this.navCtrl.push("SelfEditInfoPage");
  }

  culturalRelicInfoList() {
    this.navCtrl.push("CulturalRelicInfoListPage");
  }

  museumInfoList() {
    this.navCtrl.push("MuseumInfoListPage");
  }

  constructionSiteList() {
    this.navCtrl.push("ConstructionSiteInfoListPage");
  }

  culturalRelicMap() {
    this.navCtrl.push("CulturalRelicMapPage");
  }

  culturalRelicTwoLine() {
    this.navCtrl.push("TwoLinePage");
  }

  allTodo() {
    this.navCtrl.push("MessageCenterInfoListPage", { "messageShowType": EnumMessageShowType.待办事宜 });
  }

  inspectionNotice() {
    this.navCtrl.push("InspectionNoticeListPage");
  }

  notice() {
    this.navCtrl.push("NoticeListPage");
  }

  messageCenter() {
    this.navCtrl.push("MessageCenterInfoListPage", { "messageShowType": EnumMessageShowType.消息中心 });
  }

  patrolAdd() {
    this.navCtrl.push("PatrolInfoEditPage");
  }

  patrolOnline() {
    this.navCtrl.parent.viewCtrl.instance.showPatrolOnline();
  }

  moveableStatistic() {
    this.navCtrl.parent.viewCtrl.instance.showMoveableStatistic();
  }

  patrolStatistic() {
    this.navCtrl.parent.viewCtrl.instance.showPatrolStatistic();
  }

  publicOpinion() {
    this.navCtrl.push("PublicOpinionInfoPage");
  }
}
