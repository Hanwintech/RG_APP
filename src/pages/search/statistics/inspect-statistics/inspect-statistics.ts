import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { ApiService } from './../../../../services/api.service';
import { PageService } from './../../../../services/page.service';
import { GetReportQueryPatrolByRelicLevelInfos } from './../../../../apis/search/get-report-query-patrol-by-relic-level-infos.api';
import { GetReportQueryPatrolByMonthlyInfos } from './../../../../apis/search/get-report-query-patrol-by-monthly-infos.api';
import { GetReportQueryPatrolByQuarterInfos } from './../../../../apis/search/get-report-query-patrol-by-quarter-infos.api';
import { GetReportQueryPatrolByHalfYearInfos } from './../../../../apis/search/get-report-query-patrol-by-half-year-infos.api';
import { GetReportQueryPatrolByYearInfos } from './../../../../apis/search/get-report-query-patrol-by-year-infos.api';
import { GetReportQueryPatrolByAreaInfos } from './../../../../apis/search/get-report-query-patrol-by-area-infos.api';
import { ReportQueryPatrolSearch } from './../../../../models/search/report-query-patrol-search.model';
import { ReportQueryPatrolByRelicLevelInfo } from './../../../../models/search/report-query-patrol-by-relic-level-info';
import { ReportQueryPatrolByMonthlyInfo } from './../../../../models/search/report-query-patrol-by-monthly-info';
import { ReportQueryPatrolByQuarterInfo } from './../../../../models/search/report-query-patrol-by-quarter-info';
import { ReportQueryPatrolByHalfYearInfo } from './../../../../models/search/report-query-patrol-by-half-year-info';
import { ReportQueryPatrolByYearInfo } from './../../../../models/search/report-query-patrol-by-year-info';
import { ReportQueryPatrolByAreaInfo } from './../../../../models/search/report-query-patrol-by-area-info';

import { ReportQueryPatrolSearchDataSource } from './../../../../models/search/report-query-patrol-search.model';

@IonicPage()
@Component({
  selector: 'page-inspect-statistics',
  templateUrl: 'inspect-statistics.html',
})
export class InspectStatisticsPage {
  private chartType: number;
  private search: ReportQueryPatrolSearch;
  private searchDataSource: ReportQueryPatrolSearchDataSource;
  private title: string;
  private category: string;
  private totalPatrolCount: number;
  private dataSource: string[][];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    this.chartType = this.navParams.data;
    //初始化查询字段
    this.search = new ReportQueryPatrolSearch();
    this.search.isDefaultSearch = true;
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));
    this.dataSource = [];
    this.doSearch();
  }

  doSearch() {
    switch (this.chartType) {
      case (1):
        this.title = "按类别统计";
        this.category = "类别";
        this.apiService.sendApi(new GetReportQueryPatrolByRelicLevelInfos(this.search)).subscribe(
          res => {
            console.log(res);
            if (res.success) {
              this.totalPatrolCount = 0;
              for (let data of res.data.reportQueryPatrolByRelicLevelInfoList) {
                this.totalPatrolCount += data.reportQueryPatrolByRelicLevel.patrolCount;
                this.dataSource.push([
                  data.reportQueryPatrolByRelicLevel.levelName,
                  data.reportQueryPatrolByRelicLevel.patrolCount.toString()
                ]);
              }
              this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
              this.search = res.data.search;
              if (this.search.patrolStatus == 0) {
                this.search.patrolStatus = -1;
              }
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        break;
      case (4):
        this.title = "按月度统计";
        this.category = "巡查日期";
        this.apiService.sendApi(new GetReportQueryPatrolByMonthlyInfos(this.search)).subscribe(
          res => {
            //console.log(res);
            if (res.success) {
              this.totalPatrolCount = 0;
              for (let data of res.data.reportQueryPatrolByMonthlyInfoList) {
                this.totalPatrolCount += data.reportQueryPatrolByMonthly.patrolCount;
                this.dataSource.push([
                  data.reportQueryPatrolByMonthly.indexYear + "年" + data.reportQueryPatrolByMonthly.indexMonth + "月",
                  data.reportQueryPatrolByMonthly.patrolCount.toString()
                ]);
              }
              this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
              this.search = res.data.search;
              if (this.search.patrolStatus == 0) {
                this.search.patrolStatus = -1;
              }
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        break;
      case (5):
        this.title = "按季度统计";
        this.category = "巡查日期";
        this.apiService.sendApi(new GetReportQueryPatrolByQuarterInfos(this.search)).subscribe(
          res => {
            //console.log(res);
            if (res.success) {
              this.totalPatrolCount = 0;
              for (let data of res.data.reportQueryPatrolByQuarterInfoList) {
                this.totalPatrolCount += data.reportQueryPatrolByQuarter.patrolCount;
                this.dataSource.push([
                  data.reportQueryPatrolByQuarter.indexYear + "年" + data.reportQueryPatrolByQuarter.indexQuarter + "季度",
                  data.reportQueryPatrolByQuarter.patrolCount.toString()
                ]);
              }
              this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
              this.search = res.data.search;
              if (this.search.patrolStatus == 0) {
                this.search.patrolStatus = -1;
              }
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        break;
      case (6):
        this.title = "按半年度统计";
        this.category = "巡查日期";
        this.apiService.sendApi(new GetReportQueryPatrolByHalfYearInfos(this.search)).subscribe(
          res => {
            //console.log(res);
            if (res.success) {
              this.totalPatrolCount = 0;
              for (let data of res.data.reportQueryPatrolByHalfYearInfoList) {
                this.totalPatrolCount += data.reportQueryPatrolByHalfYear.patrolCount;
                var yearname = null;
                data.reportQueryPatrolByHalfYear.indexHalfYear == 1 ? yearname = "上半年" : yearname = "下半年";
                this.dataSource.push([
                  data.reportQueryPatrolByHalfYear.indexYear + "年" + yearname,
                  data.reportQueryPatrolByHalfYear.patrolCount.toString()
                ]);
              }
              this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
              this.search = res.data.search;
              if (this.search.patrolStatus == 0) {
                this.search.patrolStatus = -1;
              }
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        break;
      case (7):
        this.title = "按年度统计";
        this.category = "巡查日期";
        this.apiService.sendApi(new GetReportQueryPatrolByYearInfos(this.search)).subscribe(
          res => {
            //console.log(res);
            if (res.success) {
              this.totalPatrolCount = 0;
              for (let data of res.data.reportQueryPatrolByYearInfoList) {
                this.totalPatrolCount += data.reportQueryPatrolByYear.patrolCount;
                this.dataSource.push([
                  data.reportQueryPatrolByYear.indexYear + "年",
                  data.reportQueryPatrolByYear.patrolCount.toString()
                ]);
              }
              this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
              this.search = res.data.search;
              if (this.search.patrolStatus == 0) {
                this.search.patrolStatus = -1;
              }
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        break;
      case (9):
        this.title = "按地区统计";
        this.category = "地区";
        this.apiService.sendApi(new GetReportQueryPatrolByAreaInfos(this.search)).subscribe(
          res => {
            //console.log(res);
            if (res.success) {
              this.totalPatrolCount = res.data.reportQueryPatrolByAreaInfoList[0].reportQueryPatrolByArea.patrolCount;
              console.log(res.data.reportQueryPatrolByAreaInfoList);
              for (let data of res.data.reportQueryPatrolByAreaInfoList) {
                this.dataSource.push([
                  data.reportQueryPatrolByArea.areaName,
                  data.reportQueryPatrolByArea.patrolCount.toString()
                ]);
              }
              this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
              this.search = res.data.search;
              if (this.search.patrolStatus == 0) {
                this.search.patrolStatus = -1;
              }
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        break;
      default:
        break;
    }
  }
  chart() {
    this.navCtrl.push("InspectChartPage", {
      "编号": this.chartType, "总巡查次数": this.totalPatrolCount, "数据源": this.dataSource
    });
  }
  conditionSearch() {
    let searchModal = this.modalCtrl.create("InspectConditionInquiryPage", { "search": this.search, "dataSource": this.searchDataSource });
    searchModal.onDidDismiss(data => {
      if (data.needSearch) {
        this.search = data.search;
        this.search.isDefaultSearch = false;
        this.dataSource = [];
        this.doSearch();
      }
      console.log(this.search);
    });
    searchModal.present();
  }
}


