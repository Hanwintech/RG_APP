import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { nativeImgService } from './../../../services/nativeImg.service';
import { FileUploadService } from './../../../services/file-upload.service';
import { ImagePickerService } from './../../../services/image-picker.service';
import { GetPatrolEditDataSource } from './../../../apis/patrol/patrol-info.api';
import { PatrolInfo, PatrolEditDataSource } from './../../../models/patrol/patrol-info.model';
import { EnumAttachmentType } from './../../../models/enum';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";
import { SystemConst } from './../../../services/system-const.service';

import { BasePage } from "./../../../base-pages/base-page";

@IonicPage()
@Component({
  selector: 'page-patrol-info-edit',
  templateUrl: 'patrol-info-edit.html',
})
export class PatrolInfoEditPage extends BasePage {
  private culturalRelicID: string;
  private culturalRelicName: string;
  private culturalRelicLevelName: string;
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
    public systemConst: SystemConst
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.patrolInfo = new PatrolInfo();

    this.apiService.sendApi(new GetPatrolEditDataSource(localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
      res => {
        if (res.success) {
          console.log(res);
          this.selectDataSource = res.data;
        } else {
          this.pageService.showErrorMessage("获取数据失败！");
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showLocation() { }

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
    // if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicName) {
    //   this.pageService.showErrorMessage('请填写文物名称！');
    //   return;
    // }

    // if (!this.culturalRelicPostInfo.culturalRelic.culturalRelicCode) {
    //   this.pageService.showErrorMessage('请填写文物编码！');
    //   return;
    // }

    // if (this.culturalRelicPostInfo.culturalRelic.enumArea == -1) {
    //   this.pageService.showErrorMessage('请选择地区！');
    //   return;
    // }

    // if (this.culturalRelicPostInfo.culturalRelic.culturalRelicLevel == -1) {
    //   this.pageService.showErrorMessage('请选择类别！');
    //   return;
    // }

    // if (!this.culturalRelicPostInfo.culturalRelic.location) {
    //   this.pageService.showErrorMessage('请填写地址！');
    //   return;
    // }

    // if (this.culturalRelicPostInfo.culturalRelic.coordinateAccurate == -1) {
    //   this.pageService.showErrorMessage('请选择标注精确度！');
    //   return;
    // }

    // if (this.culturalRelicPostInfo.culturalRelic.culturalRelicType == -1) {
    //   this.pageService.showErrorMessage('请选择类型！');
    //   return;
    // }

    // if (this.culturalRelicPostInfo.culturalRelic.culturalRelicTwoStageType == -1) {
    //   this.pageService.showErrorMessage('请选择二级分类！');
    //   return;
    // }

    // this.apiService.sendApi(new PostCulturalRelicInfo(this.culturalRelicPostInfo)).subscribe(
    //   res => {
    //     if (res.success) {
    //       this.pageService.showMessage("保存成功！");
    //       this.viewCtrl.dismiss(res.data);
    //     } else {
    //       this.pageService.showErrorMessage(res.reason);
    //     }
    //   },
    //   error => {
    //     this.pageService.showErrorMessage(error);
    //   });
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
