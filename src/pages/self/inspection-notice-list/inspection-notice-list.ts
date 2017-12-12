import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { ListPage } from './../../../BasePage/list-page';
import { GetInspectionNoticeInfoList } from './../../../apis/self/get-inspection-notice-info-list.api';
import { InspectionNoticeInfo, InspectionNoticeInfoSearch, InspectionNoticeInfoSearchDataSource } from './../../../models/self/inspection-notice-info.model';
import { EnumSearchType } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-inspection-notice-list',
  templateUrl: 'inspection-notice-list.html',
})
export class InspectionNoticeListPage extends ListPage {
  private segmentIndex: string;
  private search0: InspectionNoticeInfoSearch;
  private search1: InspectionNoticeInfoSearch;
  private searchDataSource: InspectionNoticeInfoSearchDataSource;
  private datasource0: InspectionNoticeInfo[];
  private datasource1: InspectionNoticeInfo[];

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

    this.segmentIndex = "0";

    this.search0 = new InspectionNoticeInfoSearch();
    this.search0.isDefaultSearch = true;
    this.search0.isSend = false;
    this.search0.isNeedPaging = true;
    this.search0.searchType = EnumSearchType.All;
    this.search0.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.search0.userId = localStorage.getItem("userId");
    this.search0.manageUnitId = localStorage.getItem("manageUnitId");
    this.search0.userType = Number(localStorage.getItem("userType"));

    this.search1 = new InspectionNoticeInfoSearch();
    this.search1.isDefaultSearch = true;
    this.search1.isSend = true;
    this.search1.isNeedPaging = true;
    this.search1.searchType = EnumSearchType.All;
    this.search1.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.search1.userId = localStorage.getItem("userId");
    this.search1.manageUnitId = localStorage.getItem("manageUnitId");
    this.search0.userType = Number(localStorage.getItem("userType"));

    this.datasource0 = [];
    this.datasource1 = [];

    this.nextPage0(null);
    this.nextPage1(null);
  }

  nextPage0(event) {
    this.search0.pageIndex = this.nextPageIndex++;
    this.doSearch0(event, false);
  }

  nextPage1(event) {
    this.search1.pageIndex = this.nextPageIndex++;
    this.doSearch1(event, false);
  }

  doSearch0(event, isNewSearch) {
    this.apiService.sendApi(new GetInspectionNoticeInfoList(this.search0)).subscribe(
      res => {
        if (res.success) {
          if (isNewSearch) {
            this.datasource0 = [];
            this.nextPageIndex = 0;
          }
          this.searchDataSource = res.data.inspectorNoticeInfoSearchDataSource;
          //获取新一页的数据
          let temp: InspectionNoticeInfo[] = res.data.inspectorNoticeInfoList ? res.data.inspectorNoticeInfoList : [];
          for (let cr of temp) {
            this.datasource0.push(cr);
          }
          console.log(this.datasource0);

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

  doSearch1(event, isNewSearch) {
    this.apiService.sendApi(new GetInspectionNoticeInfoList(this.search1)).subscribe(
      res => {
        if (res.success) {
          if (isNewSearch) {
            this.datasource1 = [];
            this.nextPageIndex = 0;
          }
          this.searchDataSource = res.data.inspectorNoticeInfoSearchDataSource;
          //获取新一页的数据
          let temp: InspectionNoticeInfo[] = res.data.inspectorNoticeInfoList ? res.data.inspectorNoticeInfoList : [];
          for (let cr of temp) {
            this.datasource1.push(cr);
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
    super.showKeywordSearchPage(this.search0.keyword)
      .then(data => {
        if (data.needSearch) {
          this.search0.isDefaultSearch = true;
          this.search1.isDefaultSearch = true;
          this.search0.keyword = data.keyword;
          this.search1.keyword = data.keyword;
          this.doSearch0(null, true);
          this.doSearch1(null, true);
        }
      })
      .catch(error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showSearch() {
    super.showConditionalSearchPage('InspectionNoticeSearchPage', { "search": this.search0, "dataSource": this.searchDataSource })
      .then(data => {
        if (data.needSearch) {
          this.search0.isDefaultSearch = false;
          this.search0.recordState = data.search.recordState;
          this.search0.startDateTime = data.search.startDateTime;
          this.search0.endDateTime = data.search.endDateTime;
          this.search0.culturalRelicName = data.search.culturalRelicName;
          this.search0.fileTitle = data.search.fileTitle;
          this.search0.fromManageUnitName = data.search.fromManageUnitName;

          this.search1.isDefaultSearch = false;
          this.search1.recordState = data.search.recordState;
          this.search1.startDateTime = data.search.startDateTime;
          this.search1.endDateTime = data.search.endDateTime;
          this.search1.culturalRelicName = data.search.culturalRelicName;
          this.search1.fileTitle = data.search.fileTitle;
          this.search1.fromManageUnitName = data.search.fromManageUnitName;

          this.doSearch0(null, true);
          this.doSearch1(null, true);
        }
      })
      .catch(error => {
        this.pageService.showErrorMessage(error);
      });
  }

  view(inspectorNotice: InspectionNoticeInfo) {
    this.navCtrl.push('InspectionNoticeDetailPage', inspectorNotice);
  }
}
