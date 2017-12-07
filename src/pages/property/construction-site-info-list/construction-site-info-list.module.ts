import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstructionSiteInfoListPage } from './construction-site-info-list';

@NgModule({
  declarations: [
    ConstructionSiteInfoListPage,
  ],
  imports: [
    IonicPageModule.forChild(ConstructionSiteInfoListPage),
  ],
})
export class ConstructionSiteInfoListPageModule {}
