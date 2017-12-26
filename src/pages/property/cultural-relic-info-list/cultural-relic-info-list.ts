import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetCulturalRelicInfoList } from './../../../apis/property/get-cultural-relic-info-list.api';
import { GetCulturalRelicInfo } from './../../../apis/property/get-cultural-relic-info.api';
import { DeleteCulturalRelicInfo } from './../../../apis/property/delete-cultural-relic-info.api';
import { CulturalRelicInfo, UPGetCulturalRelicInfos, CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { EnumCulturalRelicLevel, EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-cultural-relic-info-list',
  templateUrl: 'cultural-relic-info-list.html',
})
export class CulturalRelicInfoListPage extends PagingListPage {
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
    super(navCtrl, modalCtrl, file, fileTransfer, apiService, pageService, systemConst, "culturalRelicInfoSearchDataSource", "culturalRelicInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetCulturalRelicInfoList()
    this.condition = new CulturalRelicInfoSearch();
    this.conditionDataSource = new CulturalRelicInfoSearchDataSource();
    this.dataList = [];

    //初始化查询条件
    this.condition.isDefaultSearch = true;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));
    let longitude = localStorage.getItem('longitude');
    if (longitude) {
      this.condition.currentLongitude = Number(longitude);
    }
    let latitude = localStorage.getItem('latitude');
    if (latitude) {
      this.condition.currentLatitude = Number(latitude);
    }
    this.condition.culturalRelicSearchType = EnumCulturalRelicSearchType.不可移动文物;

    //查询首页数据
    this.nextPage(null);
  }

  getCulturalRelicLevelName(culturalRelicLevel: number): string {
    return EnumCulturalRelicLevel[culturalRelicLevel];
  }

  view(culturalRelicID: string) {
    this.navCtrl.push('CulturalRelicInfoDetailPage', culturalRelicID);
  }

  hold(culturalRelicInfo: CulturalRelicInfo) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '操作',
      buttons: [
        { text: '编辑', handler: () => { this.edit(culturalRelicInfo); } },
        { text: '删除', handler: () => { this.delete(culturalRelicInfo); } },
        { text: '取消', role: 'cancel', handler: () => { } }
      ]
    });
    actionSheet.present();
  }

  add() {
    let modal = this.modalCtrl.create('CulturalRelicInfoEditPage', { "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(culturalRelicId => {
      if (culturalRelicId) {
        this.apiService.sendApi(new GetCulturalRelicInfo(culturalRelicId)).subscribe(
          res => {
            if (res.success) {
              let culturalRelicInfo: CulturalRelicInfo = res.data;
              culturalRelicInfo.upCulturalRelic = new UPGetCulturalRelicInfos();
              culturalRelicInfo.upCulturalRelic.culturalRelicID = res.data.culturalRelic.keyID;
              culturalRelicInfo.upCulturalRelic.culturalRelicLevel = res.data.culturalRelic.culturalRelicLevel;
              culturalRelicInfo.upCulturalRelic.culturalRelicName = res.data.culturalRelic.culturalRelicName;
              culturalRelicInfo.upCulturalRelic.culturalRelicType = res.data.culturalRelic.culturalRelicType;
              culturalRelicInfo.upCulturalRelic.culturalRelicTwoStageType = res.data.culturalRelic.culturalRelicTwoStageType;
              culturalRelicInfo.upCulturalRelic.district = res.data.culturalRelic.district;
              culturalRelicInfo.upCulturalRelic.districtName = res.data.culturalRelic.districtName;
              culturalRelicInfo.upCulturalRelic.enumArea = res.data.culturalRelic.enumArea;
              culturalRelicInfo.upCulturalRelic.remark = res.data.culturalRelic.remark;
              this.dataList.unshift(culturalRelicInfo);
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

  edit(culturalRelicInfo: CulturalRelicInfo) {
    let modal = this.modalCtrl.create('CulturalRelicInfoEditPage', { "culturalRelicInfo": culturalRelicInfo, "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(culturalRelicId => {
      if (culturalRelicId) {
        this.apiService.sendApi(new GetCulturalRelicInfo(culturalRelicId)).subscribe(
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

  delete(culturalRelic: CulturalRelicInfo) {
    this.pageService.showComfirmMessage("确定要删除吗？", () => {
      this.apiService.sendApi(new DeleteCulturalRelicInfo(culturalRelic.upCulturalRelic.culturalRelicID, localStorage.getItem("userId"))).subscribe(
        res => {
          if (res.success) {
            this.pageService.showMessage("删除成功！");

            let tempArray = [];
            for (let data of this.dataList) {
              if (data.upCulturalRelic.culturalRelicID != culturalRelic.upCulturalRelic.culturalRelicID) {
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
