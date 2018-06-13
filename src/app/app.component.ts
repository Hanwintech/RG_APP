import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, ToastController,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { JPush } from '@jiguang-ionic/jpush';
import { NativeService } from './../services/native.service';
import { LocationWatchService } from './../services/location-watch.service';
import { App, ViewController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

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
    public alertCtrl: AlertController,
    public jpush:JPush,
    private app: App,
    public nativeService: NativeService,
    private backgroundMode: BackgroundMode,
    public locationWatchService: LocationWatchService
  ) {
    this.initializeApp();
    const alert = this.alertCtrl.create({
      title: '请确保手机定位服务已打开!',
      buttons: ['确定']
    });
    alert.present();
  }

  initializeApp() {
    this.statusBar.hide();

    this.platform.ready().then(() => {
      this.locationWatchService.init();

      this.splashScreen.hide();
      this.registerBackButtonAction();//注册返回按键事件  
      if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
        this.jpush.init().then(res=>{ }).catch(res=>{
          console.log(res);
        });
        this.jpush.getRegistrationID().then(res=>{console.log("RegistrationID:" + res);}).catch(res=>{console.log(res)});

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
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();

      if (activePortal) {
        activePortal.dismiss();
      }
      else {
        let nav = this.app.getActiveNavs()[0];
        return nav.canGoBack() ? nav.pop() : this.showExit()
      }
    }, 1);
  }

    //双击退出提示框
    showExit() {
      if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
        // this.platform.exitApp();
        this.backgroundMode.moveToBackground();
      } else {
        this.toastCtrl.create({
          message: '再按一次退入后台',
          duration: 2000,
          position: 'bottom'
        }).present();
        this.backButtonPressed = true;
        setTimeout(() => this.backButtonPressed = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
      }
    }
}
