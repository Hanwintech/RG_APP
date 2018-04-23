import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CulturalRelicSelectPage } from './cultural-relic-select';
import { PipesModule } from './../../../pipes/pipes.module';

@NgModule({
  declarations: [
    CulturalRelicSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(CulturalRelicSelectPage),
    PipesModule
  ],
})
export class CulturalRelicSelectPageModule {}
