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
import { LawFileInfo } from './../../../models/search/law-file-infos.model';
import { EnumAppRole, EnumSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-other-statistics',
  templateUrl: 'other-statistics.html',
})
export class OtherStatisticsPage extends PagingListPage  {

  private statistics: string;
  private hasCase: boolean;
  private hasPatrol: boolean;
  private seflPageToSearch: boolean;
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
    public systemConst: SystemConst) {
    super(navCtrl, modalCtrl, actionSheetCtrl, file, fileTransfer, apiService, pageService, systemConst, "", "lawFileInfoList");

    this.hasCase = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.SearchLaw);
    this.hasPatrol = super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.SearchPatrol);

  }

  ionViewWillEnter() {
    this.statistics = "laws";
    this.changeSegment("laws");
  }

  changeSegment(segValue) {
    this.statistics = segValue;
    if (segValue == 'laws') {
      //初始化父类参数
      this.api = new GetLawFileInfos();
      this.condition = new LawFileInfoSearch();

      //初始化查询字段
      this.condition.isDefaultSearch = true;
      this.condition.isNeedPaging = true;
      this.condition.searchType = EnumSearchType.All;
      this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
      this.condition.FileType = 1;

      this.condition.userId = localStorage.getItem("userId");
      this.condition.manageUnitId = localStorage.getItem("manageUnitId");
      this.condition.userType = Number(localStorage.getItem("userType"));

      //查询首页数据
      this.nextPageIndex = 0;
      this.isLastPage = false;
      this.dataList = [];
      this.nextPage(null);

    } else if (segValue == 'license') {
      //初始化父类参数
      this.api = new GetLawFileInfos();
      this.condition = new LawFileInfoSearch();

      //初始化查询字段
      this.condition.isDefaultSearch = true;
      this.condition.isNeedPaging = true;
      this.condition.searchType = EnumSearchType.All;
      this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
      this.condition.FileType = 3;

      this.condition.userId = localStorage.getItem("userId");
      this.condition.manageUnitId = localStorage.getItem("manageUnitId");
      this.condition.userType = Number(localStorage.getItem("userType"));

      //查询首页数据
      this.nextPageIndex = 0;
      this.isLastPage = false;
      this.dataList = [];
      this.nextPage(null);

    }
  }



  Statistics(listType: number) {
    this.navCtrl.push("SearchStatisticsPage", listType);
  }
  view(lawFileInfo: LawFileInfo) {
    this.pageService.showLoading("正在加载");
    this.navCtrl.push("LawFileDetailPage", lawFileInfo);
  }
}
