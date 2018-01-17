import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var echarts;

@IonicPage()
@Component({
  selector: 'page-cultural-relic-chart',
  templateUrl: 'cultural-relic-chart.html',
})
export class CulturalRelicChartPage {
  private dataSource: string[][];
  @ViewChild('chart1') element1: ElementRef;
  @ViewChild('chart2') element2: ElementRef;
  chart1;
  chart2;
  xAxis: string[];
  yAxis1: string[];
  yAxis2: string[];
  yAxis3: string[];
  yAxis4: string[];
  yAxis5: string[];
  yAxis6: string[];
  yAxis7: string[];
  yAxis8: string[];
  yAxis9: string[];
  yAxis10: string[];
  legend: string[];
  legend2: string[];
  endValue: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.dataSource = this.navParams.data.数据源;
    this.xAxis = [];
    this.yAxis1 = [];
    this.yAxis2 = [];
    this.yAxis3 = [];
    this.yAxis4 = [];
    this.yAxis5 = [];
    this.yAxis6 = [];
    this.yAxis7 = [];
    this.yAxis8 = [];
    this.yAxis9 = [];
    this.yAxis10 = [];
    this.legend = ['展区', '库房', '外借'];
    this.legend2 = ['一级', '二级', '三级', '一般', '未定级'];
  }

  ionViewDidLoad() {
    this.endValue = 2;
    switch (this.navParams.data.编号) {
      case (1):
        for (let data of this.dataSource) {
          this.xAxis.push(
            data[0]
          );
          this.yAxis1.push(
            data[3]
          );
          this.yAxis2.push(
            data[5]
          );
          this.yAxis3.push(
            data[7]
          );
          this.yAxis4.push(
            data[4]
          );
          this.yAxis5.push(
            data[6]
          );
          this.yAxis6.push(
            data[8]
          );
        }

        let op1 = {
          color: ['#001133', '#003366', '#006699'],
          grid: { top: '25%', bottom: '25%' },
          legend: {
            data: this.legend
          },
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
          yAxis: [{ name: "可移动文物统计(件/套)", type: 'value' }],
          series: []
        };
        let op2 = {
          color: ['#001133', '#003366', '#006699'],
          grid: { top: '25%', bottom: '25%' },
          legend: {
            data: this.legend
          },
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
          yAxis: [{ name: "可移动文物统计(实际数量)", type: 'value' }],
          series: []
        };

        op1.series.push(
          {
            name: '展区',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis1
          },
          {
            name: '库房',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis2
          },
          {
            name: '外借',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis3
          }
        );

        op2.series.push(
          {
            name: '展区',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis4
          },
          {
            name: '库房',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis5
          },
          {
            name: '外借',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis6
          }
        );

        this.chart1 = echarts.init(this.element1.nativeElement);
        this.chart1.setOption(op1);

        this.chart2 = echarts.init(this.element2.nativeElement);
        this.chart2.setOption(op2);
        break;
      case (2):
        for (let data of this.dataSource) {
          this.xAxis.push(
            data[0]
          );
          this.yAxis1.push(
            data[1]
          );
          this.yAxis2.push(
            data[3]
          );
          this.yAxis3.push(
            data[5]
          );
          this.yAxis4.push(
            data[7]
          );
          this.yAxis5.push(
            data[9]
          );
          this.yAxis6.push(
            data[2]
          );
          this.yAxis7.push(
            data[4]
          );
          this.yAxis8.push(
            data[6]
          );
          this.yAxis9.push(
            data[8]
          );
          this.yAxis10.push(
            data[10]
          );
        }

        let op3 = {
          color: ['#001133', '#003366', '#006699','#001133', '#003366'],
          grid: { top: '25%', bottom: '25%' },
          legend: {
            data: this.legend2
          },
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
          yAxis: [{ name: "可移动文物统计(件/套)", type: 'value' }],
          series: []
        };
        let op4 = {
          color: ['#001133', '#003366', '#006699','#001133', '#003366'],
          grid: { top: '25%', bottom: '25%' },
          legend: {
            data: this.legend2
          },
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
          yAxis: [{ name: "可移动文物统计(实际数量)", type: 'value' }],
          series: []
        };

        op3.series.push(
          {
            name: '一级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis1
          },
          {
            name: '二级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis2
          },
          {
            name: '三级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis3
          },
          {
            name: '一般',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis4
          },
          {
            name: '未定级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis5
          }
        );

        op4.series.push(
          {
            name: '一级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis6
          },
          {
            name: '二级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis7
          },
          {
            name: '三级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis8
          },
          {
            name: '一般',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis9
          },
          {
            name: '未定级',
            type: 'bar',
            label: {
              normal: { show: true, position: 'top' }
            },
            data: this.yAxis10
          }
        );

        this.chart1 = echarts.init(this.element1.nativeElement);
        this.chart1.setOption(op3);

        this.chart2 = echarts.init(this.element2.nativeElement);
        this.chart2.setOption(op4);
        break;
      default:
        break;
    }
  }
}