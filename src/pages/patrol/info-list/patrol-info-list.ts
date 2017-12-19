import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetPatrolInfoList } from './../../../apis/patrol/get-patrol-info-list.api';
import { PatrolInfoSearch, PatrolInfoSearchDataSource } from './../../../models/patrol/patrol-info.model';
import { EnumSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-patrol-info-list',
  templateUrl: 'patrol-info-list.html',
})
export class PatrolInfoListPage extends PagingListPage {
  private culturalRelicID: string;

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
    super(navCtrl, modalCtrl, file, fileTransfer, apiService, pageService, systemConst, "patrolSearchDataSource", "patrolInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetPatrolInfoList()
    this.condition = new PatrolInfoSearch();
    this.conditionDataSource = new PatrolInfoSearchDataSource();
    this.dataList = [];

    //初始化本页面参数
    this.culturalRelicID = this.navParams.data.culturalRelicID;

    //初始化查询条件
    this.condition.isDefaultSearch = true;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));
    this.condition.appRole = eval(localStorage.getItem("appRole"));
    console.log(this.condition);
    if (this.culturalRelicID) {
      this.condition.culturalRelicID = this.culturalRelicID;
    }
    console.log(this.condition);

    //查询首页数据
    this.nextPage(null);
  }

  view(culturalRelicID: string) {
    this.navCtrl.push('PatrolInfoDetailPage', culturalRelicID);
  }

  add() {
    this.navCtrl.push('PatrolInfoEditPage');
  }

  edit(culturalRelicID: string) {
    this.navCtrl.push('PatrolInfoEditPage', culturalRelicID);
  }

  delete(culturalRelicID: string) { }
}