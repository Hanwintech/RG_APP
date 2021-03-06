import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform, ActionSheetController, ModalController, ViewController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetPatrolInfo } from './../../../apis/patrol/patrol-info.api';
import { PatrolInfoDetails, UVPatrolCaseProcess, PatrolProcessInfo } from './../../../models/patrol/patrol-info.model';
import { GetPatrolProcessInfoList, getPatrolProcessInfo, PostPatrolProcessInfo } from './../../../apis/patrol/patrol-info.api';
import { EnumProcessResult, EnumRunState, EnumAttachmentType } from './../../../models/enum';
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
  private patrolProcessInfo: PatrolProcessInfo;
  private canShowLocation = true;
  private patrolReplay = this.navParams.data.patrolReplay ? true : false;//控制ion-menu里巡查处理按钮显示
  private patrolDispose = this.navParams.data.patrolReplay ? true : false;//ion-menu里按钮的选中状态判断
  private pageTitle;
  private segmentOne;
  private segmentTwo;
  private segmentThree;
  private canShowFooter = false;
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public sms: SMS,
    public callNumber: CallNumber,
    public menuCtrl: MenuController,
    public apiService: ApiService,
    public nativeImgService: nativeImgService,
    public imagePickerService: ImagePickerService,
    public fileUploadService: FileUploadService,
    public actionSheetCtrl: ActionSheetController,
    public pageService: PageService,
    public platform: Platform,
    public file: File,
    public fileTransfer: FileTransfer
  ) {
    super(navCtrl, file, fileTransfer, pageService,modalCtrl);
    this.pageService.showLoading("正在加载数据");
    if (this.navParams.data.patrolReplay) {
      this.segmentThree = true;
      this.canShowFooter = true;
      this.pageTitle = "巡查处理";
      this.showReplayPage();
      let keyID = this.navParams.data.keyID ? this.navParams.data.keyID : this.navParams.data.patrolInfo.keyID;
      this.apiService.sendApi(new getPatrolProcessInfo(keyID, localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
        res => {
          this.pageService.dismissLoading();
          if (res.success) {
            this.patrolProcessInfo = res.data;
          } else {
            this.pageService.showErrorMessage(res.reason);
          }
        },
        error => {
          this.pageService.dismissLoading();
          this.pageService.showErrorMessage(error);
        });
    }
    else {
      this.pageTitle = "巡查记录详情";
      this.segmentOne = true;
      this.getPatroInfo();
    }
  }
  ionViewWillLeave() {
    //this.pageService.showLoading("");
    // this.segmentOne = false;
    // this.segmentTwo = false;
    // this.segmentThree = false;
    // this.canShowFooter = false;
    //this.pageService.dismissLoading();
  }

  ionViewDidLeave(){
    this.pageService.dismissLoading();
  }
  getPatroInfo() {
    let keyID = this.navParams.data.keyID ? this.navParams.data.keyID : this.navParams.data.patrolInfo.keyID;
    this.apiService.sendApi(new GetPatrolInfo(keyID, localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
      res => {
        this.pageService.dismissLoading();
        this.canShowFooter = true;
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
        this.pageService.dismissLoading();
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
    this.canShowLocation = false;
    this.patrolDispose = false;
    this.segmentOne = false;
    this.segmentTwo = true;
    this.pageTitle = "巡查处理日志";
    this.segmentThree = false;
    let keyID = this.navParams.data.keyID ? this.navParams.data.keyID : this.navParams.data.patrolInfo.keyID;
    this.apiService.sendApi(new GetPatrolProcessInfoList(keyID)).subscribe(
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

  showSelfPage() {
    this.menuCtrl.close();
    this.segmentOne = true;
    this.segmentTwo = false;
    this.segmentThree = false;
    this.pageTitle = "巡查记录详情";
    this.getPatroInfo();
  }

  showReplayPage() {
    this.menuCtrl.close();
    this.patrolDispose = true;
    this.segmentOne = false;
    this.segmentTwo = false;
    this.segmentThree = true;
    this.pageTitle = "巡查处理";
    this.canShowLocation = false;
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
    this.imagePickerService.getPictures(null).then(
      attachments => {
        if (attachments) {
          super.changeAttachmentFileType(attachments);
          for (let att of attachments) {
            att.category = EnumAttachmentType.巡查处理附件;
            att.fileShowName = "巡查处理附件.jpg";
          }
          if (!this.patrolProcessInfo.attachmentList) {
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


  showSlideAttachment(attachment) {
    super.showSlidesPage(this.patrolInfo.attachmentList, attachment.fileUrl);
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


  showPersonPage() {
    let showPerson = this.modalCtrl.create("PatrolUserInfoPage", this.patrolProcessInfo.canSelectPatrolUserInfoList);
    showPerson.onDidDismiss(data => {
      if (data) {
        for (let item of data) {
          delete item.boolData;
        }
        this.patrolProcessInfo.selectedUserInfoList = data;
      }
    });
    showPerson.present();
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

  saveData() {
    let valiMessage = "";

    if (!this.patrolProcessInfo.patrolCaseProcess.processResult) {
      valiMessage += '、处理结果';
    }

    if (this.patrolProcessInfo.patrolCaseProcess.processResult == EnumProcessResult["转送处理"]) {
      if (!this.patrolProcessInfo.selectedUserInfoList || this.patrolProcessInfo.selectedUserInfoList.length < 0) {
        valiMessage += '、处理人员';
      }
    }

    if (!this.patrolProcessInfo.patrolCaseProcess.processDescription) {
      valiMessage += '、处理说明';
    }

    if (valiMessage) {
      this.pageService.showErrorMessage("请填写以下内容：" + valiMessage.substring(1) + "！");
      return;
    }

    this.pageService.showComfirmMessage("确定要提交巡查处理信息吗？",
      () => {
        this.patrolProcessInfo.patrolCaseProcess.updaterID = localStorage.getItem("userId");
        this.patrolProcessInfo.patrolCaseProcess.submitUser = localStorage.getItem("userId");
        this.patrolProcessInfo.patrolCaseProcess.submitUserManageUnitID = localStorage.getItem("manageUnitId");
        this.apiService.sendApi(new PostPatrolProcessInfo(this.patrolProcessInfo)).subscribe(
          res => {
            if (res.success) {
              this.viewCtrl.dismiss(true);
            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
      },
      () => { });
  }
  showPic(pic) {
    let picArray = [];
    picArray.push(pic);
   // this.navCtrl.push("ShowPicturePage", { "picUrls": picArray, "currentIndex": 0 });
    this.modalCtrl.create("ShowPicturePage", { "picUrls": picArray, "currentIndex": 0  }).present();
  }
  close() {
    var navOptions = {animate:false};
    this.viewCtrl.dismiss(false,null,navOptions);
  }
}
