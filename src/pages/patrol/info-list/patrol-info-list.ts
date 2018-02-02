import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetPatrolInfoList, GetPatrolInfo } from './../../../apis/patrol/patrol-info.api';
import { PatrolInfoDetails, PatrolInfoSearch, PatrolInfoSearchDataSource } from './../../../models/patrol/patrol-info.model';
import { EnumAppRole, EnumSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';
import { Console } from '@angular/core/src/console';

@IonicPage()
@Component({
  selector: 'page-patrol-info-list',
  templateUrl: 'patrol-info-list.html',
})
export class PatrolInfoListPage extends PagingListPage {
  private canAdd: boolean;
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

    this.canAdd = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.Volunteer);
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
    modal.onDidDismiss(patrolInfoId => {
      if (patrolInfoId) {
        this.apiService.sendApi(new GetPatrolInfo(patrolInfoId, localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
          res => {
            if (res.success) {
              let newItem: PatrolInfoDetails = res.data;
              this.dataList.unshift(newItem);
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
      }
    });
    modal.present();
  }

  disposePatrol(data){
    console.log(data);
    let disposePatrolPage = this.modalCtrl.create('PatrolInfoDetailPage', { "keyID": data.patrolInfo.keyID,"patrolReplay":true});
    disposePatrolPage.onDidDismiss(data => {
    
    });
    disposePatrolPage.present();
  }
}