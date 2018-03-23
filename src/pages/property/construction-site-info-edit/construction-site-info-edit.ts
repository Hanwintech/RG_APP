import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { nativeImgService } from './../../../services/nativeImg.service';
import { FileUploadService } from './../../../services/file-upload.service';
import { ImagePickerService } from './../../../services/image-picker.service';
import { EditCulturalRelicInfo, PostCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo, CulturalRelicPostInfo, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { EnumAttachmentType, EnumCulturalRelicLevel } from './../../../models/enum';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";
import { SystemConst } from './../../../services/system-const.service';
import { EnumAppRole } from "./../../../models/enum";

import { BasePage } from "./../../../base-pages/base-page";

@IonicPage()
@Component({
  selector: 'page-construction-site-info-edit',
  templateUrl: 'construction-site-info-edit.html',
})
export class ConstructionSiteInfoEditPage extends BasePage {
  private culturalRelicInfo: CulturalRelicInfo;
  private selectDataSource: CulturalRelicInfoSearchDataSource;
  private districtList: IntegerKeyValue[];
  private pageTitle: string;
  private culturalRelicPostInfo: CulturalRelicPostInfo;
  private canShowLocation: boolean;
  private culturalRelicInfoEdit;

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
    public systemConst: SystemConst
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.culturalRelicPostInfo = new CulturalRelicPostInfo();

    this.selectDataSource = this.navParams.data.selectDataSource;
    this.districtList = this.systemConst.EMPTY_SELECT_LIST;
    this.canShowLocation = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.Volunteer);

    if (this.navParams.data.culturalRelicInfo) {
      this.culturalRelicInfo = this.navParams.data.culturalRelicInfo;
      this.pageTitle = "编辑工地";

      this.apiService.sendApi(new EditCulturalRelicInfo(this.culturalRelicInfo.upCulturalRelic.culturalRelicID, localStorage.getItem("userId"))).subscribe(
        res => {
          if (res.success) {
            this.culturalRelicPostInfo = res.data;
            this.culturalRelicInfoEdit=res.data;
            this.areaChanged(this.culturalRelicPostInfo.culturalRelic.district);

            super.changeAttachmentFileType([this.culturalRelicPostInfo.miniImage]);
            super.changeAttachmentFileType(this.culturalRelicPostInfo.attachmentList);
          } else {
            this.pageService.showErrorMessage("获取数据失败！");
          }
        },
        error => {
          this.pageService.showErrorMessage(error);
        });
    } else {
      this.pageTitle = "新增工地";
      this.culturalRelicPostInfo.userId = localStorage.getItem("userId");
      this.culturalRelicPostInfo.culturalRelic.culturalRelicLevel = EnumCulturalRelicLevel.工地;
      this.canShowLocation=false;
    }
  }

  areaChanged(district) {
    this.districtList = this.systemConst.EMPTY_SELECT_LIST;
    this.culturalRelicPostInfo.culturalRelic.district = district ? district : this.systemConst.EMPTY_INTEGER;
    for (let d of this.selectDataSource.districtList) {
      if (this.culturalRelicPostInfo.culturalRelic.enumArea && d.parentId == this.culturalRelicPostInfo.culturalRelic.enumArea.toString()) {
        let kvp: IntegerKeyValue = new IntegerKeyValue();
        kvp.key = d.value;
        kvp.value = d.text;
        this.districtList.push(kvp)
      }
    }
  }

  getCoordinate() {
    let culturalLevel = this.culturalRelicInfo ? this.culturalRelicInfo.upCulturalRelic.culturalRelicLevel : EnumCulturalRelicLevel["工地"];
    let locate = this.modalCtrl.create("MapLocatePage", { "coordinate": this.culturalRelicPostInfo.culturalRelic, "culturalLevel": culturalLevel });
    locate.onDidDismiss(data => {
      if (data && data.culturalRelicX.toString() != "{}") {
        this.culturalRelicPostInfo.culturalRelic.coordinateX = data.culturalRelicX;
        this.culturalRelicPostInfo.culturalRelic.coordinateY = data.culturalRelicY;
      }
    });
    locate.present();
  }

  showLocation() {
    let culturalRelicMapInfo = new CulturalRelicInfo();
    culturalRelicMapInfo.culturalRelic = this.culturalRelicInfoEdit.culturalRelic;
    culturalRelicMapInfo.twoLineInfoList = this.culturalRelicInfoEdit.twoLineInfoList;
    culturalRelicMapInfo.id=this.culturalRelicInfoEdit.culturalRelic.id;
    culturalRelicMapInfo.culturalRelic.patrolCount=this.culturalRelicInfoEdit.patrolCount;
    let locate = this.modalCtrl.create("MapCulturalRelicLocatePage", { "culturalRelicMapInfo": culturalRelicMapInfo, "coordinateAccurateList": this.culturalRelicInfoEdit.coordinateAccurateList });
    locate.onDidDismiss(data => {
      if (data) {
        this.culturalRelicPostInfo.culturalRelic.coordinateX = data.culturalRelicX;
        this.culturalRelicPostInfo.culturalRelic.coordinateY = data.culturalRelicY;
        this.culturalRelicPostInfo.culturalRelic.coordinateAccurate = data.coordinateAccurate;
      }
    });
    locate.present();
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
                  this.culturalRelicPostInfo.miniImage = data;
                  this.culturalRelicPostInfo.miniImage.category = EnumAttachmentType.不可移动文物缩略图;
                  this.culturalRelicPostInfo.miniImage.fileShowName="不可移动文物缩略图.jpg";
                  super.changeAttachmentFileType([this.culturalRelicPostInfo.miniImage]);
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
                  this.culturalRelicPostInfo.miniImage = data;
                  this.culturalRelicPostInfo.miniImage.category = EnumAttachmentType.不可移动文物缩略图;
                  this.culturalRelicPostInfo.miniImage.fileShowName="不可移动文物缩略图.jpg";
                  super.changeAttachmentFileType([this.culturalRelicPostInfo.miniImage]);
                },
                error => { this.pageService.showErrorMessage("文件上传失败！"); });
            });
          }
        }]
    });
    actionSheet.present();
  }

  showMiniImage() {
    super.showSlidesPage([this.culturalRelicPostInfo.miniImage], this.culturalRelicPostInfo.miniImage.fileUrl);
  }

  delMiniImage() {
    this.pageService.showComfirmMessage("确定要删除吗？", () => { this.culturalRelicPostInfo.miniImage = null; }, () => { });
  }

  selectAttachmentList() {
    this.imagePickerService.getPictures(null).then(
      attachments => {
        if (attachments) {
          super.changeAttachmentFileType(attachments);
          for (let att of attachments) {
            att.category = EnumAttachmentType.不可移动文物附件;
            att.fileShowName="不可移动文物附件.jpg";
          }
          if (!this.culturalRelicPostInfo.attachmentList) {
            this.culturalRelicPostInfo.attachmentList = [];
          }
          this.culturalRelicPostInfo.attachmentList = this.culturalRelicPostInfo.attachmentList.concat(attachments);
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
    super.showSlidesPage(this.culturalRelicPostInfo.attachmentList, attachment.fileUrl);
  }

  delAttachmentList(attachment) {
    this.pageService.showComfirmMessage("确定要删除吗？",
      () => {
        let tempArray = [];
        for (let atta of this.culturalRelicPostInfo.attachmentList) {
          if (attachment.attachmentId != atta.attachmentId) {
            tempArray.push(atta);
          }
        }
        this.culturalRelicPostInfo.attachmentList = tempArray;
      },
      () => { });
  }

  submit() {
    let valiMessage = "";

    if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicName) {
      valiMessage += '、工地名称';
    }

    if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicCode) {
      valiMessage += '、工地编码';
    }

    if (this.culturalRelicPostInfo.culturalRelic.enumArea == -1) {
      valiMessage += '、地区';
    }

    if (!this.culturalRelicPostInfo.culturalRelic.location) {
      valiMessage += '、地址';
    }

    if (this.culturalRelicPostInfo.culturalRelic.coordinateAccurate == -1) {
      valiMessage += '、标注精确度';
    }

    if (valiMessage) {
      this.pageService.showErrorMessage("请填写以下内容：" + valiMessage.substring(1) + "！");
      return;
    }
    this.pageService.showLoading("数据提交中...");
    this.apiService.sendApi(new PostCulturalRelicInfo(this.culturalRelicPostInfo)).subscribe(
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
