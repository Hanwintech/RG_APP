import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchStatisticsChartPage } from './search-statistics-chart';
import { PipesModule } from './../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchStatisticsChartPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchStatisticsChartPage),
    PipesModule
  ],
})
export class SearchStatisticsChartPageModule {}
