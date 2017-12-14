import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetCulturalRelicInfoList } from './../../../apis/property/get-cultural-relic-info-list.api';
import { CulturalRelicInfo, CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { EnumCulturalRelicLevel, EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-construction-site-info-list',
  templateUrl: 'construction-site-info-list.html',
})
export class ConstructionSiteInfoListPage extends PagingListPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService,
    public systemConst: SystemConst
  ) {
    super(navCtrl, modalCtrl, file, fileTransfer, apiService, pageService, systemConst, "culturalRelicInfoSearchDataSource", "culturalRelicInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetCulturalRelicInfoList()
    this.condition = new CulturalRelicInfoSearch();
    this.conditionDataSource = new CulturalRelicInfoSearchDataSource();
    this.dataList = [];

    //初始化查询条件
    this.condition.isDefaultSearch = false;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));
    this.condition.area = this.systemConst.EMPTY_INTEGER;
    this.condition.district = this.systemConst.EMPTY_INTEGER;
    this.condition.culturalRelicType = this.systemConst.EMPTY_INTEGER;
    this.condition.culturalRelicTwoStageType = this.systemConst.EMPTY_INTEGER;
    this.condition.mapLabelStatus = this.systemConst.EMPTY_INTEGER;
    this.condition.coordinateAccurate = this.systemConst.EMPTY_INTEGER;
    this.condition.culturalRelicLevel = <number>EnumCulturalRelicLevel.工地;
    let longitude = localStorage.getItem('longitude');
    if (longitude) {
      this.condition.currentLongitude = Number(longitude);
    }
    let latitude = localStorage.getItem('latitude');
    if (latitude) {
      this.condition.currentLatitude = Number(latitude);
    }
    this.condition.culturalRelicSearchType = EnumCulturalRelicSearchType.工地;

    //查询首页数据
    this.nextPage(null);
  }

  getCulturalRelicLevelName(culturalRelicLevel: number): string {
    return EnumCulturalRelicLevel[culturalRelicLevel];
  }

  view(constructionSiteID: string) {
    this.navCtrl.push('ConstructionSiteInfoDetailPage', constructionSiteID);
  }

  add() { }

  edit(constructionSiteID: string) { }

  delete(constructionSiteID: string) { }
}
