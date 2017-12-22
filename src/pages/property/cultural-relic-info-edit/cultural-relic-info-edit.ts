import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { nativeImgService } from './../../../services/nativeImg.service';
import { FileUploadService } from './../../../services/file-upload.service';
import { ImagePickerService } from './../../../services/image-picker.service';
import { EditCulturalRelicInfo, PostCulturalRelicInfo } from './../../../apis/property/edit-cultural-relic-info.api';
import { CulturalRelicInfo, CulturalRelicPostInfo, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";
import { EnumCulturalRelicLevel, EnumSearchType, EnumCulturalRelicSearchType } from './../../../models/enum';
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

  //巡查图片缩略图
  private fileObjList;
  private fileObjBigList;
  //处理图片缩略图
  private fileObjHandleList;
  private fileObjBigHandleList;

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
    this.twoStageTypeList = [];

    if (this.navParams.data.culturalRelicInfo) {
      this.culturalRelicInfo = this.navParams.data.culturalRelicInfo;
      this.pageTitle = "编辑文物";

      this.apiService.sendApi(new EditCulturalRelicInfo(this.culturalRelicInfo.upCulturalRelic.culturalRelicID, localStorage.getItem("userId"))).subscribe(
        res => {
          console.log(res.data);
          this.culturalRelicPostInfo = res.data;
          this.areaChanged();
          this.typeChanged();

          super.changeAttachmentFileType([this.culturalRelicPostInfo.miniImage]);
          super.changeAttachmentFileType(this.culturalRelicPostInfo.attachmentList);
          super.changeAttachmentFileType(this.culturalRelicPostInfo.twoLimitImageList);
        },
        error => {
          this.pageService.showErrorMessage(error);
        });
    } else {
      this.pageTitle = "新增文物";
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

  typeChanged() {
    this.twoStageTypeList = [];
    let temp: IntegerKeyValue[] = [];
    for (let d of this.selectDataSource.culturalRelicTwoStageTypeList) {
      if (this.culturalRelicPostInfo.culturalRelic.culturalRelicType && d.parentId == this.culturalRelicPostInfo.culturalRelic.culturalRelicType.toString()) {
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
      this.twoStageTypeList.push(kvp)
      for (let kv of temp) {
        this.twoStageTypeList.push(kv)
      }
    }
  }

  getCoordinate() {
    //   let modal = this.modalCtrl.create('CulturalRelicInfoEditPage', { "X": this.culturalRelicPostInfo.culturalRelic.coordinateX, "Y": this.culturalRelicPostInfo.culturalRelic.coordinateY });
    //   modal.onDidDismiss(data => {
    //     console.log(data);
    //   });
    //   modal.present();
  }

  selectMiniImage() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons:
        [{
          text: '拍摄',
          handler: () => {
            this.nativeImgService.getPictureByCamera().subscribe(img => {
              this.fileUploadService.upload(img).then(
                data => { this.culturalRelicPostInfo.miniImage = data; },
                error => { this.pageService.showErrorMessage("文件上传失败！"); }
              );
            });
          }
        }, {
          text: '从相册选择',
          handler: () => {
            this.nativeImgService.getPictureByPhotoLibrary().subscribe(img => {
              this.fileUploadService.upload(img).then(
                data => { this.culturalRelicPostInfo.miniImage = data; },
                error => { this.pageService.showErrorMessage("文件上传失败！"); });
            });
          }
        }]
    });
    actionSheet.present();
  }

  selectAttachmentList() {
    this.imagePickerService.getPictures().then((attachments) => {
      for (var i = 0; i < attachments.length; i++) {
          console.log('Image URI: ' + attachments[i]);
      }
    },
     (err) => { });
  }

  submit() {
    this.viewCtrl.dismiss({ "needSearch": true });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
