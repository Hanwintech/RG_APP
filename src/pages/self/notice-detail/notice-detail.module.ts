import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticeDetailPage } from './notice-detail';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    NoticeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticeDetailPage),
    PipesModule
  ],
})
export class NoticeDetailPageModule {}
