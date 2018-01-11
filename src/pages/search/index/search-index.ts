import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Platform } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetLawFileInfos } from './../../../apis/search/get-law-file-infos.api';
import { LawFileInfoSearch } from './../../../models/search/law-file-info-search.model';
import { LawFileInfos } from './../../../models/search/law-file-infos.model';
import { EnumAppRole, EnumSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';
@IonicPage()
@Component({
  selector: 'page-search-index',
  templateUrl: 'search-index.html',
})
export class SearchIndexPage extends PagingListPage {
  private statistics: string;
  private hasCase: boolean;
  private hasPatrol: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService,
    public systemConst: SystemConst
  ) {
    super(navCtrl, modalCtrl, actionSheetCtrl, file, fileTransfer, apiService, pageService, systemConst, "", "lawFileInfoList");

    this.hasCase = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.SearchLaw);
    this.hasPatrol = super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.SearchPatrol);

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetLawFileInfos();
    this.condition = new LawFileInfoSearch();
    //this.conditionDataSource = new CaseInfoSearchDataSource();
    this.dataList = [];

    //初始化查询字段
    this.condition = new LawFileInfoSearch();
    this.condition.isDefaultSearch = true;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;

    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));

    //查询首页数据
    this.nextPage(null);
  }

  ionViewDidEnter() {
    let searchDefaultPage = this.navCtrl.parent.viewCtrl.instance.searchDefaultPage;
    if (searchDefaultPage == 0 && this.hasCase) {
      this.statistics = "cases";
    } else if (searchDefaultPage == 1 && this.hasPatrol) {
      this.statistics = "culturalRelic";
    } else if (searchDefaultPage == 2) {
      this.statistics = "culturalRelic";
    } else if (searchDefaultPage == 3) {
      this.statistics = "laws";
    } else if (this.hasCase) {
      this.statistics = "cases";
    } else {
      this.statistics = "culturalRelic";
    }
  }

  changeSegment(segIndex) {
    this.navCtrl.parent.viewCtrl.instance.searchDefaultPage = segIndex;
  }

  Statistics(listType: number) {
    this.navCtrl.push("SearchStatisticsPage", listType);
  }
  inspectStatistics(listType: number) {
    this.navCtrl.push("InspectStatisticsPage", listType);
  }
  culturalRelicStatistics(listType: number) {
    this.navCtrl.push("CulturalRelicStatisticsPage", listType);
  }
}
