import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PatrolInfoEditPage } from './patrol-info-edit';

import { PipesModule } from './../../../pipes/pipes.module';
import { DateTime } from './../../../pipes/datetime.pipe';

@NgModule({
  declarations: [
    PatrolInfoEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PatrolInfoEditPage),
    PipesModule
  ],
  providers: [
    DateTime
  ]
})
export class PatrolInfoEditPageModule { }
