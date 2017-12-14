import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchStatisticsChartPage } from './search-statistics-chart';

@NgModule({
  declarations: [
    SearchStatisticsChartPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchStatisticsChartPage),
  ],
})
export class SearchStatisticsChartPageModule {}
