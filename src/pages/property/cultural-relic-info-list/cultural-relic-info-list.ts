import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { GetCulturalRelicInfoList } from './../../../apis/property/get-cultural-relic-info-list.api';
import { CulturalRelicInfo, CulturalRelicInfoSearch } from './../../../models/property/cultural-relic-info.model';
import { EnumCulturalRelicLevel, EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-cultural-relic-info-list',
  templateUrl: 'cultural-relic-info-list.html',
})
export class CulturalRelicInfoListPage {
  private nextPageIndex: number;
  private search: CulturalRelicInfoSearch;
  private datasource: CulturalRelicInfo[];

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private apiService: ApiService,
    private pageService: PageService,
    private systemConst: SystemConst
  ) {
    this.pageService.showLoading("数据加载中...");

    this.nextPageIndex = this.systemConst.DEFAULT_PAGE_INDEX;

    this.search = new CulturalRelicInfoSearch();
    this.search.isDefaultSearch = true;
    this.search.isNeedPaging = true;
    this.search.searchType = EnumSearchType.All;
    this.search.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));
    // this.search.setCurrentLongitude(CH_Application.getInstance().getCurrentLongitude());
    // this.search.setCurrentLatitude(CH_Application.getInstance().getCurrentLatitude());
    this.search.culturalRelicSearchType = EnumCulturalRelicSearchType.不可移动文物;

    this.datasource = [];

    this.nextPage(null);
  }

  nextPage(event) {
    this.search.pageIndex = this.nextPageIndex++;
    this.doSearch(event, false);
  }

  doSearch(event, isNewSearch) {
    this.apiService.sendApi(new GetCulturalRelicInfoList(this.search)).subscribe(
      res => {
        this.pageService.dismissLoading();
        if (res.success) {
          if (isNewSearch){
            this.datasource = [];
          }

          //获取新一页的数据
          let temp: CulturalRelicInfo[] = res.data.culturalRelicInfoList;
          for (let cr of temp) {
            this.datasource.push(cr);
          }

          //控制瀑布流控件状态
          if (event) {
            if (temp.length < this.search.pageSize) {
              event.enable(false);
            } else {
              event.complete();
            }
          }
        } else {
          this.pageService.showErrorMessage(res.reason);
          if (event) {
            event.enable(false);
          }
        }
      },
      error => {
        if (event) {
          event.enable(false);
        }
        this.pageService.dismissLoading();
        this.pageService.showErrorMessage(error);
      })
  }

  getCulturalRelicLevelName(culturalRelicLevel: number): string {
    return EnumCulturalRelicLevel[culturalRelicLevel];
  }

  showSimpleSearch() {
    this.navCtrl.push('CommonSimpleSearchPage');
  }
}
