import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicOpinionInfoSearchPage } from './public-opinion-info-search';

@NgModule({
  declarations: [
    PublicOpinionInfoSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicOpinionInfoSearchPage),
  ],
})
export class PublicOpinionInfoSearchPageModule {}
