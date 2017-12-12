import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionNoticeListPage } from './inspection-notice-list';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    InspectionNoticeListPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionNoticeListPage),
    PipesModule
  ],
})
export class InspectionNoticeListPageModule { }
