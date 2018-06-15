import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolStatisticsPage } from './patrol-statistics';

@NgModule({
  declarations: [
    PatrolStatisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolStatisticsPage),
  ],
})
export class PatrolStatisticsPageModule {}
