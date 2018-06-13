import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController,ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { NetworkInformationService } from './../../../services/network-information.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetPatrolProcessDetailInfo } from './../../../apis/patrol/patrol-info.api';
import { PatrolProcessInfoDetails } from './../../../models/patrol/patrol-info.model';
import { EnumProcessResult, EnumRunState } from './../../../models/enum';
import { Attachment } from "./../../../models/attachment.model";

@IonicPage()
@Component({
  selector: 'page-patrol-info-detail-process-detail',
  templateUrl: 'patrol-info-detail-process-detail.html',
})
export class PatrolInfoDetailProcessDetailPage extends DetailPage {
  private processInfo: PatrolProcessInfoDetails;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public apiService: ApiService,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer,
    public fileOpener: FileOpener,
    public sms: SMS,
    public callNumber: CallNumber,
    public modalCtrl:ModalController,
    public networkInfoService: NetworkInformationService
  ) {
    super(navCtrl, file, fileTransfer, pageService,modalCtrl);

    this.processInfo = new PatrolProcessInfoDetails();
    this.processInfo.patrolCaseProcess = this.navParams.data;

    this.apiService.sendApi(new GetPatrolProcessDetailInfo(this.processInfo.patrolCaseProcess.keyID)).subscribe(
      res => {
        if (res.success) {
          this.processInfo = res.data;

          super.changeAttachmentFileType(this.processInfo.attachmentList)
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

  download(file: Attachment) {
    file.startDowload=true;
    super.downloadFile(this.networkInfoService, file);
  }

  open(file: Attachment) {
    super.openFile(this.fileOpener, file);
  }

  showPicture(fileUrl: string) {
    super.showSlidesPage(this.processInfo.attachmentList, fileUrl);
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
}
