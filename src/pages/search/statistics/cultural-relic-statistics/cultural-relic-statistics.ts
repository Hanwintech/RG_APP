import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from './../../../../services/api.service';
import { PageService } from './../../../../services/page.service';

import { GetReportStatisticalCulturalRelicByLevelInfos } from './../../../../apis/search/get-report-statistical-cultural-relic-by-level-infos.api';
import { GetReportStatisticalCulturalRelicByLocationInfos } from './../../../../apis/search/get-report-statistical-cultural-relic-by-location-infos.api';
import { ReportStatisticalCulturalRelicSearch } from './../../../../models/search/report-statistical-cultural-relic-search.model';
import { ReportStatisticalCulturalRelicByLevelInfos } from './../../../../models/search/report-statistical-cultural-relic-by-level-info.model';
import { ReportStatisticalCulturalRelicByLocationInfos } from './../../../../models/search/report-statistical-cultural-relic-by-location-info.model';


@IonicPage()
@Component({
  selector: 'page-cultural-relic-statistics',
  templateUrl: 'cultural-relic-statistics.html',
})
export class CulturalRelicStatisticsPage {
  private chartType: number;
  private search: ReportStatisticalCulturalRelicSearch;
  private title: string;
  private category1: string;
  private category2: string;
  private category3: string;
  private category4: string;
  private sum: number;
  private actualSum: number;
  private collectionUnitName: string;
  private dataSource: string[][];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    this.chartType = this.navParams.data;

    //初始化查询字段
    this.search = new ReportStatisticalCulturalRelicSearch();
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
        this.title = "按位置统计";
        this.category1 = "藏品总数";
        this.category2 = "展区";
        this.category3 = "仓库";
        this.category4 = "外借";
        this.apiService.sendApi(new GetReportStatisticalCulturalRelicByLocationInfos(this.search)).subscribe(
          res => {
            console.log(res);
            if (res.success) {
              //console.log(res.data.search);
              this.sum = res.data.sum;
              this.actualSum = res.data.actualSum;
              for (let data of res.data.reportStatisticalCulturalRelicByLocationInfoList) {
                this.dataSource.push([
                  data.collectionUnitName,
                  data.culturalSum ? data.culturalSum.toString() : "",
                  data.culturalActualSum ? data.culturalActualSum.toString() : "",
                  data.exhibitionSum ? data.exhibitionSum.toString() : "",
                  data.exhibitionActualSum ? data.exhibitionActualSum.toString() : "",
                  data.storeSum ? data.storeSum.toString() : "",
                  data.storeActualSum ? data.storeActualSum.toString() : "",
                  data.borrowSum ? data.borrowSum.toString() : "",
                  data.borrowActualSum ? data.borrowActualSum.toString() : ""
                ]);
              }
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        break;
      case (2):
        this.title = "按级别统计";
        this.category1 = "一级";
        this.category2 = "二级";
        this.category3 = "三级";
        this.category4 = "一般";
        this.apiService.sendApi(new GetReportStatisticalCulturalRelicByLevelInfos(this.search)).subscribe(
          res => {
            console.log(res);
            if (res.success) {
              // this.totalCaseCount = 0;
              // this.totalSumFineAmount = 0;
              // for (let data of res.data.reportQueryCaseByRectificationInfoList) {
              //     this.totalCaseCount += data.reportQueryCaseByRectification.caseCount;
              //     this.totalSumFineAmount += data.reportQueryCaseByRectification.sumFineAmount;
              //     this.dataSource.push([
              //         data.reportQueryCaseByRectification.rectificationName,
              //         data.reportQueryCaseByRectification.caseCount.toString(),
              //         data.reportQueryCaseByRectification.sumFineAmount.toString()
              //     ]);
              // }
              // this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
              // this.search = res.data.search;
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

    // chart() {
    //   this.navCtrl.push("SearchStatisticsChartPage", {
    //       "编号": this.chartType, "案件总数": this.totalCaseCount, "总罚款金额": this.totalSumFineAmount, "数据源": this.dataSource
    //   });
    //   }

  }
}
