import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CulturalRelicStatisticsPage } from './cultural-relic-statistics';

import { PipesModule } from './../../../../pipes/pipes.module';
@NgModule({
  declarations: [
    CulturalRelicStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(CulturalRelicStatisticsPage),
    PipesModule
  ],
})
export class CulturalRelicStatisticsPageModule {}
