import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { ListPage } from './../../../BasePage/list-page';
import { GetPublicOpinionInfoList } from './../../../apis/self/get-public-opinion-info-list.api';
import { UVPublicOpinion, PublicOpinionInfoSearch, PublicOpinionInfoSearchDataSource } from './../../../models/self/public-opinion-info.model';
import { EnumSearchType, EnumPublicOpinionShowType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-public-opinion-info-list',
  templateUrl: 'public-opinion-info-list.html',
})
export class PublicOpinionInfoListPage extends ListPage {
  private pageTitle: string;
  private showType: EnumPublicOpinionShowType;
  private search: PublicOpinionInfoSearch;
  private searchDataSource: PublicOpinionInfoSearchDataSource;
  private datasource: UVPublicOpinion[];

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

    this.showType = this.navParams.data;
    this.pageTitle = EnumPublicOpinionShowType[this.showType];

    this.search = new PublicOpinionInfoSearch();
    this.search.isDefaultSearch = true;
    this.search.isNeedPaging = true;
    this.search.searchType = EnumSearchType.All;
    this.search.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));
    this.search.publicOpinionShowType = <number>this.showType;

    this.datasource = [];

    this.nextPage(null);
  }

  nextPage(event) {
    this.search.pageIndex = this.nextPageIndex++;
    this.doSearch(event, false);
  }

  doSearch(event, isNewSearch) {
    this.apiService.sendApi(new GetPublicOpinionInfoList(this.search)).subscribe(
      res => {
        if (res.success) {
          if (isNewSearch) {
            this.datasource = [];
            this.nextPageIndex = 0;
          }
          this.searchDataSource = res.data.searchDataSource;
          //获取新一页的数据
          let temp: UVPublicOpinion[] = res.data.publicOpinionInfoList ? res.data.publicOpinionInfoList : [];
          for (let cr of temp) {
            this.datasource.push(cr);
          }
          console.log(this.searchDataSource);
          console.log(this.datasource);

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
    super.showConditionalSearchPage('PublicOpinionSearchPage', { "search": this.search, "dataSource": this.searchDataSource })
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

  view(entity: UVPublicOpinion) {
    this.navCtrl.push('PublicOpinionInfoDetailPage', entity);
  }
}
