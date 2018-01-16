import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionNoticeAlreadyReplyPage } from './inspection-notice-already-reply';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    InspectionNoticeAlreadyReplyPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionNoticeAlreadyReplyPage),
    PipesModule
  ],
})
export class InspectionNoticeAlreadyReplyPageModule {}
