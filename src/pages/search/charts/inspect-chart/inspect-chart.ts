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
    let da = [];
    for (let data of this.dataSource) {

      if (data[0] != "江苏省") {
        if (data[0] == "全国重点文物保护单位") {
          this.xAxis.push(
            "国家级"
          );
        } else if (data[0] == "省级文物保护单位") {
          this.xAxis.push(
            "省级"
          );
        } else if (data[0] == "市级文物保护单位") {
          this.xAxis.push(
            "市级"
          );
        } else if (data[0] == "县区级文物保护单位") {
          this.xAxis.push(
            "县区级"
          );
        } else {
          this.xAxis.push(
            data[0]
          );
        }
        this.yAxis.push(
          data[1]
        );
      }

      if (data[1] != "0" && data[0] != "江苏省") {
        da.push(
          { value: data[1], name: data[0] }
        );
      }

    }

    let op1 = {
      grid: { top: '25%', bottom: '25%' },
      xAxis: {
        data: this.xAxis,
      },
      dataZoom: [//给x轴设置滚动条  
        {
          startValue: 0,
          endValue: this.endValue,
          type: 'slider',
          show: false,
          xAxisIndex: [0],
        },
        //下面这个属性是里面拖到  
        {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0,
          endValue: this.endValue,
        },
      ],
      yAxis: { name: "巡查次数" },
      series: []
    };
    let op2 = {
      grid: { top: '25%', bottom: '25%' },
      xAxis: {
        data: this.xAxis,
      },
      dataZoom: [//给x轴设置滚动条  
        {
          startValue: 0,
          endValue: this.endValue,
          type: 'slider',
          show: false,
          xAxisIndex: [0],
        },
        //下面这个属性是里面拖到  
        {
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: 0,
          endValue: this.endValue,
        },
      ],
      yAxis: { name: "巡查次数" },
      series: []
    };

    let op3 = {
      series: []
    };

    op1.series.push({
      name: '巡查次数',
      type: 'line',
      label: {
        normal: { show: true, position: 'top' }
      },
      data: this.yAxis
    });

    op2.series.push({
      name: '巡查次数',
      type: 'bar',
      label: {
        normal: { show: true, position: 'top' }
      },
      data: this.yAxis
    });

    op3.series.push({
      name: '巡查次数',
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
