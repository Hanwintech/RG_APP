import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetInspectionNoticeInfoList } from './../../../apis/self/get-inspection-notice-info-list.api';
import { InspectionNoticeInfo, InspectionNoticeInfoSearch, InspectionNoticeInfoSearchDataSource } from './../../../models/self/inspection-notice-info.model';
import { EnumSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-inspection-notice-list',
  templateUrl: 'inspection-notice-list.html',
})
export class InspectionNoticeListPage extends PagingListPage {
  private segmentIndex: string;

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
    super(navCtrl, modalCtrl, file, fileTransfer, apiService, pageService, systemConst, "inspectorNoticeInfoSearchDataSource", "inspectorNoticeInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetInspectionNoticeInfoList()
    this.condition = new InspectionNoticeInfoSearch();
    this.conditionDataSource = new InspectionNoticeInfoSearchDataSource();
    this.dataList = [];

    //初始化本页面参数
    this.segmentIndex = "0";

    //初始化查询条件
    this.condition.isDefaultSearch = true;
    this.condition.isSend = false;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));

    this.nextPage(null);
  }

  segmentChanged(segmentEvent) {
    this.condition.isSend = (this.segmentIndex == "1");
    this.dataList = [];
    this.nextPage(null);
  }

  view(inspectorNotice: InspectionNoticeInfo) {
    this.navCtrl.push('InspectionNoticeDetailPage', inspectorNotice);
  }
}
