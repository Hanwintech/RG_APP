import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolUserInfoPage } from './patrol-user-info';

@NgModule({
  declarations: [
    PatrolUserInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolUserInfoPage),
  ],
})
export class PatrolUserInfoPageModule {}
