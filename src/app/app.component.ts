import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, IonicApp, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { PostUserCoordinateInfo } from './../apis/system/system.api';
import { UserLocationInfo } from './../models/system/user-location-info.model';

declare var BMap;

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
    public geolocation: Geolocation,
    public ionicApp: IonicApp,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.registerBackButtonAction();//注册返回按键事件
      this.watchPosition();//监控实时位置
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
      console.log(this.nav.getActiveChildNavs());
      console.log(this.nav.getActiveChildNavs()[0].length());
      console.log(this.nav.getActiveChildNavs()[0].getActiveChildNavs());
      console.log(this.nav.getActiveChildNavs()[0].getActiveChildNavs().length);
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

  //监控实时位置
  watchPosition() {
    // localStorage.setItem('longitude', '120.78877004348');
    // localStorage.setItem('latitude', '31.346248778536');

    this.geolocation.watchPosition().subscribe(
      res => {
        if (res && res.coords) {
          let pointArr = [new BMap.Point(res.coords.longitude, res.coords.latitude)];
          new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
            if (data.status === 0) {
              localStorage.setItem('longitude', data.points[0].lng);
              localStorage.setItem('latitude', data.points[0].lat);
              this.uploadLocation();
            } else {
              localStorage.removeItem('longitude');
              localStorage.removeItem('latitude');
              this.pageService.showErrorMessage("获取地理坐标失败！");
            }
          }.bind(this));
        } else {
          localStorage.removeItem('longitude');
          localStorage.removeItem('latitude');
          this.pageService.showErrorMessage("获取地理位置失败！");
        }
        // localStorage.setItem('longitude', '120.78877004348');
        // localStorage.setItem('latitude', '31.346248778536');
      },
      error => {
        this.pageService.showErrorMessage("获取地理位置出错！");
      },
      () => {
        localStorage.removeItem('longitude');
        localStorage.removeItem('latitude');
      }
    );
  }

  uploadLocation(){
    let location: UserLocationInfo = new UserLocationInfo();
    location.userId = localStorage.getItem('userId')
    location.longitude = localStorage.getItem('longitude')
    location.latitude = localStorage.getItem('latitude')
    this.apiService.sendApi(new PostUserCoordinateInfo(location)).subscribe(
      res => { },
      error => { this.pageService.showErrorMessage("上传地理坐标出错！"); },
      () => { }
    );
  }
}
