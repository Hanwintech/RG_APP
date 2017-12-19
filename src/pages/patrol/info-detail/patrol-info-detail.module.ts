import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolInfoDetailPage } from './patrol-info-detail';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PatrolInfoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolInfoDetailPage),
    PipesModule
  ],
})
export class PatrolInfoDetailPageModule {}
