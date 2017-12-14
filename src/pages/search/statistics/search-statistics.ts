import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { GetReportQueryCaseByRelicLevelInfos } from './../../../apis/search/get-report-query-case-by-relic-level-infos.api';
import { ReportQueryCaseSearch } from './../../../models/search/report-query-case-search.model';
import { ReportQueryCaseByRelicLevelInfo } from './../../../models/search/report-query-case-by-relic-level-info';
@IonicPage()
@Component({
    selector: 'page-search-statistics',
    templateUrl: 'search-statistics.html',
})
export class SearchStatisticsPage {
    private search: ReportQueryCaseSearch;
    private dataSource: ReportQueryCaseByRelicLevelInfo[];
    title: string;
    category: string;
    totalCaseCount: number;
    totalSumFineAmount: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public apiService: ApiService,
        public pageService: PageService
    ) {
        //初始化查询字段
        this.search = new ReportQueryCaseSearch();
        this.search.isDefaultSearch = true;
        this.search.userId = localStorage.getItem("userId");
        this.search.manageUnitId = localStorage.getItem("manageUnitId");
        this.search.userType = Number(localStorage.getItem("userType"));
    }

    ionViewDidLoad() {
        switch (this.navParams.data) {
            case (1):
                this.title = "按类别统计";
                this.category = "类别";
                break;
            case (2):
                this.title = "按整改情况统计";
                this.category = "类别";
                break;
            case (3):
                this.title = "按罚款统计";
                this.category = "罚款类别";
                break;
            case (4):
                this.title = "按月度统计";
                this.category = "案发日期";
                break;
            case (5):
                this.title = "按季度统计";
                this.category = "案发日期";
                break;
            case (6):
                this.title = "按半年度统计";
                this.category = "案发日期";
                break;
            case (7):
                this.title = "按年度统计";
                this.category = "案发日期";
                break;
            case (8):
                this.title = "按来源统计";
                this.category = "案件来源";
                break;
            case (9):
                this.title = "按地区统计";
                this.category = "地区";
                break;
            default:
                break;
        }

        this.apiService.sendApi(new GetReportQueryCaseByRelicLevelInfos(this.search)).subscribe(
            res => {
                if (res.success) {
                    this.dataSource = res.data.reportQueryCaseByRelicLevelInfoList;
                    console.log(this.dataSource);
                    this.totalCaseCount = 0;
                    this.totalSumFineAmount = 0;
                    for (let data of this.dataSource) {
                        this.totalCaseCount += data.reportQueryCaseByRelicLevel.caseCount;
                        this.totalSumFineAmount += data.reportQueryCaseByRelicLevel.sumFineAmount;
                    }
                } else {
                    this.pageService.showErrorMessage(res.reason);
                }
            },
            error => {
                this.pageService.showErrorMessage(error);
            });
    }

}
