import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform } from 'ionic-angular';

import { ApiService } from './../../services/api.service';
import { PageService } from './../../services/page.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  auth = { account: "", password: "" };

  private areaCode: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private platform: Platform,
    private apiService: ApiService,
    private pageService: PageService
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
      localStorage.removeItem('userType');
      localStorage.removeItem('appRole');
      localStorage.removeItem('mobile');
      localStorage.removeItem('phone');
      localStorage.removeItem('email');

      // if (this.device.platform == 'Android') {
      //   (<any>window).plugins.jPushPlugin.setAlias("");
      //   (<any>window).plugins.jPushPlugin.clearAllNotification()
      // } else if (this.device.platform == 'iOS') {
      //   (<any>window).plugins.jPushPlugin.setAlias("");
      // }
    }
  }

  private login() {
    if (this.auth.account.length == 0 || this.auth.password.length == 0) {
      return;
    }

    this.apiService.getToken(this.auth.account, this.auth.password).subscribe(
      res => {
        this.pageService.dismissLoading();
        localStorage.setItem('account', this.auth.account);
        localStorage.setItem('password', this.auth.password);
        localStorage.setItem('name', res.userName);
        localStorage.setItem('userId', res.userID);
        localStorage.setItem('manageUnitId', res.manageUnitID);
        localStorage.setItem('userType', res.userType);
        localStorage.setItem('appRole', "[" + res.appRole + "]");
        localStorage.setItem('mobile', res.mobilePhone);
        localStorage.setItem('phone', res.officePhone);
        localStorage.setItem('email', res.email);
        this.apiService.token = res.access_token;

        // if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
        //   (<any>window).plugins.jPushPlugin.setAlias([this.auth.account],
        //     r => { },
        //     error => { this.pageService.showErrorMessage('推送服务注册失败！'); });
        // }

        this.navCtrl.setRoot("TabsPage");
      },
      error => {
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