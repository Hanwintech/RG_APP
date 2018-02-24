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
import { BasePage } from "./../../../base-pages/base-page";

@IonicPage()
@Component({
  selector: 'page-cultural-relic-info-edit',
  templateUrl: 'cultural-relic-info-edit.html',
})
export class CulturalRelicInfoEditPage extends BasePage {
  private culturalRelicInfo: CulturalRelicInfo;
  private selectDataSource: CulturalRelicInfoSearchDataSource;
  private districtList: IntegerKeyValue[];
  private twoStageTypeList: IntegerKeyValue[];
  private pageTitle: string;
  private culturalRelicPostInfo: CulturalRelicPostInfo;

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
    this.twoStageTypeList = this.systemConst.EMPTY_SELECT_LIST;

    if (this.navParams.data.culturalRelicInfo) {
      this.culturalRelicInfo = this.navParams.data.culturalRelicInfo;
      this.pageTitle = "编辑文物";

      this.apiService.sendApi(new EditCulturalRelicInfo(this.culturalRelicInfo.upCulturalRelic.culturalRelicID, localStorage.getItem("userId"))).subscribe(
        res => {
          if (res.success) {
            this.culturalRelicPostInfo = res.data;
            this.areaChanged(this.culturalRelicPostInfo.culturalRelic.district);
            this.typeChanged(this.culturalRelicPostInfo.culturalRelic.culturalRelicTwoStageType);

            super.changeAttachmentFileType([this.culturalRelicPostInfo.miniImage]);
            super.changeAttachmentFileType(this.culturalRelicPostInfo.attachmentList);
            super.changeAttachmentFileType(this.culturalRelicPostInfo.twoLimitAttachmentList);
          } else {
            this.pageService.showErrorMessage("获取数据失败！");
          }
        },
        error => {
          this.pageService.showErrorMessage(error);
        });
    } else {
      this.pageTitle = "新增文物";
      this.culturalRelicPostInfo.userId = localStorage.getItem("userId");
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

  typeChanged(twoStageType) {
    this.twoStageTypeList = this.systemConst.EMPTY_SELECT_LIST;
    this.culturalRelicPostInfo.culturalRelic.culturalRelicTwoStageType = twoStageType ? twoStageType : this.systemConst.EMPTY_INTEGER;
    for (let d of this.selectDataSource.culturalRelicTwoStageTypeList) {
      if (this.culturalRelicPostInfo.culturalRelic.culturalRelicType && d.parentId == this.culturalRelicPostInfo.culturalRelic.culturalRelicType.toString()) {
        let kvp: IntegerKeyValue = new IntegerKeyValue();
        kvp.key = d.value;
        kvp.value = d.text;
        this.twoStageTypeList.push(kvp)
      }
    }
  }

  getCoordinate() {
    let culturalLevel = this.culturalRelicInfo ? this.culturalRelicInfo.upCulturalRelic.culturalRelicLevel : EnumCulturalRelicLevel["其他不可移动文物"];
    let locate = this.modalCtrl.create("MapLocatePage", { "coordinate": this.culturalRelicPostInfo.culturalRelic, "culturalLevel": culturalLevel });
    locate.onDidDismiss(data => {
      if (data && data.culturalRelicX.toString() != "{}") {
        this.culturalRelicPostInfo.culturalRelic.coordinateX = data.culturalRelicX;
        this.culturalRelicPostInfo.culturalRelic.coordinateY = data.culturalRelicY;
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

  selectTwoLimitAttachmentList() {
    this.imagePickerService.getPictures(null).then(
      attachments => {
        if (attachments) {
          super.changeAttachmentFileType(attachments);
          for (let att of attachments) {
            att.category = EnumAttachmentType.不可移动文物两线附件;
          }
          if (!this.culturalRelicPostInfo.twoLimitAttachmentList) {
            this.culturalRelicPostInfo.twoLimitAttachmentList = [];
          }
          this.culturalRelicPostInfo.twoLimitAttachmentList = this.culturalRelicPostInfo.twoLimitAttachmentList.concat(attachments);
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

  showTwoLimitAttachmentList(attachment) {
    super.showSlidesPage(this.culturalRelicPostInfo.twoLimitAttachmentList, attachment.fileUrl);
  }

  delTwoLimitAttachmentList(attachment) {
    this.pageService.showComfirmMessage("确定要删除吗？",
      () => {
        let tempArray = [];
        for (let atta of this.culturalRelicPostInfo.twoLimitAttachmentList) {
          if (attachment.attachmentId != atta.attachmentId) {
            tempArray.push(atta);
          }
        }
        this.culturalRelicPostInfo.twoLimitAttachmentList = tempArray;
      },
      () => { });
  }

  submit() {
    let valiMessage = "";

    if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicName) {
      valiMessage += '、文物名称';
    }

    if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicCode) {
      valiMessage += '、文物编码';
    }

    if (this.culturalRelicPostInfo.culturalRelic.enumArea == -1) {
      valiMessage += '、地区';
    }

    if (this.culturalRelicPostInfo.culturalRelic.culturalRelicLevel == -1) {
      valiMessage += '、类别';
    }

    if (!this.culturalRelicPostInfo.culturalRelic.location) {
      valiMessage += '、地址';
    }

    if (this.culturalRelicPostInfo.culturalRelic.coordinateAccurate == -1) {
      valiMessage += '、标注精确度';
    }

    if (this.culturalRelicPostInfo.culturalRelic.culturalRelicType == -1) {
      valiMessage += '、类型';
    }

    if (this.culturalRelicPostInfo.culturalRelic.culturalRelicTwoStageType == -1) {
      valiMessage += '、二级分类';
    }

    if (valiMessage) {
      this.pageService.showErrorMessage("请填写以下内容：" + valiMessage.substring(1) + "！");
      return;
    }

    this.apiService.sendApi(new PostCulturalRelicInfo(this.culturalRelicPostInfo)).subscribe(
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
