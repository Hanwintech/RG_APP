import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../BasePage/list-page';
import { GetNoticeInfoList } from './../../../apis/self/get-notice-info-list.api';
import { UVNoticeBasicInfo, NoticeInfoSearch, NoticeInfoSearchDataSource } from './../../../models/self/notice-info.model';
import { EnumSearchType, EnumMessageShowType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';


@IonicPage()
@Component({
  selector: 'page-notice-list',
  templateUrl: 'notice-list.html',
})
export class NoticeListPage extends PagingListPage {
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
    super(navCtrl, modalCtrl, file, fileTransfer, apiService, pageService, systemConst, "noticeInfoSearchDataSource", "noticeInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetNoticeInfoList()
    this.condition = new NoticeInfoSearch();
    this.conditionDataSource = new NoticeInfoSearchDataSource();
    this.dataList = [];

    //初始化查询条件
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

  view(messageCenterEntity: UVNoticeBasicInfo) {
    this.navCtrl.push('NoticeDetailPage', messageCenterEntity);
  }
}
