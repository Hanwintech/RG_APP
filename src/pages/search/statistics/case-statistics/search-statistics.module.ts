import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchStatisticsPage } from './search-statistics';

import { PipesModule } from './../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    SearchStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchStatisticsPage),
    PipesModule
  ],
})
export class SearchStatisticsPageModule {}
