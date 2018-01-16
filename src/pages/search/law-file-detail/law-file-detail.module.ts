import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LawFileDetailPage } from './law-file-detail';

@NgModule({
  declarations: [
    LawFileDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LawFileDetailPage),
  ],
})
export class LawFileDetailPageModule {}
