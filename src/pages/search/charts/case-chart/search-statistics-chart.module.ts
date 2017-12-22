import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchStatisticsChartPage } from './search-statistics-chart';
import { EchartsNg2Module } from 'echarts-ng2'; 
import { PipesModule } from './../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchStatisticsChartPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchStatisticsChartPage),
    EchartsNg2Module,
    PipesModule
  ],
})
export class SearchStatisticsChartPageModule {}
