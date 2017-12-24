import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetCulturalRelicInfoList } from './../../../apis/property/get-cultural-relic-info-list.api';
import { GetCulturalRelicInfo } from './../../../apis/property/get-cultural-relic-info.api';
import { DeleteCulturalRelicInfo } from './../../../apis/property/delete-cultural-relic-info.api';
import { CulturalRelicInfo, CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
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

  add() {
    let modal = this.modalCtrl.create('CulturalRelicInfoEditPage', { "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(data => {
      if (data) {
        this.apiService.sendApi(new GetCulturalRelicInfo(data.culturalRelic.keyID)).subscribe(
          res => {
            if (res.success) {
              this.dataList.unshift(res.data);
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
    modal.onDidDismiss(data => {
      if (data) {
        this.apiService.sendApi(new GetCulturalRelicInfo(data.culturalRelic.keyID)).subscribe(
          res => {
            if (res.success) {
              for (let item of this.dataList) {
                if (item.culturalRelic.keyID == res.data.culturalRelic.keyID) {
                  item = data;
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
              if (data.upCulturalRelic.attachmentId != culturalRelic.upCulturalRelic.culturalRelicID) {
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
