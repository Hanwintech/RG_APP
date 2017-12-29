import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolInfoEditPage } from './patrol-info-edit';

@NgModule({
  declarations: [
    PatrolInfoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolInfoEditPage),
  ],
})
export class PatrolInfoEditPageModule {}
