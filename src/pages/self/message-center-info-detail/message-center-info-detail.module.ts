import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageCenterInfoDetailPage } from './message-center-info-detail';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    MessageCenterInfoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageCenterInfoDetailPage),
    PipesModule
  ],
})
export class MessageCenterInfoDetailPageModule {}
