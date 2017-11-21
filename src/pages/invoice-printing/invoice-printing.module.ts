import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicePrintingPage } from './invoice-printing';

@NgModule({
  declarations: [
    InvoicePrintingPage,
  ],
  imports: [
    IonicPageModule.forChild(InvoicePrintingPage),
  ],
})
export class InvoicePrintingPageModule {}
