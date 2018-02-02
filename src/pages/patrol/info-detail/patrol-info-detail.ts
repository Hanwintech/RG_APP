import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetPatrolInfo } from './../../../apis/patrol/patrol-info.api';
import { PatrolInfoDetails, UVPatrolCaseProcess,PatrolProcessInfo } from './../../../models/patrol/patrol-info.model';
import { GetPatrolProcessInfoList, getPatrolProcessInfo, PostPatrolProcessInfo, GetPatrolPlanUserInfos } from './../../../apis/patrol/patrol-info.api';
import { EnumProcessResult, EnumRunState, EnumPlanUserType,EnumAttachmentType } from './../../../models/enum';
import { nativeImgService } from './../../../services/nativeImg.service';
import { ImagePickerService } from './../../../services/image-picker.service';
import { FileUploadService } from './../../../services/file-upload.service';

import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';

@IonicPage()
@Component({
  selector: 'page-patrol-info-detail',
  templateUrl: 'patrol-info-detail.html',
})
export class PatrolInfoDetailPage extends DetailPage {
  private patrolInfo: PatrolInfoDetails;
  private caseProblem: string[];
  private patrolProcess: UVPatrolCaseProcess[];
  private patrolProcessInfo:PatrolProcessInfo;
  private canShowLocation = true;
  private patrolReplay;
  private patrolDispose;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sms: SMS,
    private callNumber: CallNumber,
    public menuCtrl: MenuController,
    public apiService: ApiService,
    public nativeImgService: nativeImgService,
    public imagePickerService: ImagePickerService,
    public fileUploadService: FileUploadService,
    public actionSheetCtrl: ActionSheetController,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer
  ) {
    super(navCtrl, file, fileTransfer, pageService);
    this.patrolReplay = this.navParams.data.patrolReplay ? true : false;
    this.patrolDispose=this.navParams.data.patrolReplay ? true : false;
    console.log("处理页面");
    console.log(this.navParams.data);
    this.getPatroInfo();
  }

  getPatroInfo() {
    let keyID = this.navParams.data.keyID ? this.navParams.data.keyID : this.navParams.data.patrolInfo.keyID;
    this.apiService.sendApi(new GetPatrolInfo(keyID, localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
      res => {
        if (res.success) {
          this.patrolInfo = res.data;
          this.canShowLocation = true;
          let allProblems = {};
          for (let p of this.patrolInfo.patrolCaseProblemList) {
            allProblems[p.caseValue] = p.caseProblem;
          }

          this.caseProblem = [];
          for (let i: number = 0; i < this.patrolInfo.selectedCaseProblemList.length; i++) {
            this.caseProblem.push((i + 1).toString() + "." + allProblems[this.patrolInfo.selectedCaseProblemList[i]]);
          }

          super.changeAttachmentFileType(this.patrolInfo.attachmentList);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showLocation() {
    this.apiService.sendApi(new GetCulturalRelicInfo(this.patrolInfo.patrolInfo.fK_CulturalRelicID)).subscribe(
      res => {
        if (res.success) {
          let culturalRelicInfo: CulturalRelicInfo = res.data;
          this.navCtrl.push('MapPeopleLocatePage', { "culturalRelicInfo": culturalRelicInfo, "patrolInfo": this.patrolInfo }
          );
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showCulturalRelic(fK_CulturalRelicID: string) {
    this.navCtrl.push('CulturalRelicInfoDetailPage', fK_CulturalRelicID);
  }

  showCaseProblem() {
    this.navCtrl.push('CaseProblemListPage', { "list": this.patrolInfo.patrolCaseProblemList, "selected": this.patrolInfo.selectedCaseProblemList });
  }

  toogelMenu() {
    this.menuCtrl.open();
  }

  showLogPage() {
    this.menuCtrl.close();
    let keyID = this.navParams.data.keyID ? this.navParams.data.keyID : this.navParams.data.patrolInfo.keyID;
    this.apiService.sendApi(new GetPatrolProcessInfoList(keyID)).subscribe(
      res => {
        if (res.success) {
          this.patrolProcess = res.data.patrolProcessInfoList;
          this.canShowLocation = false;
          this.patrolDispose=false;
          this.patrolInfo = null;
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showSelfPage() {
    this.menuCtrl.close();
    this.patrolProcess = null;
    this.patrolDispose=false;
    this.getPatroInfo();

  }

  showReplayPage() {
    this.menuCtrl.close();
    this.patrolDispose=true;
    this.patrolInfo = null;
    this.canShowLocation = false;
    let keyID = this.navParams.data.keyID ? this.navParams.data.keyID : this.navParams.data.patrolInfo.keyID;
    this.apiService.sendApi(new getPatrolProcessInfo(keyID, localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
      res => {
        if (res.success) {
          this.patrolProcessInfo=res.data;
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

  selectAttachmentList() {
    this.imagePickerService.getPictures().then(
      attachments => {
        if (attachments) {
          super.changeAttachmentFileType(attachments);
          for (let att of attachments) {
            att.category = EnumAttachmentType.不可移动文物附件;
          }
          if (!this.patrolProcessInfo) {
            this.patrolProcessInfo.attachmentList = [];
          }
          this.patrolProcessInfo.attachmentList = this.patrolProcessInfo.attachmentList.concat(attachments);
        } else {
          this.pageService.showErrorMessage("上传图片失败！");
        }
      },
      error => {
        if (typeof error === 'string') {
          this.pageService.showErrorMessage(error);
        } else {
          this.pageService.showErrorMessage("上传图片失败！");
        }
      });
  }

  showAttachmentList(attachment) {
    super.showSlidesPage(this.patrolProcessInfo.attachmentList, attachment.fileUrl);
  }

  delAttachmentList(attachment) {
    this.pageService.showComfirmMessage("确定要删除吗？",
      () => {
        let tempArray = [];
        for (let atta of this.patrolProcessInfo.attachmentList) {
          if (attachment.attachmentId != atta.attachmentId) {
            tempArray.push(atta);
          }
        }
        this.patrolProcessInfo.attachmentList = tempArray;
      },
      () => { });
  }


  showPersonPage(){
    this.navCtrl.push("PatrolUserInfoPage", this.patrolProcessInfo.canSelectPatrolUserInfoList);
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
    this.sms.send(phoneNo, ' ', options).then((e) => { }, error => {
      this.pageService.showErrorMessage("初始化失败！")
    });
  }

  close() {
    this.navCtrl.pop();
  }
}
