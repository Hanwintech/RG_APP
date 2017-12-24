import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MuseumInfoEditPage } from './museum-info-edit';

@NgModule({
  declarations: [
    MuseumInfoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(MuseumInfoEditPage),
  ],
})
export class MuseumInfoEditPageModule {}
