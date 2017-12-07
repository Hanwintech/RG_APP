import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { GetMuseumInfoList } from './../../../apis/property/get-museum-info-list.api';
import { MuseumInfo, MuseumInfoSearch, MuseumInfoSearchDataSource } from './../../../models/property/museum-info.model';
import { EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-museum-info-list',
  templateUrl: 'museum-info-list.html',
})
export class MuseumInfoListPage {
  private nextPageIndex: number;
  private search: MuseumInfoSearch;
  private searchDataSource: MuseumInfoSearchDataSource;
  private datasource: MuseumInfo[];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private pageService: PageService,
    private systemConst: SystemConst
  ) {
    this.pageService.showLoading("数据加载中...");

    this.nextPageIndex = this.systemConst.DEFAULT_PAGE_INDEX;

    this.search = new MuseumInfoSearch();
    this.search.isDefaultSearch = true;
    this.search.isNeedPaging = true;
    this.search.searchType = EnumSearchType.All;
    this.search.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));
    let longitude = localStorage.getItem('longitude');
    if (longitude) {
      this.search.currentLongitude = Number(longitude);
    }
    let latitude = localStorage.getItem('latitude');
    if (latitude) {
      this.search.currentLatitude = Number(latitude);
    }
    this.search.searchType = EnumCulturalRelicSearchType.博物馆;

    this.datasource = [];

    this.nextPage(null);
  }

  nextPage(event) {
    this.search.pageIndex = this.nextPageIndex++;
    this.doSearch(event, false);
  }

  doSearch(event, isNewSearch) {
    this.apiService.sendApi(new GetMuseumInfoList(this.search)).subscribe(
      res => {
        if (res.success) {
          if (isNewSearch) {
            this.datasource = [];
            this.nextPageIndex = 0;
          }
          this.searchDataSource = res.data.museumInfoSearchDataSource;
          
          //获取新一页的数据
          let temp: MuseumInfo[] = res.data.museumInfoList ? res.data.museumInfoList : [];
          for (let cr of temp) { 
            this.datasource.push(cr);
          }

          //控制瀑布流控件状态
          if (event) {
            if (res.data.isLastPage) {
              event.enable(false);
            } else {
              event.complete();
            }
          }
        } else {
          if (event) {
            event.enable(false);
          }
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        if (event) {
          event.enable(false);
        }
        this.pageService.showErrorMessage(error);
      });
  }

  showSimpleSearch() {
    let searchModal = this.modalCtrl.create('CommonSimpleSearchPage', { "keyWord": this.search.keyword });
    searchModal.onDidDismiss(data => {
      if (data.needSearch) {
        this.search.isDefaultSearch = true;
        this.search.keyword = data.keyWord;
        this.doSearch(null, true);
      }
    });
    searchModal.present();
  }

  showSearch() {
    let searchModal = this.modalCtrl.create('MuseumSearchPage', { "search": this.search, "dataSource": this.searchDataSource });
    searchModal.onDidDismiss(data => {
      if (data.needSearch) {
        this.search.isDefaultSearch = false;
        this.search = data.search;
        console.log(this.search);
        this.doSearch(null, true);
      }
    });
    searchModal.present();
  }

  view(museumID: string) {
    this.navCtrl.push('MuseumInfoDetailPage', museumID);
  }

  add() {
    this.navCtrl.push('MuseumInfoEditPage');
  }

  edit(museumID: string) {
    this.navCtrl.push('MuseumInfoEditPage', museumID);
  }

  delete(museumID: string) { }
}
