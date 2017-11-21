import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrinterManagePage } from './printer-manage';

@NgModule({
  declarations: [
    PrinterManagePage,
  ],
  imports: [
    IonicPageModule.forChild(PrinterManagePage),
  ],
})
export class PrinterManagePageModule {}
