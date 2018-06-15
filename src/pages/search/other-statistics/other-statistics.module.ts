import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherStatisticsPage } from './other-statistics';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    OtherStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherStatisticsPage),
    PipesModule
  ],
})
export class OtherStatisticsPageModule {}
