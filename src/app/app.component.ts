import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  backButtonPressed: boolean = false;  //用于判断返回键是否触发

  rootPage: any = 'LoginPage';

  pages: Array<{title: string,icon: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    private toastCtrl: ToastController,
    private ionicApp: IonicApp) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '租金收取', icon: "cash", component: 'CollectRentPage' },
      { title: '签约费用收取',icon: "card", component: 'FirstCollectRentPage' },
      { title: '打印发票', icon: "print", component: 'InvoicePrintingPage' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.registerBackButtonAction();//注册返回按键事件
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot("LoginPage", { logout: true });
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
      let activePortal = this.ionicApp._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => { });
        activePortal.onDidDismiss(() => { });
        return;
      }
      // let activeVC = this.nav.getActive();
      // let tabs = activeVC.instance.tabs;
      // let activeNav = tabs.getSelected();
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
