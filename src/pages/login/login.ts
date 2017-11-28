import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, IonicPage } from 'ionic-angular';
import { ApiService } from '../../services/api.service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  auth = { account: "", password: "" };

  private areaCode = "";

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.areaCode = this.apiService.areaCode;

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
    }
  }

  private login() {
    if (this.auth.account.length == 0 || this.auth.password.length == 0) {
      return;
    }
    let loading = this.loadingCtrl.create({ dismissOnPageChange: true, content: '正在登录' });
    loading.present();
    this.apiService.getToken(this.auth.account, this.auth.password).subscribe(
      res => {
        let user = <any>res;
        localStorage.setItem('account', this.auth.account);
        localStorage.setItem('password', this.auth.password);
        this.apiService.token = user.access_token;
        this.navCtrl.setRoot("TabsPage");
      },
      error => {
        var message = '登录失败';
        if (error.status == 401) {
          message = "用户名或密码错误"
        }
        let alert = this.alertCtrl.create({
          title: message,
          subTitle: "",
          buttons: ['确定']
        });
        alert.present();
      });
  }
}