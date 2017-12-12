import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { ListPage } from './../../../BasePage/list-page';
import { GetNoticeInfoList } from './../../../apis/self/get-notice-info-list.api';
import { UVNoticeBasicInfo,  NoticeInfoSearch, NoticeInfoSearchDataSource } from './../../../models/self/notice-info.model';
import { EnumSearchType, EnumMessageShowType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';


@IonicPage()
@Component({
  selector: 'page-notice-list',
  templateUrl: 'notice-list.html',
})
export class NoticeListPage extends ListPage {
  private search: NoticeInfoSearch;
  private searchDataSource: NoticeInfoSearchDataSource;
  private datasource: UVNoticeBasicInfo[];

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

    this.search = new NoticeInfoSearch();
    this.search.isDefaultSearch = true;
    this.search.isNeedPaging = true;
    this.search.searchType = EnumSearchType.All;
    this.search.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));

    this.datasource = [];

    this.nextPage(null);
  }

  nextPage(event) {
    this.search.pageIndex = this.nextPageIndex++;
    this.doSearch(event, false);
  }

  doSearch(event, isNewSearch) {
    this.apiService.sendApi(new GetNoticeInfoList(this.search)).subscribe(
      res => {
        if (res.success) {
          if (isNewSearch) {
            this.datasource = [];
            this.nextPageIndex = 0;
          }
          this.searchDataSource = res.data.noticeInfoSearchDataSource;
          //获取新一页的数据
          let temp: UVNoticeBasicInfo[] = res.data.noticeInfoList ? res.data.noticeInfoList : [];
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
    super.showConditionalSearchPage('NoticeSearchPage', { "search": this.search, "dataSource": this.searchDataSource })
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

  view(messageCenterEntity: UVNoticeBasicInfo) {
    this.navCtrl.push('NoticeDetailPage', messageCenterEntity);
  }
}
