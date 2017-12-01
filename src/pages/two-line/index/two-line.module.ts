import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TwoLinePage } from './two-line';

@NgModule({
  declarations: [
    TwoLinePage,
  ],
  imports: [
    IonicPageModule.forChild(TwoLinePage),
  ],
})
export class TwoLinePageModule {}
