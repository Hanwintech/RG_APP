import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoticeMessageCenterPage } from './notice-message-center';
import { PipesModule } from './../../../pipes/pipes.module';
import { DateTime } from './../../../pipes/datetime.pipe';

@NgModule({
  declarations: [
    NoticeMessageCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(NoticeMessageCenterPage),
    PipesModule
  ],
  providers: [
    DateTime
  ]
})
export class NoticeMessageCenterPageModule {}
