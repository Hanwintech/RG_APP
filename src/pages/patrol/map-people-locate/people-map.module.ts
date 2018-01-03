import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeopleMapPage } from './people-map';

@NgModule({
  declarations: [
    PeopleMapPage,
  ],
  imports: [
    IonicPageModule.forChild(PeopleMapPage),
  ],
})
export class PeopleMapPageModule {}
