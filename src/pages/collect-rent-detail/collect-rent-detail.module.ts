import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectRentDetailPage } from './collect-rent-detail';

@NgModule({
  declarations: [
    CollectRentDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectRentDetailPage),
  ],
})
export class CollectRentDetailPageModule {}
