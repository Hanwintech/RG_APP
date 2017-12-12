import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticeListPage } from './notice-list';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    NoticeListPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticeListPage),
    PipesModule
  ],
})
export class NoticeListPageModule {}
