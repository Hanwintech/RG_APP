import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapSearchPage } from './map-search';

@NgModule({
  declarations: [
    MapSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MapSearchPage),
  ],
})
export class MapSearchPageModule {}
