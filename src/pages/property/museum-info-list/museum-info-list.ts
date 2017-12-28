import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import * as MuseumAPI  from './../../../apis/property/museum.api';
import { MuseumInfo, MuseumInfoDetail, MuseumInfoSearch, MuseumInfoSearchDataSource } from './../../../models/property/museum-info.model';
import { EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-museum-info-list',
  templateUrl: 'museum-info-list.html',
})
export class MuseumInfoListPage extends PagingListPage {
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
    super(navCtrl, modalCtrl, actionSheetCtrl, file, fileTransfer, apiService, pageService, systemConst, "museumInfoSearchDataSource", "museumInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new MuseumAPI.GetMuseumInfoList()
    this.condition = new MuseumInfoSearch();
    this.conditionDataSource = new MuseumInfoSearchDataSource();
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
    this.condition.searchType = EnumCulturalRelicSearchType.博物馆;

    //查询首页数据
    this.nextPage(null);
  }

  defaultAdd = () => {
    let modal = this.modalCtrl.create('MuseumInfoEditPage', { "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(museumId => {
      if (museumId) {
        this.apiService.sendApi(new MuseumAPI.GetMuseumInfo(museumId)).subscribe(
          res => {
            if (res.success) {
               let newItem: MuseumInfo = res.data;
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

  defaultModify = (dataItem: MuseumInfo) => {
    let modal = this.modalCtrl.create('MuseumInfoEditPage', { "museumInfo": dataItem, "selectDataSource": this.conditionDataSource });
    modal.onDidDismiss(museumId => {
      if (museumId) {
        this.apiService.sendApi(new MuseumAPI.GetMuseumInfo(museumId)).subscribe(
          res => {
            if (res.success) {
              for (let i = 0; i < this.dataList.length; i++) {
                if (this.dataList[i].museumDetailInfo.id == res.data.museumDetailInfo.id) {
                  this.dataList[i] = res.data;
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

  defaultDelete = (dataItem: MuseumInfo) => {
    this.pageService.showComfirmMessage("确定要删除吗？", () => {
      this.apiService.sendApi(new MuseumAPI.DeleteMuseumInfo(dataItem.museumDetailInfo.id, localStorage.getItem("userId"))).subscribe(
        res => {
          if (res.success) {
            this.pageService.showMessage("删除成功！");

            let tempArray = [];
            for (let item of this.dataList) {
              if (item.museumDetailInfo.id != dataItem.museumDetailInfo.id) {
                tempArray.push(item);
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