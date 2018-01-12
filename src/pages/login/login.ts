import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { JPushService } from 'ionic2-jpush/dist';

import { ApiService } from './../../services/api.service';
import { PageService } from './../../services/page.service';
import { LocationWatchService } from './../../services/location-watch.service';

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
    public jPushPlugin: JPushService,
    public platform: Platform,
    public apiService: ApiService,
    public pageService: PageService,
    public locationWatchService: LocationWatchService
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
      this.locationWatchService.stop();
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



        //注册极光推送
        if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
          this.jPushPlugin.init()
            .then(res => console.log("init:" + res))
            .catch(err => console.log("init error:" + err));

            
          this.jPushPlugin.getRegistrationID()
            .then(res => {
              console.log("getRegistrationID:" + res);

              this.jPushPlugin.setAlias(this.auth.account)
                .then(r => {
                  console.log("setAlias:" + r);
                })
                .catch(error => {
                  console.log("setAlias error:" + error);
                  this.pageService.showErrorMessage('推送服务注册失败！');
                });
              // if (this.device.platform == 'Android') {
              //   this.jPushPlugin.setAlias("");
              //   this.jPushPlugin.clearAllNotification()
              // } else if (this.device.platform == 'iOS') {
              //   this.jPushPlugin.setAlias("");
              // }
            })
            .catch(err => console.log("getRegistrationID error:" + err));

          let receiveNotification = this.jPushPlugin.receiveNotification().subscribe(
            event => {
              console.log("receiveNotification error:" + event);
              this.pageService.showMessage(event);
            },
            error => { console.log("receiveNotification error:" + error); },
            () => { console.log("receiveNotification complete"); });
        }



        // if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
        //   this.jPushPlugin.setAlias(this.auth.account)
        //     .then(r => {
        //       console.log("setAlias:" + r);
        //     })
        //     .catch(error => {
        //       console.log("setAlias error:" + error);
        //       this.pageService.showErrorMessage('推送服务注册失败！');
        //     });
        // }

        this.locationWatchService.start();
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