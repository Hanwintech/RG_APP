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
  selector: 'page-construction-site-info-edit',
  templateUrl: 'construction-site-info-edit.html',
})
export class ConstructionSiteInfoEditPage extends BasePage {
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
    this.districtList = [];

    if (this.navParams.data.culturalRelicInfo) {
      this.culturalRelicInfo = this.navParams.data.culturalRelicInfo;
      this.pageTitle = "编辑工地";

      this.apiService.sendApi(new EditCulturalRelicInfo(this.culturalRelicInfo.upCulturalRelic.culturalRelicID, localStorage.getItem("userId"))).subscribe(
        res => {
          if (res.success) {
            this.culturalRelicPostInfo = res.data;
            this.areaChanged();

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
    }
  }

  areaChanged() {
    this.districtList = [];
    let temp: IntegerKeyValue[] = [];
    for (let d of this.selectDataSource.districtList) {
      if (this.culturalRelicPostInfo.culturalRelic.enumArea && d.parentId == this.culturalRelicPostInfo.culturalRelic.enumArea.toString()) {
        let kvp: IntegerKeyValue = new IntegerKeyValue();
        kvp.key = d.value;
        kvp.value = d.text;
        temp.push(kvp)
      }
    }
    if (temp.length != 0) {
      let kvp: IntegerKeyValue = new IntegerKeyValue();
      kvp.key = -1;
      kvp.value = "请选择";
      this.districtList.push(kvp)
      for (let kv of temp) {
        this.districtList.push(kv)
      }
    }
  }

  getCoordinate() {
    let locate = this.modalCtrl.create("MapLocatePage",{"coordinate": this.culturalRelicPostInfo.culturalRelic,"culturalLevel":this.culturalRelicInfo.upCulturalRelic.culturalRelicLevel});
    locate.onDidDismiss(data => {
      this.culturalRelicPostInfo.culturalRelic.coordinateX=data.culturalRelicX;
      this.culturalRelicPostInfo.culturalRelic.coordinateY=data.culturalRelicY;
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
    this.imagePickerService.getPictures().then(
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

  submit() {
    if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicName) {
      this.pageService.showErrorMessage('请填写工地名称！');
      return;
    }

    if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicCode) {
      this.pageService.showErrorMessage('请填写工地编码！');
      return;
    }

    if (this.culturalRelicPostInfo.culturalRelic.enumArea == -1) {
      this.pageService.showErrorMessage('请选择地区！');
      return;
    }

    if (!this.culturalRelicPostInfo.culturalRelic.location) {
      this.pageService.showErrorMessage('请填写地址！');
      return;
    }

    if (this.culturalRelicPostInfo.culturalRelic.coordinateAccurate == -1) {
      this.pageService.showErrorMessage('请选择标注精确度！');
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
