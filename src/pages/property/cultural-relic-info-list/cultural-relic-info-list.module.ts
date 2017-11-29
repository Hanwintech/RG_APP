import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CulturalRelicInfoListPage } from './cultural-relic-info-list';

@NgModule({
  declarations: [
    CulturalRelicInfoListPage,
  ],
  imports: [
    IonicPageModule.forChild(CulturalRelicInfoListPage),
  ],
})
export class CulturalRelicInfoListPageModule {}
