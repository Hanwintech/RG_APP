import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetCulturalRelicInfo } from './../../../apis/property/get-cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';
import { Attachment } from "./../../../models/attachment.model";

@IonicPage()
@Component({
  selector: 'page-construction-site-info-detail',
  templateUrl: 'construction-site-info-detail.html',
})
export class ConstructionSiteInfoDetailPage extends DetailPage {
  private culturalRelicInfo: CulturalRelicInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);
    
    this.culturalRelicInfo = new CulturalRelicInfo();

    let culturalRelicID = this.navParams.data

    this.apiService.sendApi(new GetCulturalRelicInfo(culturalRelicID)).subscribe(
      res => {
        if (res.success) {
          this.culturalRelicInfo = res.data;

          super.changeAttachmentFileType(this.culturalRelicInfo.attachmentList)
          super.changeAttachmentFileType(this.culturalRelicInfo.twoLimitImageList)
          super.changeAttachmentFileType(this.culturalRelicInfo.twoLimitAttachmentList)
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

  download(fileUrl: string, fileName: string) {
    super.downloadFile(fileUrl, fileName);
  }

  showAttachmentList(fileUrl: string) {
    this.showPicture(fileUrl, this.culturalRelicInfo.attachmentList)
  }

  showTwoLimitImageList() {
    this.showPicture("", this.culturalRelicInfo.twoLimitImageList)
  }

  showLocation() {
    console.log(this.culturalRelicInfo.upCulturalRelic.culturalRelicID);
  }
}
