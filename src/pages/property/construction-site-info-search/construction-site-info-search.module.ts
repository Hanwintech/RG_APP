import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstructionSiteInfoSearchPage } from './construction-site-info-search';

@NgModule({
  declarations: [
    ConstructionSiteInfoSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ConstructionSiteInfoSearchPage),
  ],
})
export class ConstructionSiteInfoSearchPageModule {}
