import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonSimpleSearchPage } from './common-simple-search';

@NgModule({
  declarations: [
    CommonSimpleSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonSimpleSearchPage),
  ],
})
export class CommonSimpleSearchPageModule {}
