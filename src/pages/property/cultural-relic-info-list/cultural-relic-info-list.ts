import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { ListPage } from './../../../BasePage/list-page';
import { GetCulturalRelicInfoList } from './../../../apis/property/get-cultural-relic-info-list.api';
import { CulturalRelicInfo, CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { EnumCulturalRelicLevel, EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-cultural-relic-info-list',
  templateUrl: 'cultural-relic-info-list.html',
})
export class CulturalRelicInfoListPage extends ListPage {
  private search: CulturalRelicInfoSearch;
  private searchDataSource: CulturalRelicInfoSearchDataSource;
  private datasource: CulturalRelicInfo[];

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
    super(navCtrl, modalCtrl, file, fileTransfer, pageService, systemConst);

    this.pageService.showLoading("数据加载中...");

    this.search = new CulturalRelicInfoSearch();
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
        if (res.success) {
          if (isNewSearch) {
            this.datasource = [];
            this.nextPageIndex = 0;
          }
          this.searchDataSource = res.data.culturalRelicInfoSearchDataSource;

          //获取新一页的数据
          let temp: CulturalRelicInfo[] = res.data.culturalRelicInfoList ? res.data.culturalRelicInfoList : [];
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

  getCulturalRelicLevelName(culturalRelicLevel: number): string {
    return EnumCulturalRelicLevel[culturalRelicLevel];
  }

  showSimpleSearch() {
    super.showKeywordSearchPage(this.search.keyword)
      .then(data => {
        if (data.needSearch) {
          this.search.isDefaultSearch = true;
          this.search.keyword = data.keyword;
          this.doSearch(null, true);
        }
      })
      .catch(error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showSearch() {
    super.showConditionalSearchPage('CulturalRelicSearchPage', { "search": this.search, "dataSource": this.searchDataSource })
      .then(data => {
        if (data.needSearch) {
          this.search.isDefaultSearch = false;
          this.search = data.search;
          this.doSearch(null, true);
        }
      })
      .catch(error => {
        this.pageService.showErrorMessage(error);
      });
  }

  view(culturalRelicID: string) {
    this.navCtrl.push('CulturalRelicInfoDetailPage', culturalRelicID);
  }

  add() {
    this.navCtrl.push('CulturalRelicInfoEditPage');
  }

  edit(culturalRelicID: string) {
    this.navCtrl.push('CulturalRelicInfoEditPage', culturalRelicID);
  }

  delete(culturalRelicID: string) { }
}
