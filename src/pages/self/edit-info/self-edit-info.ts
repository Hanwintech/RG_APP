import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, App, NavParams, ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the SelfEditInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-self-edit-info',
  templateUrl: 'self-edit-info.html',
})
export class SelfEditInfoPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController) {
  }


  exitMenu() {
    let that = this;
    let actionSheet = this.actionSheetCtrl.create({
      title: '请确保您的数据已上传，若退出系统，则您在此工作机上存储的数据将被清空！',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: '确认',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'checkmark' : null,
          handler: () => {
            that.app.getRootNav().setRoot("LoginPage", { logout: true });
          }
        }, {
          text: '取消',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
  }


}
