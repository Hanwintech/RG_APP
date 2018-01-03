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
          this.selectDataSource = res.data;
          this.patrolInfo.patrol.patrolUserID = localStorage.getItem("userId");
          this.patrolInfo.patrol.adderID = localStorage.getItem("userId");
          this.patrolInfo.patrol.updaterID = localStorage.getItem("userId");
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

  showLocation() { }

  getCulturalRelic() {
    return new Promise((resolve, reject) => {
      let searchModal = this.modalCtrl.create('CulturalRelicSelectPage');
      searchModal.onDidDismiss(data => {
        if (data) {
          this.patrolInfo.patrol.fK_CulturalRelicID = data.upCulturalRelic.culturalRelicID;
          this.culturalRelicName = data.upCulturalRelic.culturalRelicName;
          this.culturalRelicLevelName = EnumCulturalRelicLevel[data.upCulturalRelic.culturalRelicLevel];
        }
      });
      searchModal.present();
    });
  }

  selectAttachmentList() {
    this.imagePickerService.getPictures().then(
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

  submit() {
    if (!this.patrolInfo.patrol.fK_CulturalRelicID) {
      this.pageService.showErrorMessage('请选择文物！');
      return;
    }

    if (!this.patrolInfo.patrol.patrolDescription) {
      this.pageService.showErrorMessage('请填写情况描述！');
      return;
    }

    if (this.patrolInfo.patrol.patrolState == -1) {
      this.pageService.showErrorMessage('请选择巡查状态！');
      return;
    }

    this.apiService.sendApi(new PostPatrolInfo(this.patrolInfo)).subscribe(
      res => {
        if (res.success) {
          this.pageService.showMessage("保存成功！");
          this.viewCtrl.dismiss(res.data);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
