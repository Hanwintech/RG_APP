import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPeopleLocatePage } from './map-people-locate';

@NgModule({
  declarations: [
    MapPeopleLocatePage,
  ],
  imports: [
    IonicPageModule.forChild(MapPeopleLocatePage),
  ],
})
export class MapPeopleLocatePageModule {}
