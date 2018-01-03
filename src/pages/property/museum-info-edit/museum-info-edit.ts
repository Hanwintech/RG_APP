import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { nativeImgService } from './../../../services/nativeImg.service';
import { FileUploadService } from './../../../services/file-upload.service';
import { ImagePickerService } from './../../../services/image-picker.service';
import * as MuseumAPI from './../../../apis/property/museum.api';
import { MuseumInfo, MuseumPostInfo, MuseumInfoSearchDataSource } from './../../../models/property/museum-info.model';
import { EnumAttachmentType } from './../../../models/enum';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";
import { ValidateService } from './../../../services/validate.service';
import { SystemConst } from './../../../services/system-const.service';
import { BasePage } from "./../../../base-pages/base-page";

@IonicPage()
@Component({
  selector: 'page-museum-info-edit',
  templateUrl: 'museum-info-edit.html',
})
export class MuseumInfoEditPage extends BasePage {
  private museumInfo: MuseumInfo;
  private selectDataSource: MuseumInfoSearchDataSource;
  private districtList: IntegerKeyValue[];
  private pageTitle: string;
  private museumPostInfo: MuseumPostInfo;

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
    public validateService: ValidateService,
    public systemConst: SystemConst
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.museumPostInfo = new MuseumPostInfo();

    this.selectDataSource = this.navParams.data.selectDataSource;
    this.districtList = [];

    if (this.navParams.data.museumInfo) {
      this.museumInfo = this.navParams.data.museumInfo;
      this.pageTitle = "编辑博物馆";

      this.apiService.sendApi(new MuseumAPI.EditMuseumInfo(this.museumInfo.museumDetailInfo.id, localStorage.getItem("userId"))).subscribe(
        res => {
          if (res.success) {
            this.museumPostInfo = res.data;
            this.areaChanged();

            super.changeAttachmentFileType([this.museumPostInfo.miniImage]);
            super.changeAttachmentFileType(this.museumPostInfo.attachmentList);
          } else {
            this.pageService.showErrorMessage("获取数据失败！");
          }
        },
        error => {
          this.pageService.showErrorMessage(error);
        });
    } else {
      this.pageTitle = "新增博物馆";
      this.museumPostInfo.userId = localStorage.getItem("userId");
    }
  }

  areaChanged() {
    this.districtList = [];
    let temp: IntegerKeyValue[] = [];
    for (let d of this.selectDataSource.districtList) {
      if (this.museumPostInfo.museumInfo.enumArea && d.parentId == this.museumPostInfo.museumInfo.enumArea.toString()) {
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

  getCoordinate() { }

  selectMiniImage() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons:
        [{
          text: '拍摄',
          handler: () => {
            this.nativeImgService.getPictureByCamera().subscribe(img => {
              this.fileUploadService.upload(img).then(
                data => {
                  this.museumPostInfo.miniImage = data;
                  this.museumPostInfo.miniImage.category = EnumAttachmentType.不可移动文物缩略图;
                  super.changeAttachmentFileType([this.museumPostInfo.miniImage]);
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
                  this.museumPostInfo.miniImage = data;
                  this.museumPostInfo.miniImage.category = EnumAttachmentType.不可移动文物缩略图;
                  super.changeAttachmentFileType([this.museumPostInfo.miniImage]);
                },
                error => { this.pageService.showErrorMessage("文件上传失败！"); });
            });
          }
        }]
    });
    actionSheet.present();
  }

  showMiniImage() {
    super.showSlidesPage([this.museumPostInfo.miniImage], this.museumPostInfo.miniImage.fileUrl);
  }

  delMiniImage() {
    this.pageService.showComfirmMessage("确定要删除吗？", () => { this.museumPostInfo.miniImage = null; }, () => { });
  }

  selectAttachmentList() {
    this.imagePickerService.getPictures().then(
      attachments => {
        if (attachments) {
          super.changeAttachmentFileType(attachments);
          for (let att of attachments) {
            att.category = EnumAttachmentType.不可移动文物附件;
          }
          if (!this.museumPostInfo.attachmentList) {
            this.museumPostInfo.attachmentList = [];
          }
          this.museumPostInfo.attachmentList = this.museumPostInfo.attachmentList.concat(attachments);
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
    super.showSlidesPage(this.museumPostInfo.attachmentList, attachment.fileUrl);
  }

  delAttachmentList(attachment) {
    this.pageService.showComfirmMessage("确定要删除吗？",
      () => {
        let tempArray = [];
        for (let atta of this.museumPostInfo.attachmentList) {
          if (attachment.attachmentId != atta.attachmentId) {
            tempArray.push(atta);
          }
        }
        this.museumPostInfo.attachmentList = tempArray;
      },
      () => { });
  }

  submit() {
    if (!this.museumPostInfo.museumInfo.museumName) {
      this.pageService.showErrorMessage('请填写博物馆名称！');
      return;
    }

    if (this.museumPostInfo.museumInfo.enumArea == -1) {
      this.pageService.showErrorMessage('请选择地区！');
      return;
    }

    if (!this.museumPostInfo.museumInfo.location) {
      this.pageService.showErrorMessage('请填写地址！');
      return;
    }

    if (this.museumPostInfo.museumInfo.qualityGrade == -1) {
      this.pageService.showErrorMessage('请选择质量等级！');
      return;
    }

    if (this.museumPostInfo.museumInfo.coordinateAccurate == -1) {
      this.pageService.showErrorMessage('请选择标注精确度！');
      return;
    }

    if (this.museumPostInfo.museumInfo.telephone
      && !this.validateService.isMobilePhoneNumber(this.museumPostInfo.museumInfo.telephone)
      && !this.validateService.isTelephoneNumber(this.museumPostInfo.museumInfo.telephone)
    ) {
      this.pageService.showErrorMessage('请正确填写电话！');
      return;
    }

    if (this.museumPostInfo.museumInfo.fax && !this.validateService.isTelephoneNumber(this.museumPostInfo.museumInfo.fax)) {
      this.pageService.showErrorMessage('请正确填写传真！格式：(区号)-(座机号)');
      return;
    }

    this.apiService.sendApi(new MuseumAPI.PostMuseumInfo(this.museumPostInfo)).subscribe(
      res => {
        if (res.success) {
          this.pageService.showMessage("保存成功！");
          console.log(res.data)
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
