import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from './../../../../services/api.service';
import { PageService } from './../../../../services/page.service';



@IonicPage()
@Component({
  selector: 'page-cultural-relic-statistics',
  templateUrl: 'cultural-relic-statistics.html',
})
export class CulturalRelicStatisticsPage {
  private chartType: number;
  //private search: ReportQueryCaseSearch;
  //private searchDataSource: ReportQueryCaseSearchDataSource;
  private title: string;
  private category: string;
  private totalCaseCount: number;
  private totalSumFineAmount: number;
  private dataSource: string[][];
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public apiService: ApiService,
     public pageService: PageService
    ) {
      this.chartType = this.navParams.data;

      //初始化查询字段
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CulturalRelicStatisticsPage');
  }

}
