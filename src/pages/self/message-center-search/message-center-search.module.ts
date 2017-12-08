import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageCenterSearchPage } from './message-center-search';

@NgModule({
  declarations: [
    MessageCenterSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageCenterSearchPage),
  ],
})
export class MessageCenterSearchPageModule {}
