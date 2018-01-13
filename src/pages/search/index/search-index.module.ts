import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchIndexPage } from './search-index';

import { PipesModule } from './../../../pipes/pipes.module';
@NgModule({
  declarations: [
    SearchIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchIndexPage),
    PipesModule
  ],
})
export class SearchIndexPageModule {}
