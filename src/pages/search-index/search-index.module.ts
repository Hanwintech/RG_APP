import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchIndexPage } from './search-index';

@NgModule({
  declarations: [
    SearchIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchIndexPage),
  ],
})
export class SearchIndexPageModule {}
