import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectStatisticsPage } from './inspect-statistics';

@NgModule({
  declarations: [
    InspectStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectStatisticsPage),
  ],
})
export class InspectStatisticsPageModule {}
