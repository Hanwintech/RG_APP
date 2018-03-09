import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { nativeImgService } from './../../../services/nativeImg.service';
import { FileUploadService } from './../../../services/file-upload.service';
import { ImagePickerService } from './../../../services/image-picker.service';
import { GetPatrolEditDataSource, PostPatrolInfo } from './../../../apis/patrol/patrol-info.api';
import { PatrolInfo, PatrolEditDataSource } from './../../../models/patrol/patrol-info.model';
import { EnumAttachmentType, EnumCulturalRelicLevel, EnumAreaCode } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';
import { DateTime } from './../../../pipes/datetime.pipe';
import { BasePage } from "./../../../base-pages/base-page";

declare var BMap;

@IonicPage()
@Component({
  selector: 'page-patrol-info-edit',
  templateUrl: 'patrol-info-edit.html',
})
export class PatrolInfoEditPage extends BasePage {
  private culturalRelicName: string;
  private culturalRelicLevelName: string;
  private patroller: string;
  private areaName: string;
  private patrolInfo: PatrolInfo;
  private selectDataSource: PatrolEditDataSource;
  private pointA;

  private dealPersonNames;
  private caseProblemNames;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    public file: File,
    public fileTransfer: FileTransfer,
    public imagePickerService: ImagePickerService,
    public apiService: ApiService,
    public pageService: PageService,
    public nativeImgService: nativeImgService,
    public fileUploadService: FileUploadService,
    public systemConst: SystemConst,
    public dateTimePipe: DateTime
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.patrolInfo = new PatrolInfo();
    this.selectDataSource = new PatrolEditDataSource();

    this.apiService.sendApi(new GetPatrolEditDataSource(localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
      res => {
        if (res.success) {
          console.log(res.data);
          this.selectDataSource = res.data;
          this.patrolInfo.patrol.patrolUserID = localStorage.getItem("userId");
          this.patrolInfo.patrol.adderID = localStorage.getItem("userId");
          this.patrolInfo.patrol.updaterID = localStorage.getItem("userId");
          this.patrolInfo.patrol.fK_ManageUnitID = localStorage.getItem("manageUnitId");
          this.patroller = localStorage.getItem("name");
          this.areaName = EnumAreaCode[this.apiService.areaCode];
          this.patrolInfo.patrol.patroDate = dateTimePipe.transform(new Date(), "yyyy-MM-dd");
        } else {
          this.pageService.showErrorMessage("获取数据失败！");
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showLocation() {
    this.navCtrl.push("TwoLinePage", { "title": "文物地图" });
  }

  getCulturalRelic() {
    return new Promise((resolve, reject) => {
      let searchModal = this.modalCtrl.create('CulturalRelicSelectPage');
      searchModal.onDidDismiss(data => {
        if (data) {
          this.pointA = new BMap.Point(data.upCulturalRelic.coordinateX, data.upCulturalRelic.coordinateY);
          this.patrolInfo.patrol.fK_CulturalRelicID = data.upCulturalRelic.culturalRelicID;
          this.culturalRelicName = data.upCulturalRelic.culturalRelicName;
          this.culturalRelicLevelName = EnumCulturalRelicLevel[data.upCulturalRelic.culturalRelicLevel];
        }
      });
      searchModal.present();
    });
  }

  selectAttachmentList() {
    this.imagePickerService.getPictures(this.patrolInfo.attachmentList.length).then(
      attachments => {
        if (attachments) {
          super.changeAttachmentFileType(attachments);
          for (let att of attachments) {
            att.category = EnumAttachmentType.不可移动文物附件;
          }
          if (!this.patrolInfo.attachmentList) {
            this.patrolInfo.attachmentList = [];
          }
          this.patrolInfo.attachmentList = this.patrolInfo.attachmentList.concat(attachments);
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
    super.showSlidesPage(this.patrolInfo.attachmentList, attachment.fileUrl);
  }

  delAttachmentList(event, attachment) {
    event.stopPropagation();//阻止冒泡 
    this.pageService.showComfirmMessage("确定要删除吗？",
      () => {
        let tempArray = [];
        for (let atta of this.patrolInfo.attachmentList) {
          if (attachment.attachmentId != atta.attachmentId) {
            tempArray.push(atta);
          }
        }
        this.patrolInfo.attachmentList = tempArray;
      },
      () => { });
  }

  getDealPerson() {
    return new Promise((resolve, reject) => {
      let searchModal = this.modalCtrl.create('PatrolInfoEditDealPersonPage', {
        "canSelectUserInfoList": this.selectDataSource.canSelectUserInfoList,
        "selectedUserInfoList": this.patrolInfo.selectedUserInfoList
      });
      searchModal.onDidDismiss(data => {
        if (data) {
          this.dealPersonNames = "";
          this.patrolInfo.selectedUserInfoList = [];
          for (let person of data) {
            this.dealPersonNames += "，" + person.userName;
            this.patrolInfo.selectedUserInfoList.push(person);
          }
          this.dealPersonNames = this.dealPersonNames.substr(1);
        }
      });
      searchModal.present();
    });
  }

  getCaseProblem() {
    return new Promise((resolve, reject) => {
      let searchModal = this.modalCtrl.create('PatrolInfoEditCaseProblemPage', {
        "patrolCaseProblemList": this.selectDataSource.patrolCaseProblemList,
        "selectedCaseProblemList":this.patrolInfo.selectedCaseProblemList
       });
      searchModal.onDidDismiss(data => {
        if (data) {
          console.log(data);
          this.caseProblemNames = [];
          this.patrolInfo.selectedCaseProblemList = [];
          for (let i = 0; i < data.length; i++) {
            this.caseProblemNames.push((i + 1).toString() + "." + data[i].caseProblem);
            this.patrolInfo.selectedCaseProblemList.push(data[i].caseValue);
          }
        }
      });
      searchModal.present();
    });
  }

  submit() {
    let valiMessage = "";

    if (!this.patrolInfo.patrol.fK_CulturalRelicID) {
      valiMessage += '请选择文物！';
    }

    if (!this.patrolInfo.patrol.patrolDescription) {
      valiMessage += '请填写情况描述！';
    }

    if (this.patrolInfo.patrol.patrolState == -1) {
      valiMessage += '请选择巡查状态！';
    } else if (this.patrolInfo.patrol.patrolState == 2) {
      if(this.patrolInfo.selectedUserInfoList.length == 0){  
        valiMessage += '请选择处理人员！';
      }
      if(this.patrolInfo.selectedCaseProblemList.length == 0){  
        valiMessage += '请选择问题情况！';
      }
      if(!this.patrolInfo.patrol.problemDescription){  
        valiMessage += '请输入问题描述！';
      }
      if(this.patrolInfo.patrol.permission == -1){  
        valiMessage += '请选择是否经过许可！';
      }
      if(this.patrolInfo.attachmentList.length == 0){  
        valiMessage += '请上传巡查照片！';
      }
    } else if(this.patrolInfo.patrol.patrolState == 3){
      if(this.patrolInfo.selectedCaseProblemList.length == 0){  
        valiMessage += '请选择问题情况！';
      }
      if(!this.patrolInfo.patrol.problemDescription){  
        valiMessage += '请输入问题描述！';
      }
      if(this.patrolInfo.patrol.permission == -1){  
        valiMessage += '请选择是否经过许可！';
      }
      if(this.patrolInfo.patrol.isImmediately == -1){  
        valiMessage += '请选择是否当场处理！';
      }
      if(this.patrolInfo.attachmentList.length == 0){  
        valiMessage += '请上传巡查照片！';
      }
    }

    if (valiMessage) {
      this.pageService.showErrorMessage(valiMessage);
      return;
    }

    let longitude = localStorage.getItem('longitude');
    if (longitude) {
      this.patrolInfo.patrol.coordinateX = Number(longitude);
    }
    let latitude = localStorage.getItem('latitude');
    if (latitude) {
      this.patrolInfo.patrol.coordinateY = Number(latitude);
    }
    let map = new BMap.Map();
    let personPoint = new BMap.Point(longitude, latitude);
    this.patrolInfo.personPointDistance = map.getDistance(this.pointA, personPoint).toFixed(0);
    this.pageService.showLoading("数据提交中...");
    this.apiService.sendApi(new PostPatrolInfo(this.patrolInfo)).subscribe(
      res => {
        this.pageService.dismissLoading();
        if (res.success) {
          this.pageService.showMessage("保存成功！");
          this.viewCtrl.dismiss(res.data);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.dismissLoading();
        this.pageService.showErrorMessage(error);
      });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
