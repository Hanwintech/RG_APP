import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MuseumInfoDetailPage } from './museum-info-detail';

@NgModule({
  declarations: [
    MuseumInfoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MuseumInfoDetailPage),
  ],
})
export class MuseumInfoDetailPageModule {}
