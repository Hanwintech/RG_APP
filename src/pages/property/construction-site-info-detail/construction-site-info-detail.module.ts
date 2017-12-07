import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstructionSiteInfoDetailPage } from './construction-site-info-detail';

@NgModule({
  declarations: [
    ConstructionSiteInfoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ConstructionSiteInfoDetailPage),
  ],
})
export class ConstructionSiteInfoDetailPageModule {}
