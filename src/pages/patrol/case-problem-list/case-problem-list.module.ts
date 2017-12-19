import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaseProblemListPage } from './case-problem-list';

@NgModule({
  declarations: [
    CaseProblemListPage,
  ],
  imports: [
    IonicPageModule.forChild(CaseProblemListPage),
  ],
})
export class CaseProblemListPageModule {}
