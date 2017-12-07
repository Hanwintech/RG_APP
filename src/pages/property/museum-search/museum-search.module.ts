import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MuseumSearchPage } from './museum-search';

@NgModule({
  declarations: [
    MuseumSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MuseumSearchPage),
  ],
})
export class MuseumSearchPageModule {}
