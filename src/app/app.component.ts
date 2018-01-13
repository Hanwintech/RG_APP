import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';

import { NativeService } from './../services/native.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发

  rootPage: any = 'LoginPage';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public toastCtrl: ToastController,
    public ionicApp: IonicApp,
    public device: Device,
    public nativeService: NativeService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //注册返回按键事件
      //this.registerBackButtonAction();

      if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
        (<any>window).plugins.jPushPlugin.init();
        (<any>window).plugins.jPushPlugin.getRegistrationID(function (data) { console.log("RegistrationID:" + data); });

        document.addEventListener("jpush.receiveNotification", event => {
          let alertContent = this.device.platform == "Android" ? (<any>event).alert : (<any>event).aps.alert;
          let toast = this.toastCtrl.create({ message: alertContent, duration: 3000, position: 'bottom' });
          toast.present();
        }, false);
      }

      //检查APP更新
      this.nativeService.detectionUpgrade();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot("LoginPage", { logout: true });
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => { });
        activePortal.onDidDismiss(() => { });
        return;
      }
      console.log(this.nav);
      console.log(this.nav.getViews());
      console.log(this.nav.getActiveChildNavs()[0].getActiveChildNavs()[0]);
      return this.nav.canGoBack() ? this.nav.pop() : this.showExit()
    }, 1);
  }

  //双击退出提示框
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 2000,
        position: 'bottom'
      }).present();
      this.backButtonPressed = true;
      setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
}
