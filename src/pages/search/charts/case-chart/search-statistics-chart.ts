import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EchartsNg2Component, EChartOption } from 'echarts-ng2';


@IonicPage()
@Component({
  selector: 'page-search-statistics-chart',
  templateUrl: 'search-statistics-chart.html',
})
export class SearchStatisticsChartPage {
  private title: string;
  private totalCaseCount: number;
  private totalSumFineAmount: number;
  private dataSource: string[][];
  @ViewChild('chart1') chart1: EchartsNg2Component;
  @ViewChild('chart2') chart2: EchartsNg2Component;
  @ViewChild('chart3') chart3: EchartsNg2Component;
  option1: EChartOption;
  option2: EChartOption;
  option3: EChartOption;
  xAxis: string[];
  yAxis: string[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.totalCaseCount = this.navParams.data.案件总数;
    this.totalSumFineAmount = this.navParams.data.总罚款金额;
    this.dataSource = this.navParams.data.数据源;
    this.xAxis = [];
    this.yAxis = [];

  }

  ionViewDidLoad() {
    switch (this.navParams.data.编号) {
      case (1):
        this.title = "按类别统计";
        break;
      case (2):
        this.title = "按整改情况统计";
        break;
      case (3):
        this.title = "按罚款统计";
        break;
      case (4):
        this.title = "按月度统计";
        break;
      case (5):
        this.title = "按季度统计";
        break;
      case (6):
        this.title = "按半年度统计";
        break;
      case (7):
        this.title = "按年度统计";
        break;
      case (8):
        this.title = "按来源统计";
        break;
      case (9):
        this.title = "按地区统计";
        break;
      default:
        break;
    }
    let da = [];
    for (let data of this.dataSource) {
      if (data[0] == "全国重点文物保护单位") {
        data[0] = "国家级";
      } else if (data[0] == "省级文物保护单位") {
        data[0] = "省级";
      } else if (data[0] == "市级文物保护单位") {
        data[0] = "市级";
      } else if (data[0] == "县区级文物保护单位") {
        data[0] = "县区级";
      }
      
      this.xAxis.push(
        data[0]
      );
      this.yAxis.push(
        data[1]
      );
      if(data[1]>0 ){

      }
      da.push(
        { value: data[1], name: data[0] }
      );
    }

    let op1 = {
      xAxis: { data: this.xAxis },
      yAxis: { name: "案件数(起)" },
      series: []
    };
    let op2 = {
      xAxis: { data: this.xAxis },
      yAxis: { name: "案件数(起)" },
      series: []
    };
    let op3 = {
      series: []
    };

    op1.series.push({
      name: '案件数(起)',
      type: 'line',
      label: {
        normal: { show: true, position: 'top' }
      },
      data: this.yAxis
    });
    op2.series.push({
      name: '案件数(起)',
      type: 'bar',
      label: {
        normal: { show: true, position: 'top' }
      },
      data: this.yAxis
    });

    op3.series.push({
      name: '案件数(起)',
      type: 'pie',
      //stillShowZeroSum: false,
      radius: '55%',
      center: ['50%', '60%'],
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: '{b}:{c}',
            //position: 'inside'
          },
          labelLine: { show: false }
        }
      },
      data: da
    });

    this.option1 = op1;
    this.option2 = op2;
    this.option3 = op3;
  }
}