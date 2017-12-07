import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MuseumInfoListPage } from './museum-info-list';

@NgModule({
  declarations: [
    MuseumInfoListPage,
  ],
  imports: [
    IonicPageModule.forChild(MuseumInfoListPage),
  ],
})
export class MuseumInfoListPageModule {}
