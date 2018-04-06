import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { JPush } from '@jiguang-ionic/jpush';
import { NativeService } from './../services/native.service';
import { LocationWatchService } from './../services/location-watch.service';

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
    public jpush:JPush,
    public nativeService: NativeService,
    public locationWatchService: LocationWatchService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.statusBar.hide();

    this.platform.ready().then(() => {
      this.locationWatchService.init();

      this.splashScreen.hide();

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
}
