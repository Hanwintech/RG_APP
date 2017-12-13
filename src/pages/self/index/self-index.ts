import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { EnumAreaCode, EnumMessageShowType } from './../../../models/enum'

@IonicPage()
@Component({
  selector: 'page-self-index',
  templateUrl: 'self-index.html',
})
export class SelfIndexPage {

  private areaName: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private apiService: ApiService
  ) {
    this.areaName = EnumAreaCode[this.apiService.areaCode];
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

  publicOpinion() {
    this.navCtrl.push("PublicOpinionInfoPage");
  }
}
