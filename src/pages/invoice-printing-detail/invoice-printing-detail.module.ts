import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicePrintingDetailPage } from './invoice-printing-detail';

@NgModule({
  declarations: [
    InvoicePrintingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoicePrintingDetailPage),
    PipesModule
  ],
})
export class InvoicePrintingDetailPageModule {}
