import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchConditionPage } from './search-condition';

@NgModule({
  declarations: [
    SearchConditionPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchConditionPage),
  ],
})
export class SearchConditionPageModule {}
