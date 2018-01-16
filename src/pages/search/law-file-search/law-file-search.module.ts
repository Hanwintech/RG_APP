import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LawFileSearchPage } from './law-file-search';

@NgModule({
  declarations: [
    LawFileSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(LawFileSearchPage),
  ],
})
export class LawFileSearchPageModule {}
