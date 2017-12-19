import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolInfoListPage } from './patrol-info-list';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PatrolInfoListPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolInfoListPage),
    PipesModule
  ],
})
export class PatrolInfoListPageModule {}
