import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetPublicOpinionInfoList } from './../../../apis/self/get-public-opinion-info-list.api';
import { UVPublicOpinion, PublicOpinionInfoSearch, PublicOpinionInfoSearchDataSource } from './../../../models/self/public-opinion-info.model';
import { EnumSearchType, EnumPublicOpinionShowType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-public-opinion-info-list',
  templateUrl: 'public-opinion-info-list.html',
})
export class PublicOpinionInfoListPage extends PagingListPage {
  private pageTitle: string;
  private showType: EnumPublicOpinionShowType;

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
    super(navCtrl, modalCtrl, file, fileTransfer, apiService, pageService, systemConst, "searchDataSource", "publicOpinionInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetPublicOpinionInfoList()
    this.condition = new PublicOpinionInfoSearch();
    this.conditionDataSource = new PublicOpinionInfoSearchDataSource();
    this.dataList = [];

    //初始化本页面参数
    this.showType = this.navParams.data;
    this.pageTitle = EnumPublicOpinionShowType[this.showType];

    //初始化查询条件
    this.condition.isDefaultSearch = true;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));
    this.condition.publicOpinionShowType = <number>this.showType;

    //查询首页数据
    this.nextPage(null);
  }

  view(entity: UVPublicOpinion) {
    this.navCtrl.push('PublicOpinionInfoDetailPage', { "pageTitle": this.pageTitle, "url": entity.originalLink });
  }
}
