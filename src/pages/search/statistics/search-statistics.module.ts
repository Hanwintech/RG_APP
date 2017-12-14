import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchStatisticsPage } from './search-statistics';

@NgModule({
  declarations: [
    SearchStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchStatisticsPage),
  ],
})
export class SearchStatisticsPageModule {}
