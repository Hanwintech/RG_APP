import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LawFileDetailPage } from './law-file-detail';
import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    LawFileDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LawFileDetailPage),
    PipesModule
  ],
})
export class LawFileDetailPageModule {}
