import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolMapPage } from './patrol-map';

@NgModule({
  declarations: [
    PatrolMapPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolMapPage),
  ],
})
export class PatrolMapPageModule {}
