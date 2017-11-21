import { BLEService } from './../../services/ble.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrinterManagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printer-manage',
  templateUrl: 'printer-manage.html',
})
export class PrinterManagePage {
  devices = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private bleService: BLEService
  ) {
  }

  openBLE(){ 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrinterManagePage');
  }

}
