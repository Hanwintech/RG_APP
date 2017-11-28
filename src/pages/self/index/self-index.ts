import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, App, NavParams, ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the SelfIndexPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-self-index',
  templateUrl: 'self-index.html',
})
export class SelfIndexPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController) {
  }

  private editInfo(){
    this.navCtrl.push("SelfEditInfoPage");
  }
}
