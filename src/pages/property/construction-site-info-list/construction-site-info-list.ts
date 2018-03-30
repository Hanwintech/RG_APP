import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import * as CulturalRelicInfoAPI from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo, UPGetCulturalRelicInfos, CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { EnumAppRole, EnumCulturalRelicLevel, EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-construction-site-info-list',
  templateUrl: 'construction-site-info-list.html',
})
export class ConstructionSiteInfoListPage extends PagingListPage {
  public canAddCultural: boolean;

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
    super(navCtrl, modalCtrl, actionSheetCtrl, file, fileTransfer, apiService, pageService, systemConst, "culturalRelicInfoSearchDataSource", "culturalRelicInfoList");

    this.canAddCultural = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.Patrol);

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new CulturalRelicInfoAPI.GetCulturalRelicInfoList()
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

  defaultAdd = () => {
    let modal = this.modalCtrl.create('ConstructionSiteInfoEditPage', { "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(culturalRelicId => {
      if (culturalRelicId) {
        this.apiService.sendApi(new CulturalRelicInfoAPI.GetCulturalRelicInfo(culturalRelicId)).subscribe(
          res => {
            if (res.success) {
              let newItem: CulturalRelicInfo = res.data;
              newItem.upCulturalRelic = new UPGetCulturalRelicInfos();
              newItem.upCulturalRelic.culturalRelicID = res.data.culturalRelic.keyID;
              newItem.upCulturalRelic.culturalRelicLevel = res.data.culturalRelic.culturalRelicLevel;
              newItem.upCulturalRelic.culturalRelicName = res.data.culturalRelic.culturalRelicName;
              newItem.upCulturalRelic.culturalRelicType = res.data.culturalRelic.culturalRelicType;
              newItem.upCulturalRelic.culturalRelicTwoStageType = res.data.culturalRelic.culturalRelicTwoStageType;
              newItem.upCulturalRelic.district = res.data.culturalRelic.district;
              newItem.upCulturalRelic.districtName = res.data.culturalRelic.districtName;
              newItem.upCulturalRelic.enumArea = res.data.culturalRelic.enumArea;
              newItem.upCulturalRelic.remark = res.data.culturalRelic.remark;
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

  defaultModify = (dataItem: CulturalRelicInfo) => {
    let modal = this.modalCtrl.create('ConstructionSiteInfoEditPage', { "culturalRelicInfo": dataItem, "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(culturalRelicId => {
      if (culturalRelicId) {
        this.apiService.sendApi(new CulturalRelicInfoAPI.GetCulturalRelicInfo(culturalRelicId)).subscribe(
          res => {
            if (res.success) {
              for (let item of this.dataList) {
                if (item.upCulturalRelic.culturalRelicID == res.data.culturalRelic.keyID) {
                  item.enumAreaName = res.data.enumAreaName;
                  item.miniImage = res.data.miniImage;
                  item.miniImageUrl = res.data.miniImageUrl;
                  item.upCulturalRelic.culturalRelicLevel = res.data.culturalRelic.culturalRelicLevel;
                  item.upCulturalRelic.culturalRelicName = res.data.culturalRelic.culturalRelicName;
                  item.upCulturalRelic.culturalRelicType = res.data.culturalRelic.culturalRelicType;
                  item.upCulturalRelic.culturalRelicTwoStageType = res.data.culturalRelic.culturalRelicTwoStageType;
                  item.upCulturalRelic.district = res.data.culturalRelic.district;
                  item.upCulturalRelic.districtName = res.data.culturalRelic.districtName;
                  item.upCulturalRelic.enumArea = res.data.culturalRelic.enumArea;
                  item.upCulturalRelic.remark = res.data.culturalRelic.remark;
                  break;
                }
              }
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

  defaultDelete = (dataItem: CulturalRelicInfo) => {
    this.pageService.showComfirmMessage("确定要删除吗？", () => {
      this.apiService.sendApi(new CulturalRelicInfoAPI.DeleteCulturalRelicInfo(dataItem.upCulturalRelic.culturalRelicID, localStorage.getItem("userId"))).subscribe(
        res => {
          if (res.success) {
            this.pageService.showMessage("删除成功！");

            let tempArray = [];
            for (let data of this.dataList) {
              if (data.upCulturalRelic.culturalRelicID != dataItem.upCulturalRelic.culturalRelicID) {
                tempArray.push(data);
              }
            }
            this.dataList = tempArray;
          } else {
            this.pageService.showErrorMessage("删除失败！");
          }
        },
        error => {
          this.pageService.showErrorMessage(error);
        });
    }, () => { });
  }
}
