import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicOpinionInfoDetailPage } from './public-opinion-info-detail';

@NgModule({
  declarations: [
    PublicOpinionInfoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicOpinionInfoDetailPage),
  ],
})
export class PublicOpinionInfoDetailPageModule {}
