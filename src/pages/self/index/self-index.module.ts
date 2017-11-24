import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelfIndexPage } from './self-index';

@NgModule({
  declarations: [
    SelfIndexPage,
  ],
  imports: [
    IonicPageModule.forChild(SelfIndexPage),
  ],
})
export class SelfIndexPageModule {}
