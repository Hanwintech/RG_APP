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
import { PatrolInfoDetails, UVPatrolCaseProcess } from './../../../models/patrol/patrol-info.model';
import { GetPatrolProcessInfoList,getPatrolProcessInfo, PostPatrolProcessInfo} from './../../../apis/patrol/patrol-info.api';
import { EnumProcessResult, EnumRunState } from './../../../models/enum';
import { nativeImgService } from './../../../services/nativeImg.service';
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
  private canShowLocation = true;
  private patrolReplay;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sms: SMS,
    private callNumber: CallNumber,
    public menuCtrl: MenuController,
    public apiService: ApiService,
    public nativeImgService: nativeImgService,
    public fileUploadService: FileUploadService,
    public actionSheetCtrl: ActionSheetController,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer
  ) {
    super(navCtrl, file, fileTransfer, pageService);
    this.patrolReplay=this.patrolReplay?true:false;
    this.getPatroInfo();
  }

  getPatroInfo() {
    let keyID=this.navParams.data.keyID?this.navParams.data.keyID:this.navParams.data.patrolInfo.keyID;
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
    this.apiService.sendApi(new GetPatrolProcessInfoList(this.patrolInfo.patrolInfo.keyID)).subscribe(
      res => {
        if (res.success) {
          this.patrolProcess = res.data.patrolProcessInfoList;
          this.canShowLocation = false;
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
    this.getPatroInfo();

  }

  showReplayPage(){
    let keyID=this.navParams.data.keyID?this.navParams.data.keyID:this.navParams.data.patrolInfo.keyID;
    this.apiService.sendApi(new getPatrolProcessInfo(keyID,localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
      res => {
        if (res.success) {
console.log(res);
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

  selectMiniImage() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons:
        [{
          text: '拍摄',
          handler: () => {
            this.nativeImgService.getPictureByCamera().subscribe(img => {
              this.fileUploadService.upload(img).then(
                data => {
                  // this.culturalRelicPostInfo.miniImage = data;
                  // this.culturalRelicPostInfo.miniImage.category = EnumAttachmentType.不可移动文物缩略图;
                  // super.changeAttachmentFileType([this.culturalRelicPostInfo.miniImage]);
                },
                error => { this.pageService.showErrorMessage("文件上传失败！"); }
              );
            });
          }
        }, {
          text: '从相册选择',
          handler: () => {
            this.nativeImgService.getPictureByPhotoLibrary().subscribe(img => {
              this.fileUploadService.upload(img).then(
                data => {
                  // this.culturalRelicPostInfo.miniImage = data;
                  // this.culturalRelicPostInfo.miniImage.category = EnumAttachmentType.不可移动文物缩略图;
                  // super.changeAttachmentFileType([this.culturalRelicPostInfo.miniImage]);
                },
                error => { this.pageService.showErrorMessage("文件上传失败！"); });
            });
          }
        }]
    });
    actionSheet.present();
  }

  showMiniImage() {
    //super.showSlidesPage([this.culturalRelicPostInfo.miniImage], this.culturalRelicPostInfo.miniImage.fileUrl);
  }

  delMiniImage() {
    //this.pageService.showComfirmMessage("确定要删除吗？", () => { this.culturalRelicPostInfo.miniImage = null; }, () => { });
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
