import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectChartPage } from './inspect-chart';
import { EchartsNg2Module } from 'echarts-ng2'; 
@NgModule({
  declarations: [
    InspectChartPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectChartPage),
    EchartsNg2Module
  ],
})
export class InspectChartPageModule {}
