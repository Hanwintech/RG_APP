import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { GetPatrolProcessInfoList } from './../../../apis/patrol/patrol-info.api';
import { PatrolInfoDetails, UVPatrolCaseProcess } from './../../../models/patrol/patrol-info.model';
import { EnumProcessResult, EnumRunState } from './../../../models/enum';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-patrol-info-detail-process',
  templateUrl: 'patrol-info-detail-process.html',
})
export class PatrolInfoDetailProcessPage {
  private patrolInfo: PatrolInfoDetails;
  private patrolProcess: UVPatrolCaseProcess[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sms: SMS,
    private callNumber: CallNumber,
    public actionSheetCtrl: ActionSheetController,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    this.patrolInfo = this.navParams.data;

    this.apiService.sendApi(new GetPatrolProcessInfoList(this.patrolInfo.patrolInfo.keyID)).subscribe(
      res => {
        if (res.success) {
          this.patrolProcess = res.data.patrolProcessInfoList;
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  getProcessResultName(value: number): string {
    return EnumProcessResult[value];
  }

  getRunStateName(value: number): string {
    return EnumRunState[value];
  }

  showProcessDetail(processDetail: UVPatrolCaseProcess) {
    this.navCtrl.push("PatrolInfoDetailProcessDetailPage", processDetail);
  }

  optPhone(event, phoneNo: string) {
    event.stopPropagation();//阻止冒泡 
    let actionSheet = this.actionSheetCtrl.create({
      title: '操作',
      buttons: [
        {
          text: '拨打电话',
          handler: () => {
            window.location.href = "tel:" + phoneNo;
          }
        }, {
          text: '发送短信',
          handler: () => {
            this.sendMessage(phoneNo);
          }
        }, {
          text: '取消',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  callNUmber(phoneNo) {
    this.callNumber.callNumber(phoneNo, true)
      .then()
      .catch(() => this.pageService.showErrorMessage("初始化通话失败！"));
  }

  sendMessage(phoneNo) {
    let options = {
      android: {
        intent: 'INTENT'  // send SMS with the native android SMS messaging
      }
    };
    this.sms.send(phoneNo, ' ', options).then((e) => {}, error => {
      this.pageService.showErrorMessage("初始化失败！")
    });
  }

  close() {
    this.navCtrl.pop();
  }
}
