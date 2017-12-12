import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionNoticeDetailPage } from './inspection-notice-detail';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    InspectionNoticeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionNoticeDetailPage),
    PipesModule
  ],
})
export class InspectionNoticeDetailPageModule {}
