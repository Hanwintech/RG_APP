import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetMuseumInfo } from './../../../apis/property/get-museum-info.api';
import { MuseumInfo } from './../../../models/property/museum-info.model';
import { Attachment } from "./../../../models/attachment.model";

@IonicPage()
@Component({
  selector: 'page-museum-info-detail',
  templateUrl: 'museum-info-detail.html',
})
export class MuseumInfoDetailPage extends DetailPage {
  private museumInfo: MuseumInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.museumInfo = new MuseumInfo();

    let museumID = this.navParams.data

    this.apiService.sendApi(new GetMuseumInfo(museumID)).subscribe(
      res => {
        if (res.success) {
          this.museumInfo = res.data;

          super.changeAttachmentFileType(this.museumInfo.attachmentList)
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
    this.showPicture(fileUrl, this.museumInfo.attachmentList)
  }

  showLocation() {
    console.log(this.museumInfo.museumDetailInfo.id);
  }
}
