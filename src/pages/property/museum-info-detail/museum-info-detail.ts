import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { GetMuseumInfo } from './../../../apis/property/get-museum-info.api';
import { MuseumInfo } from './../../../models/property/museum-info.model';
import { Attachment } from "./../../../models/attachment.model";

@IonicPage()
@Component({
  selector: 'page-museum-info-detail',
  templateUrl: 'museum-info-detail.html',
})
export class MuseumInfoDetailPage {
  private fileTransfer: FileTransferObject;
  private museumInfo: MuseumInfo;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private apiService: ApiService,
    private pageService: PageService,
    private file: File,
    private transfer: FileTransfer
  ) {
    this.fileTransfer = this.transfer.create();
    this.museumInfo = new MuseumInfo();

    let museumID = this.navParams.data

    this.apiService.sendApi(new GetMuseumInfo(museumID)).subscribe(
      res => {
        if (res.success) {
          this.museumInfo = res.data;

          this.changeAttachmentFileType(this.museumInfo.attachmentList)
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  changeAttachmentFileType(attachmentList: Attachment[]) {
    for (let att of attachmentList) {
      if (att.fileType == 'xls' || att.fileType == 'xlsx') {
        att.fileType = "excel";
      } else if (att.fileType == 'html' || att.fileType == 'htm') {
        att.fileType = "html";
      } else if (att.fileType == 'jpg' || att.fileType == 'jpeg' || att.fileType == 'png' || att.fileType == 'gif') {
        att.fileType = "img";
      } else if (att.fileType == 'pdf') {
        att.fileType = "pdf";
      } else if (att.fileType == 'ppt' || att.fileType == 'pptx') {
        att.fileType = "ppt";
      } else if (att.fileType == 'txt') {
        att.fileType = "txt";
      } else if (att.fileType == 'doc' || att.fileType == 'docx') {
        att.fileType = "word";
      } else {
        att.fileType = "other_file";
      }
    }
  }

  showPicture(fileUrl: string, attachmentList: Attachment[]) {
    let picUrls: string[] = [];
    let currentIndex: number = 0;
    for (let i = 0; i < attachmentList.length; i++) {
      if (attachmentList[i].fileType == "img") {
        picUrls.push(attachmentList[i].fileUrl)
      }
      if (attachmentList[i].fileUrl == fileUrl) {
        currentIndex = i;
      }
    }
    this.navCtrl.push("ShowPicturePage", { "picUrls": picUrls, "currentIndex": currentIndex });
  }

  download(fileUrl: string, fileName:string) {
    fileUrl = fileUrl.replace("/CompressionFile/","/OriginalFile/")
    this.fileTransfer.download(fileUrl, this.file.externalRootDirectory + 'com.hanwintech.wwbhzf/' + fileName).then((entry) => {      
      this.pageService.showMessage('下载完成: ' + entry.toURL());
    }, (error) => {
      this.pageService.showErrorMessage(error);
    });
  }

  showAttachmentList(fileUrl: string) {
    this.showPicture(fileUrl, this.museumInfo.attachmentList)
  }

  showLocation() {
    console.log(this.museumInfo.museumDetailInfo.id);
  }
}
