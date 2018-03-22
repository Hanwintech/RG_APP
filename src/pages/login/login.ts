import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';

import { ApiService } from './../../services/api.service';
import { PageService } from './../../services/page.service';
import { LocationWatchService } from './../../services/location-watch.service';
import { NativeService } from './../../services/native.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  auth = { account: "", password: "" };

  private areaCode: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public device: Device,
    public platform: Platform,
    public apiService: ApiService,
    public pageService: PageService,
    public locationWatchService: LocationWatchService,
    public nativeService: NativeService
  ) {
    this.areaCode = this.apiService.areaCode.toString();

    var logout = navParams.get("logout");
    if (!logout) {
      var account = localStorage.getItem('account');
      var password = localStorage.getItem('password');
      if (account && password) {
        this.auth.account = account;
        this.auth.password = password;
        this.login();
      }
    } else {
      localStorage.removeItem('account');
      localStorage.removeItem('password');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
      localStorage.removeItem('manageUnitId');
      localStorage.removeItem('manageUnitName');
      localStorage.removeItem('userType');
      localStorage.removeItem('appRole');
      localStorage.removeItem('mobile');
      localStorage.removeItem('phone');
      localStorage.removeItem('email');
      if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
        (<any>window).plugins.jPushPlugin.setAlias({ "sequence": 0, "alias": "" },
          function (r) {
            console.log(r);
          },
          function (errorMsg) {
            console.log("setAlias error:");
            console.log(errorMsg);
            this.pageService.showErrorMessage('推送服务注册失败！');
          }.bind(this));
      }
      this.locationWatchService.stop();
    }
  }

  private login() {
    if (this.auth.account.length == 0 || this.auth.password.length == 0) {
      this.pageService.showErrorMessage("请输入用户名密码！");
    } else {
      this.pageService.showLoading("登录中");
      this.apiService.getToken(this.auth.account, this.auth.password).subscribe(
        res => {
          this.pageService.dismissLoading();
          localStorage.setItem('account', this.auth.account);
          localStorage.setItem('password', this.auth.password);
          localStorage.setItem('name', res.userName);
          localStorage.setItem('userId', res.userID);
          localStorage.setItem('manageUnitId', res.manageUnitID);
          localStorage.setItem('manageUnitName', res.manageUnitName);
          localStorage.setItem('userType', res.userType);
          localStorage.setItem('appRole', "[" + res.appRole + "]");
          localStorage.setItem('mobile', res.mobilePhone ? res.mobilePhone : "");
          localStorage.setItem('phone', res.officePhone ? res.officePhone : "");
          localStorage.setItem('email', res.email ? res.email : "");
          this.apiService.token = res.access_token;
  
          if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
            let alias = res.userID.replace("-", "").replace("-", "").replace("-", "").replace("-", "");
            (<any>window).plugins.jPushPlugin.setAlias({ "sequence": 0, "alias": alias },
              function (r) {
                console.log(r);
              },
              function (errorMsg) {
                console.log("setAlias error:");
                console.log(errorMsg);
                this.pageService.showErrorMessage('推送服务注册失败！');
              }.bind(this));
          }
  
          this.locationWatchService.start();
          this.navCtrl.setRoot("TabsPage");
        },
        error => {
          this.pageService.dismissLoading();
          var message = '登录失败！';
          if (error.status == 401) {
            message = "用户名或密码错误！"
          } else {
            console.log(error)
          }
          this.pageService.showErrorMessage(message);
        });
    }
  }
}