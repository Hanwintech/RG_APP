import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelfEditInfoPage } from './self-edit-info';

@NgModule({
  declarations: [
    SelfEditInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SelfEditInfoPage),
  ],
})
export class SelfEditInfoPageModule {}
