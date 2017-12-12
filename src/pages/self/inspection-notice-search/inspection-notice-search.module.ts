import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionNoticeSearchPage } from './inspection-notice-search';

@NgModule({
  declarations: [
    InspectionNoticeSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionNoticeSearchPage),
  ],
})
export class InspectionNoticeSearchPageModule {}
