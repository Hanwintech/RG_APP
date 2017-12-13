import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicOpinionInfoListPage } from './public-opinion-info-list';

import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PublicOpinionInfoListPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicOpinionInfoListPage),
    PipesModule
  ],
})
export class PublicOpinionInfoListPageModule {}
