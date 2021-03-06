import { Component } from '@angular/core';
import { Console } from '@angular/core/src/console';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { NetworkInformationService } from './../../../services/network-information.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';
import { EnumAppRole } from "./../../../models/enum";
import { Attachment } from "./../../../models/attachment.model";
import { CordovaFunctionOverride } from '@ionic-native/core';

@IonicPage()
@Component({
  selector: 'page-cultural-relic-info-detail',
  templateUrl: 'cultural-relic-info-detail.html',
})
export class CulturalRelicInfoDetailPage extends DetailPage {
  private canShowLocation: boolean;
  private culturalRelicInfo: CulturalRelicInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer,
    public fileOpener: FileOpener,
    public networkInfoService: NetworkInformationService
  ) {
    super(navCtrl, file, fileTransfer, pageService, modalCtrl);

    this.canShowLocation = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.Volunteer);
    this.culturalRelicInfo = new CulturalRelicInfo();

    let culturalRelicID = this.navParams.data

    this.apiService.sendApi(new GetCulturalRelicInfo(culturalRelicID)).subscribe(
      res => {
        if (res.success) {
          console.log(res);
          this.culturalRelicInfo = res.data;
          super.changeAttachmentFileType(this.culturalRelicInfo.attachmentList)
          super.changeAttachmentFileType(this.culturalRelicInfo.twoLimitImageList)
          super.changeAttachmentFileType(this.culturalRelicInfo.twoLimitAttachmentList)
          super.changeAttachmentFileType(this.culturalRelicInfo.buryAreaAttachmentList)
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showPicture(fileUrl: string, attachmentList: Attachment[]) {
    super.showSlidesPage(attachmentList, fileUrl);
  }

  download(attachment: Attachment) {
    attachment.startDowload = true;
    this.downloadAttachment(this.networkInfoService, attachment);
  }

  open(file: Attachment) {
    super.openFile(this.fileOpener, file);
  }

  showAttachmentList(fileUrl: string) {
    this.showPicture(fileUrl, this.culturalRelicInfo.attachmentList)
  }

  showTwoLimitImageList(att) {
    let tempPic = [];
    tempPic.push(att.replace("/CompressionFile/", "/OriginalFile/"));
    this.modalCtrl.create("ShowPicturePage", { "picUrls": tempPic, "currentIndex": 0 }).present();
  }

  showRelativeTwoLimitImageList() {
    if (!this.culturalRelicInfo.twoLimitImageList || this.culturalRelicInfo.twoLimitImageList.length == 0) {
      this.pageService.showMessage("暂无相关图片");
    }
    else {
      let picUrls: string[] = [];
      for (let i = 0; i < this.culturalRelicInfo.twoLimitImageList.length; i++) {
        if (this.culturalRelicInfo.twoLimitImageList[i].fileType == "img") {
          let origionFile = this.culturalRelicInfo.twoLimitImageList[i].fileUrl.replace("/CompressionFile/", "/OriginalFile/");
          picUrls.push(origionFile);
        }
      }
      this.modalCtrl.create("ShowPicturePage", { "picUrls": picUrls, "currentIndex": 0 }).present();
    }
  }

  showRelativeBuryAreaImageList() {
    if (!this.culturalRelicInfo.buryAreaAttachmentList || this.culturalRelicInfo.buryAreaAttachmentList.length == 0) {
      this.pageService.showMessage("暂无相关图片");
    }
    else {
      let picUrls: string[] = [];
      for (let i = 0; i < this.culturalRelicInfo.buryAreaAttachmentList.length; i++) {
        if (this.culturalRelicInfo.buryAreaAttachmentList[i].fileType == "img") {
          let origionFile = this.culturalRelicInfo.buryAreaAttachmentList[i].fileUrl.replace("/CompressionFile/", "/OriginalFile/");
          picUrls.push(origionFile);
        }
      }
      this.modalCtrl.create("ShowPicturePage", { "picUrls": picUrls, "currentIndex": 0 }).present();
    }
  }

  showLocation() {
    let culturalRelicMapInfo = new CulturalRelicInfo();
    culturalRelicMapInfo.culturalRelic = this.culturalRelicInfo.culturalRelic;
    culturalRelicMapInfo.twoLineInfoList = this.culturalRelicInfo.twoLineInfoList;
    let locate = this.modalCtrl.create("MapCulturalRelicLocatePage", { "culturalRelicMapInfo": culturalRelicMapInfo, "coordinateAccurateList": this.culturalRelicInfo.coordinateAccurateList });
    locate.onDidDismiss(data => {
      if (data) {
        this.culturalRelicInfo.culturalRelic.coordinateX = data.culturalRelicX;
        this.culturalRelicInfo.culturalRelic.coordinateY = data.culturalRelicY;
        this.culturalRelicInfo.culturalRelic.coordinateAccurate = data.coordinateAccurate;
      }
    });
    locate.present();
  }

  showPic(pic) {
    let picArray = [];
    picArray.push(pic);
    this.navCtrl.push("ShowPicturePage", { "picUrls": picArray, "currentIndex": 0 });
  }

}
