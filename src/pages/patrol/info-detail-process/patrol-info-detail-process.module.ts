import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolInfoDetailProcessPage } from './patrol-info-detail-process';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PatrolInfoDetailProcessPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolInfoDetailProcessPage),
    PipesModule
  ],
})
export class PatrolInfoDetailProcessPageModule {}
