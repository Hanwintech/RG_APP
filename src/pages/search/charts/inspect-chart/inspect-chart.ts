import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EchartsNg2Component, EChartOption } from 'echarts-ng2';


@IonicPage()
@Component({
  selector: 'page-inspect-chart',
  templateUrl: 'inspect-chart.html',
})
export class InspectChartPage {
  private title: string;
  private totalPatrolCount: number;
  private dataSource: string[][];
  @ViewChild('chart1') chart1: EchartsNg2Component;
  @ViewChild('chart2') chart2: EchartsNg2Component;
  @ViewChild('chart3') chart3: EchartsNg2Component;
  option1: EChartOption;
  option2: EChartOption;
  option3: EChartOption;
  xAxis: string[];
  yAxis: string[];
  endValue: number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.totalPatrolCount = this.navParams.data.总巡查次数;
    this.dataSource = this.navParams.data.数据源;
    this.xAxis = [];
    this.yAxis = [];

  }

  ionViewDidLoad() {
    switch (this.navParams.data.编号) {
      case (1):
        this.title = "按类别统计";
        this.endValue = 2;
        break;
      case (4):
        this.title = "按月度统计";
        this.endValue = 3;
        break;
      case (5):
        this.title = "按季度统计";
        this.endValue = 2;
        break;
      case (6):
        this.title = "按半年度统计";
        this.endValue = 2;
        break;
      case (7):
        this.title = "按年度统计";
        this.endValue = 1;
        break;
      case (9):
        this.title = "按地区统计";
        this.endValue = 3;
        break;
      default:
        break;
    }
  }

}
