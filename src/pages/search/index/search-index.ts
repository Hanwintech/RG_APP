import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Platform } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetCaseInputInfos } from './../../../apis/search/get-case-input-infos.api';
import { CaseInfoSearch, CaseInfoSearchDataSource } from './../../../models/search/case-info-search.model';
import { CaseInputInfo } from './../../../models/search/case-input-info';
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
    super(navCtrl, modalCtrl, actionSheetCtrl, file, fileTransfer, apiService, pageService, systemConst, "CaseInfoSearchDataSource", "CaseInfoSearch");

    this.hasCase = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.SearchLaw);
    this.hasPatrol = super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.SearchPatrol);

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetCaseInputInfos();
    this.condition = new CaseInfoSearch();
    this.conditionDataSource = new CaseInfoSearchDataSource();
    this.dataList = [];

    //初始化查询字段
    this.condition = new CaseInfoSearch();
    this.condition.isDefaultSearch = true;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;

    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));
    this.condition.culturalRelicID = localStorage.getItem("culturalRelicID");

    //查询首页数据
    this.nextPage(null);
  }

  ionViewDidEnter() {
    let searchDefaultPage = this.navCtrl.parent.viewCtrl.instance.searchDefaultPage;
    if (searchDefaultPage == 1 && this.hasPatrol) {
      this.statistics = "inspect";
    } else if (this.hasCase) {
      this.statistics = "cases";
    } else {
      this.statistics = "culturalRelic";
    }
  }
  Statistics(listType: number) {
    this.navCtrl.push("SearchStatisticsPage", listType);
  }
  inspectStatistics(listType: number) {
    this.navCtrl.push("InspectStatisticsPage", listType);
  }
}
