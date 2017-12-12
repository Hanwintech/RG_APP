import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticeSearchPage } from './notice-search';

@NgModule({
  declarations: [
    NoticeSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticeSearchPage),
  ],
})
export class NoticeSearchPageModule {}
