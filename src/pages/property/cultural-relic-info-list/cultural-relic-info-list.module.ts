import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CulturalRelicInfoListPage } from './cultural-relic-info-list';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    CulturalRelicInfoListPage,
  ],
  imports: [
    IonicPageModule.forChild(CulturalRelicInfoListPage),
    PipesModule
  ],
})
export class CulturalRelicInfoListPageModule {}
