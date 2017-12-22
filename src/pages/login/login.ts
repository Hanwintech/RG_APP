import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

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
    }
  }

  private count =3;
  private attachments: string[];

  private login() {
    let aa = ["1", "2", "3"];
    let note
    this.attachments = new Array(3);
    console.log(this.attachments[0]);
    console.log(this.attachments[1]);
    console.log(this.attachments[2]);
    
    for (let i = 0; i < this.count; i++) {
      // let a = new Attachment();
       let a = aa[i];
       this.attachments[i] = a;

    console.log(this.attachments[0]);
    console.log(this.attachments[1]);
    console.log(this.attachments[2]);
    }

    // if (this.onUploadCompleted) {
    //   this.onUploadCompleted(this.attachments);
    // }



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