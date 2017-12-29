import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
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
    public actionSheetCtrl: ActionSheetController,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService,
    public systemConst: SystemConst
  ) {
    super(navCtrl, modalCtrl, actionSheetCtrl, file, fileTransfer, apiService, pageService, systemConst, "patrolSearchDataSource", "patrolInfoList");

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
    if (this.culturalRelicID) {
      this.condition.culturalRelicID = this.culturalRelicID;
    }

    //查询首页数据
    this.nextPage(null);
  }

  defaultAdd = () => {
    let modal = this.modalCtrl.create('PatrolInfoEditPage', { "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(culturalRelicId => {
      // if (culturalRelicId) {
      //   this.apiService.sendApi(new GetCulturalRelicInfo(culturalRelicId)).subscribe(
      //     res => {
      //       if (res.success) {
      //         let newItem: CulturalRelicInfo = res.data;
      //         newItem.upCulturalRelic = new UPGetCulturalRelicInfos();
      //         newItem.upCulturalRelic.culturalRelicID = res.data.culturalRelic.keyID;
      //         newItem.upCulturalRelic.culturalRelicLevel = res.data.culturalRelic.culturalRelicLevel;
      //         newItem.upCulturalRelic.culturalRelicName = res.data.culturalRelic.culturalRelicName;
      //         newItem.upCulturalRelic.culturalRelicType = res.data.culturalRelic.culturalRelicType;
      //         newItem.upCulturalRelic.culturalRelicTwoStageType = res.data.culturalRelic.culturalRelicTwoStageType;
      //         newItem.upCulturalRelic.district = res.data.culturalRelic.district;
      //         newItem.upCulturalRelic.districtName = res.data.culturalRelic.districtName;
      //         newItem.upCulturalRelic.enumArea = res.data.culturalRelic.enumArea;
      //         newItem.upCulturalRelic.remark = res.data.culturalRelic.remark;
      //         this.dataList.unshift(newItem);
      //       } else {
      //         this.pageService.showErrorMessage(res.reason);
      //       }
      //     },
      //     error => {
      //       this.pageService.showErrorMessage(error);
      //     });
      // }
    });
    modal.present();
  }
}