import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolInfoDetailProcessDetailPage } from './patrol-info-detail-process-detail';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PatrolInfoDetailProcessDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolInfoDetailProcessDetailPage),
    PipesModule
  ],
})
export class PatrolInfoDetailProcessDetailPageModule {}
