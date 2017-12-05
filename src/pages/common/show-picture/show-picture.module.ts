import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowPicturePage } from './show-picture';

@NgModule({
  declarations: [
    ShowPicturePage,
  ],
  imports: [
    IonicPageModule.forChild(ShowPicturePage),
  ],
})
export class ShowPicturePageModule {}
