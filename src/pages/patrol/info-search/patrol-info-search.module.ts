import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolInfoSearchPage } from './patrol-info-search';

@NgModule({
  declarations: [
    PatrolInfoSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolInfoSearchPage),
  ],
})
export class PatrolInfoSearchPageModule {}
