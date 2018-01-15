import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectChartPage } from './inspect-chart';

@NgModule({
  declarations: [
    InspectChartPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectChartPage),
  ],
})
export class InspectChartPageModule {}
