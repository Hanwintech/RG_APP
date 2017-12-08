import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageCenterInfoListPage } from './message-center-info-list';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    MessageCenterInfoListPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageCenterInfoListPage),
    PipesModule
  ],
})
export class MessageCenterInfoListPageModule {}
