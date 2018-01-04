import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapLocatePage } from './map-locate';

@NgModule({
  declarations: [
    MapLocatePage,
  ],
  imports: [
    IonicPageModule.forChild(MapLocatePage),
  ],
})
export class MapLocatePageModule {}
