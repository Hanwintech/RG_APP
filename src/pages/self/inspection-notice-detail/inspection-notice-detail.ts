import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { InspectionNoticeInfo } from './../../../models/self/inspection-notice-info.model';

@IonicPage()
@Component({
  selector: 'page-inspection-notice-detail',
  templateUrl: 'inspection-notice-detail.html',
})
export class InspectionNoticeDetailPage extends DetailPage {
  private inspectionNotice: InspectionNoticeInfo;
  private segmentIndex: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.inspectionNotice = this.navParams.data.data;
    this.segmentIndex = this.navParams.data.segmentIndex;

    super.changeAttachmentFileType(this.inspectionNotice.attachmentList)
  }

  download(fileUrl: string, fileName: string) {
    super.downloadFile(fileUrl, fileName);
  }

  showAttachmentList(fileUrl: string) {
    super.showSlidesPage(this.inspectionNotice.attachmentList, fileUrl);
  }

  showCulturalRelic(fK_CulturalRelicID: string) {
    this.navCtrl.push('CulturalRelicInfoDetailPage', fK_CulturalRelicID);
  }

  close() {
    this.viewCtrl.dismiss(this.inspectionNotice);
  }

  reply() {
    let searchModal = this.modalCtrl.create('InspectionNoticeReplyPage', this.inspectionNotice);
    searchModal.onDidDismiss(data => {
      this.inspectionNotice = data;
      this.viewCtrl.dismiss(this.inspectionNotice);
    });
    searchModal.present();
  }
}
