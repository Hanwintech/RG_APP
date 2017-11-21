import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectRentPage } from './collect-rent';

@NgModule({
  declarations: [
    CollectRentPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectRentPage),
  ],
})
export class CollectRentPageModule {}
