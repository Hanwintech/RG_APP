import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { EnumAppRole, EnumAreaCode, EnumMessageShowType } from './../../../models/enum'
import { BasePage } from "./../../../base-pages/base-page";

@IonicPage()
@Component({
  selector: 'page-self-index',
  templateUrl: 'self-index.html',
})
export class SelfIndexPage extends BasePage {
  private areaName: string;

  private hasCulturalRelicTwoLine: boolean;
  private hasAllTodo: boolean;
  private hasInspectionNotice: boolean;
  private hasNotice: boolean;
  private hasMessageCenter: boolean;
  private hasPatrolAdd: boolean;
  private hasPatrolOnline: boolean;
  private hasPatrolStatistic: boolean;
  private hasPublicOpinion: boolean;

  constructor(
    public navCtrl: NavController,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.areaName = EnumAreaCode[this.apiService.areaCode];

    this.hasCulturalRelicTwoLine = false;
    this.hasAllTodo = false;
    this.hasInspectionNotice = false;
    this.hasNotice = false;
    this.hasMessageCenter = false;
    this.hasPatrolAdd = false;
    this.hasPatrolOnline = false;
    this.hasPatrolStatistic = false;
    this.hasPublicOpinion = false;

    if (super.hasRole(EnumAppRole.Patrol)) {
      this.hasCulturalRelicTwoLine = true;
      this.hasAllTodo = true;
      this.hasInspectionNotice = true;
      this.hasNotice = true;
      this.hasMessageCenter = true;
      this.hasPatrolAdd = true;
      this.hasPatrolOnline = true;
      this.hasPatrolStatistic = true;
      this.hasPublicOpinion = true;
    }

    if (super.hasRole(EnumAppRole.SearchPatrol)) {
      this.hasCulturalRelicTwoLine = true;
      this.hasAllTodo = true;
      this.hasInspectionNotice = true;
      this.hasNotice = true;
      this.hasMessageCenter = true;
      this.hasPatrolOnline = true;
      this.hasPatrolStatistic = true;
      this.hasPublicOpinion = true;
    }

    if (super.hasRole(EnumAppRole.Volunteer)) {
      this.hasCulturalRelicTwoLine = true;
      this.hasPatrolAdd = true;
      this.hasPatrolOnline = true;
      this.hasPublicOpinion = true;
    }
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
    this.navCtrl.push("TwoLinePage", { "title": "文物地图" });
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
    // let modal = this.modalCtrl.create('PatrolInfoEditPage', { "selectDataSource": this.conditionDataSource });
    // modal.onDidDismiss(patrolInfoId => {
    //   if (patrolInfoId) {
    //     this.apiService.sendApi(new GetPatrolInfo(patrolInfoId, localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
    //       res => {
    //         if (res.success) {
    //           let newItem: PatrolInfoDetails = res.data;
    //           this.dataList.unshift(newItem);
    //         } else {
    //           this.pageService.showErrorMessage(res.reason);
    //         }
    //       },
    //       error => {
    //         this.pageService.showErrorMessage(error);
    //       });
    //   }
    // });
    // modal.present();
  }

  patrolOnline() {
    this.navCtrl.parent.viewCtrl.instance.showPatrolOnline();
  }

  patrolStatistic() {
    this.navCtrl.parent.viewCtrl.instance.showPatrolStatistic();
  }

  publicOpinion() {
    this.navCtrl.push("PublicOpinionInfoPage");
  }
}
