import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TwoLineSearchPage } from './two-line-search';

@NgModule({
  declarations: [
    TwoLineSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(TwoLineSearchPage),
  ],
})
export class TwoLineSearchPageModule {}
