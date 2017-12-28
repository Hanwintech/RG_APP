import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConstructionSiteInfoEditPage } from './construction-site-info-edit';

@NgModule({
  declarations: [
    ConstructionSiteInfoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ConstructionSiteInfoEditPage),
  ],
})
export class ConstructionSiteInfoEditPageModule {}
