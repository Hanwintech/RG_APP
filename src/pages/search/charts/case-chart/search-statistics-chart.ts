import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var echarts;

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
  @ViewChild('chart1') element1: ElementRef;
  @ViewChild('chart2') element2: ElementRef;
  @ViewChild('chart3') element3: ElementRef;
  chart1;
  chart2;
  chart3;
  xAxis: string[];
  yAxis: string[];
  endValue: number;
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
        this.endValue = 3;
        break;
      case (2):
        this.title = "按整改情况统计";
        this.endValue = 2;
        break;
      case (3):
        this.title = "按罚款统计";
        this.endValue = 3;
        break;
      case (4):
        this.title = "按月度统计";
        this.endValue = 4;
        break;
      case (5):
        this.title = "按季度统计";
        this.endValue = 3;
        break;
      case (6):
        this.title = "按半年度统计";
        this.endValue = 3;
        break;
      case (7):
        this.title = "按年度统计";
        this.endValue = 2;
        break;
      case (8):
        this.title = "按来源统计";
        this.endValue = 2;
        break;
      case (9):
        this.title = "按地区统计";
        this.endValue = 4;
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
        if (data[0] == "全国重点文物保护单位") {
          da.push(
            { value: data[1], name: "国家级" }
          );
        } else if (data[0] == "省级文物保护单位") {
          da.push(
            { value: data[1], name: "省级" }
          );
        } else if (data[0] == "市级文物保护单位") {
          da.push(
            { value: data[1], name: "市级" }
          );
        } else if (data[0] == "县区级文物保护单位") {
          da.push(
            { value: data[1], name: "县区级" }
          );
        } else {
          da.push(
            { value: data[1], name: data[0] }
          );
        }
      }
    }

    let op1 = {
      color: ['rgb(29,159,206)', 'rgb(151,83,184)', 'rgb(153,204,0)', '#ff8a0f', 'rgb(230,44,44)', 'rgb(221,198,156)', 'rgb(187,12,124)', 'rgb(42,202,186)'],
      grid: { top: '25%', bottom: '25%', right: '10%' },
      xAxis: {
        data: this.xAxis,
        axisLabel: {
          show: true,
          fontSize: 5,
          color: 'rgb(204,204,204)'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgb(204,204,204)'
          }
        }
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
      yAxis: {
        name: "案件数(起)",
        axisLabel: {
          show: true,
          fontSize: 10,
          color: 'rgb(204,204,204)'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgb(204,204,204)'
          }
        },
      },
      series: []
    };
    let op2 = {
      color: ['rgb(29,159,206)', 'rgb(151,83,184)', 'rgb(153,204,0)', '#ff8a0f', 'rgb(230,44,44)', 'rgb(221,198,156)', 'rgb(187,12,124)', 'rgb(42,202,186)'],
      grid: { top: '25%', bottom: '25%' },
      xAxis: {
        data: this.xAxis,
        axisLabel: {
          show: true,
          fontSize: 5,
          color: 'rgb(204,204,204)'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgb(204,204,204)'
          }
        }
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
      yAxis: {
        name: "案件数(起)",
        axisLabel: {
          show: true,
          fontSize: 10,
          color: 'rgb(204,204,204)'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgb(204,204,204)'
          }
        }
      },
      series: []
    };

    let op3 = {
      color: ['rgb(29,159,206)', 'rgb(151,83,184)', 'rgb(153,204,0)', '#ff8a0f', 'rgb(230,44,44)', 'rgb(221,198,156)', 'rgb(187,12,124)', 'rgb(42,202,186)'],
      series: []
    };

    op1.series.push({
      name: '案件数(起)',
      type: 'line',
      label: {
        //backgroundColor:  ['rgb(29,159,206)', 'rgb(151,83,184)', 'rgb(153,204,0)', '#ff8a0f', 'rgb(230,44,44)', 'rgb(221,198,156)', 'rgb(187,12,124)', 'rgb(42,202,186)'],
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
      // itemStyle: {
      //   color: ['rgb(29,159,206)', 'rgb(151,83,184)', 'rgb(153,204,0)', '#ff8a0f', 'rgb(230,44,44)', 'rgb(221,198,156)', 'rgb(187,12,124)', 'rgb(42,202,186)']
      // },
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
          labelLine: { show: true }
        }
      },
      data: da
    });

    this.chart1 = echarts.init(this.element1.nativeElement);
    this.chart1.setOption(op1);

    this.chart2 = echarts.init(this.element2.nativeElement);
    this.chart2.setOption(op2);

    this.chart3 = echarts.init(this.element3.nativeElement);
    this.chart3.setOption(op3);
  }
}