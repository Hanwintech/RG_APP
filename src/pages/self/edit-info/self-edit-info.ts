import { Component } from '@angular/core';
import { IonicPage, NavController, App } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { ValidateService } from './../../../services/validate.service';
import { UpdateUserInfo } from './../../../apis/self/update-user-info.api';
import { UserInfo, UserEntity } from './../../../models/user-info.model';

@IonicPage()
@Component({
  selector: 'page-self-edit-info',
  templateUrl: 'self-edit-info.html',
})
export class SelfEditInfoPage {
  private userInfo: UserEntity;
  private newPassword: string;
  private newPasswordConfirm: string;

  constructor(
    private navCtrl: NavController,
    private app: App,
    private apiService: ApiService,
    private pageService: PageService,
    private validateService: ValidateService
  ) {
    this.userInfo = new UserEntity(localStorage.getItem('account'), localStorage.getItem('name'));
    this.userInfo.id = localStorage.getItem("userId");
    this.userInfo.manageUnit = localStorage.getItem("manageUnitId");
    this.userInfo.userType = Number(localStorage.getItem("userType"));
    this.userInfo.mobilePhone = localStorage.getItem('mobile');
    this.userInfo.officePhone = localStorage.getItem('phone');
    this.userInfo.email = localStorage.getItem('email');
  }

  submit() {
    let model: UserInfo = new UserInfo();

    if (this.userInfo.mobilePhone && !this.validateService.isMobilePhoneNumber(this.userInfo.mobilePhone)) {
      this.pageService.showErrorMessage('请正确填写手机号！');
      return;
    }
    if (this.userInfo.officePhone && !this.validateService.isTelephoneNumber(this.userInfo.officePhone)) {
      this.pageService.showErrorMessage('请正确填写座机号！格式：(区号)-(座机号)');
      return;
    }
    if (this.userInfo.email && !this.validateService.isEmail(this.userInfo.email)) {
      this.pageService.showErrorMessage('请正确填写邮箱！');
      return;
    }
    if (this.userInfo.password || this.newPassword || this.newPasswordConfirm) {
      if (!this.userInfo.password) {
        this.pageService.showErrorMessage('如需修改密码，请填写原始密码！');
        return;
      }
      if (!this.newPassword) {
        this.pageService.showErrorMessage('如需修改密码，请填写新密码！');
        return;
      }
      if (this.userInfo.password == this.newPassword) {
        this.pageService.showErrorMessage('新密码与原始密码不可相同！');
        return;
      }
      if (this.newPassword != this.newPasswordConfirm) {
        this.pageService.showErrorMessage('新密码与密码确认不相同！');
        return;
      }
      model.newPassword = this.newPassword;
    }

    model.user = this.userInfo;

    this.pageService.showLoading("提交中...");
    this.apiService.sendApi(new UpdateUserInfo(model)).subscribe(
      res => {
        this.pageService.dismissLoading();
        if (res.success) {
          if (model.newPassword) {
            localStorage.setItem('password', model.newPassword);
          }
          localStorage.setItem('mobile', model.user.mobilePhone);
          localStorage.setItem('phone', model.user.officePhone);
          localStorage.setItem('email', model.user.email);
          this.pageService.showMessage('提交成功!');
          this.navCtrl.pop();
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.dismissLoading();
        this.pageService.showErrorMessage(error);
      })
  }

  exitMenu() {
    this.pageService.showComfirmMessage(
      '确定要退出吗！',
      () => { this.app.getRootNav().setRoot("LoginPage", { logout: true }); },
      () => { });
  }
}
