import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaseStatesPage } from './case-states';

@NgModule({
  declarations: [
    CaseStatesPage,
  ],
  imports: [
    IonicPageModule.forChild(CaseStatesPage),
  ],
})
export class CaseStatesPageModule {}
