import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicOpinionInfoPage } from './public-opinion-info';

@NgModule({
  declarations: [
    PublicOpinionInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicOpinionInfoPage),
  ],
})
export class PublicOpinionInfoPageModule {}
