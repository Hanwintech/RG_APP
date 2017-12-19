import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetPatrolProcessDetailInfo } from './../../../apis/patrol/get-patrol-process-detail-info.api';
import { PatrolProcessInfoDetails } from './../../../models/patrol/patrol-info.model';
import { EnumProcessResult, EnumRunState } from './../../../models/enum';

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
    public fileTransfer: FileTransfer
  ) {
    super(navCtrl, file, fileTransfer, pageService);

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

  download(fileUrl: string, fileName: string) {
    super.downloadFile(fileUrl, fileName);
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
            console.log(phoneNo);
          }
        }, {
          text: '发送短信',
          handler: () => {
            console.log(phoneNo);
          }
        }, {
          text: '取消',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
}
