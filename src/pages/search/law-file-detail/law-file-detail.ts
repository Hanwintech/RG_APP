import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController  } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { NetworkInformationService } from './../../../services/network-information.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { LawFileInfo } from './../../../models/search/law-file-infos.model';
import { Attachment } from "./../../../models/attachment.model";


@IonicPage()
@Component({
  selector: 'page-law-file-detail',
  templateUrl: 'law-file-detail.html',
})
export class LawFileDetailPage extends DetailPage {
  private lawFileInfo: LawFileInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer,
    public pageService: PageService,
    public networkInfoService: NetworkInformationService
    ) {
      super(navCtrl, file, fileTransfer, pageService);

      this.lawFileInfo = this.navParams.data;
  
      super.changeAttachmentFileType(this.lawFileInfo.attachmentList)
  }
  showPicture(fileUrl: string, attachmentList: Attachment[]) {
    super.showSlidesPage(attachmentList, fileUrl);
  }
  download(fileUrl: string, fileName: string) {
    super.downloadFile(this.networkInfoService, fileUrl, fileName);
  }

  showAttachmentList(fileUrl: string) {
    super.showSlidesPage(this.lawFileInfo.attachmentList, fileUrl);
  }

  close() {
    this.viewCtrl.dismiss(this.lawFileInfo);
  }
}
