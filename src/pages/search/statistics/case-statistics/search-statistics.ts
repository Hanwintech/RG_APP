import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { ApiService } from './../../../../services/api.service';
import { PageService } from './../../../../services/page.service';
import { GetReportQueryCaseByRelicLevelInfos } from './../../../../apis/search/get-report-query-case-by-relic-level-infos.api';
import { GetReportQueryCaseByRectificationInfos } from './../../../../apis/search/get-report-query-case-by-rectification-infos.api';
import { GetReportQueryCaseByMonthlyInfos } from './../../../../apis/search/get-report-query-case-by-monthly-infos.api';
import { GetReportQueryCaseByFineAmountInfos } from './../../../../apis/search/get-report-query-case-by-fine-amount-infos.api';
import { GetReportQueryCaseByQuarterInfos } from './../../../../apis/search/get-report-query-case-by-quarter-infos.api';
import { GetReportQueryCaseByHalfYearInfos } from './../../../../apis/search/get-report-query-case-by-half-year-infos.api';
import { GetReportQueryCaseByYearInfos } from './../../../../apis/search/get-report-query-case-by-year-infos.api';
import { GetReportQueryCaseBySourceInfos } from './../../../../apis/search/get-report-query-case-by-source-infos.api';
import { GetReportQueryCaseByAreaInfos } from './../../../../apis/search/get-report-query-case-by-area-infos.api';
import { ReportQueryCaseSearch } from './../../../../models/search/report-query-case-search.model';
import { ReportQueryCaseSearchDataSource } from './../../../../models/search/report-query-patrol-search.model';

@IonicPage()
@Component({
    selector: 'page-search-statistics',
    templateUrl: 'search-statistics.html',
})
export class SearchStatisticsPage {
    private chartType: number;
    private search: ReportQueryCaseSearch;
    private searchDataSource: ReportQueryCaseSearchDataSource;
    private title: string;
    private category: string;
    private totalCaseCount: number;
    private totalSumFineAmount: number;
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
        this.search = new ReportQueryCaseSearch();
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
                this.apiService.sendApi(new GetReportQueryCaseByRelicLevelInfos(this.search)).subscribe(
                    res => {
                        console.log(res);
                        if (res.success) {
                            console.log(res.data.search);
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseByRelicLevelInfoList) {
                                this.totalCaseCount += data.reportQueryCaseByRelicLevel.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseByRelicLevel.sumFineAmount;
                                this.dataSource.push([
                                    data.reportQueryCaseByRelicLevel.levelName,
                                    data.reportQueryCaseByRelicLevel.caseCount.toString(),
                                    data.reportQueryCaseByRelicLevel.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
                        } else {
                            this.pageService.showErrorMessage(res.reason);
                        }
                    },
                    error => {
                        this.pageService.showErrorMessage(error);
                    });
                break;
            case (2):
                this.title = "按整改情况统计";
                this.category = "类别";
                this.apiService.sendApi(new GetReportQueryCaseByRectificationInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseByRectificationInfoList) {
                                this.totalCaseCount += data.reportQueryCaseByRectification.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseByRectification.sumFineAmount;
                                this.dataSource.push([
                                    data.reportQueryCaseByRectification.rectificationName,
                                    data.reportQueryCaseByRectification.caseCount.toString(),
                                    data.reportQueryCaseByRectification.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
                        } else {
                            this.pageService.showErrorMessage(res.reason);
                        }
                    },
                    error => {
                        this.pageService.showErrorMessage(error);
                    });
                break;
            case (3):
                this.title = "按罚款统计";
                this.category = "罚款类别";
                this.apiService.sendApi(new GetReportQueryCaseByFineAmountInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseByFineAmountInfoList) {
                                this.totalCaseCount += data.reportQueryCaseByFineAmount.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseByFineAmount.sumFineAmount;
                                this.dataSource.push([
                                    data.reportQueryCaseByFineAmount.levelName,
                                    data.reportQueryCaseByFineAmount.caseCount.toString(),
                                    data.reportQueryCaseByFineAmount.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
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
                this.category = "案发日期";
                this.apiService.sendApi(new GetReportQueryCaseByMonthlyInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseByMonthlyInfoList) {
                                this.totalCaseCount += data.reportQueryCaseByMonthly.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseByMonthly.sumFineAmount;
                                this.dataSource.push([
                                    data.reportQueryCaseByMonthly.indexYear + "年" + data.reportQueryCaseByMonthly.indexMonth + "月",
                                    data.reportQueryCaseByMonthly.caseCount.toString(),
                                    data.reportQueryCaseByMonthly.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
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
                this.category = "案发日期";
                this.apiService.sendApi(new GetReportQueryCaseByQuarterInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseByQuarterInfoList) {
                                this.totalCaseCount += data.reportQueryCaseByQuarter.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseByQuarter.sumFineAmount;
                                this.dataSource.push([
                                    data.reportQueryCaseByQuarter.indexYear + "年" + data.reportQueryCaseByQuarter.indexQuarter + "季度",
                                    data.reportQueryCaseByQuarter.caseCount.toString(),
                                    data.reportQueryCaseByQuarter.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
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
                this.category = "案发日期";
                this.apiService.sendApi(new GetReportQueryCaseByHalfYearInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseByHalfYearInfoList) {
                                this.totalCaseCount += data.reportQueryCaseByHalfYear.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseByHalfYear.sumFineAmount;
                                var yearname = null;
                                data.reportQueryCaseByHalfYear.indexHalfYear == 1 ? yearname = "上半年" : yearname = "下半年";
                                this.dataSource.push([
                                    data.reportQueryCaseByHalfYear.indexYear + "年" + yearname,
                                    data.reportQueryCaseByHalfYear.caseCount.toString(),
                                    data.reportQueryCaseByHalfYear.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
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
                this.category = "案发日期";
                this.apiService.sendApi(new GetReportQueryCaseByYearInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseByYearInfoList) {
                                this.totalCaseCount += data.reportQueryCaseByYear.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseByYear.sumFineAmount;
                                this.dataSource.push([
                                    data.reportQueryCaseByYear.indexYear + "年",
                                    data.reportQueryCaseByYear.caseCount.toString(),
                                    data.reportQueryCaseByYear.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
                        } else {
                            this.pageService.showErrorMessage(res.reason);
                        }
                    },
                    error => {
                        this.pageService.showErrorMessage(error);
                    });
                break;
            case (8):
                this.title = "按来源统计";
                this.category = "案件来源";
                this.apiService.sendApi(new GetReportQueryCaseBySourceInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = 0;
                            this.totalSumFineAmount = 0;
                            for (let data of res.data.reportQueryCaseBySourceInfoList) {
                                this.totalCaseCount += data.reportQueryCaseBySource.caseCount;
                                this.totalSumFineAmount += data.reportQueryCaseBySource.sumFineAmount;
                                this.dataSource.push([
                                    data.reportQueryCaseBySource.caseSourceName,
                                    data.reportQueryCaseBySource.caseCount.toString(),
                                    data.reportQueryCaseBySource.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
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
                this.apiService.sendApi(new GetReportQueryCaseByAreaInfos(this.search)).subscribe(
                    res => {
                        //console.log(res);
                        if (res.success) {
                            this.totalCaseCount = res.data.reportQueryCaseByAreaInfoList[0].reportQueryCaseByArea.caseCount;
                            this.totalSumFineAmount = res.data.reportQueryCaseByAreaInfoList[0].reportQueryCaseByArea.sumFineAmount;
                            console.log(res.data.reportQueryCaseByAreaInfoList);
                            for (let data of res.data.reportQueryCaseByAreaInfoList) {
                                this.dataSource.push([
                                    data.reportQueryCaseByArea.areaName,
                                    data.reportQueryCaseByArea.caseCount.toString(),
                                    data.reportQueryCaseByArea.sumFineAmount.toString()
                                ]);
                            }
                            this.searchDataSource = res.data.reportQueryCaseSearchDataSource;
                            this.search = res.data.search;
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
        this.navCtrl.push("SearchStatisticsChartPage", {
            "编号": this.chartType, "案件总数": this.totalCaseCount, "总罚款金额": this.totalSumFineAmount, "数据源": this.dataSource
        });
    }



    conditionSearch() {
        let searchModal = this.modalCtrl.create("CaseConditionInquiryPage", { "search": this.search, "dataSource": this.searchDataSource });
        searchModal.onDidDismiss(data => {
            console.log(data);
            if (data && data.needSearch) {
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
