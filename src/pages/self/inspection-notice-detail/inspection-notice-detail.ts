import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { NetworkInformationService } from './../../../services/network-information.service';
import { GetInspectionNoticeInfo } from './../../../apis/self/inspection-notice.api';
import { DetailPage } from './../../../base-pages/detail-page';
import { InspectionNoticeInfo } from './../../../models/self/inspection-notice-info.model';
import { Attachment } from "./../../../models/attachment.model";

@IonicPage()
@Component({
  selector: 'page-inspection-notice-detail',
  templateUrl: 'inspection-notice-detail.html',
})
export class InspectionNoticeDetailPage extends DetailPage {
  private inspectionNotice: InspectionNoticeInfo;
  private segmentIndex: string;
  private record: number;
  private canShowButton: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer,
    public fileOpener: FileOpener,
    public pageService: PageService,
    public networkInfoService: NetworkInformationService
  ) {
    super(navCtrl, file, fileTransfer, pageService,modalCtrl);
    this.apiService.sendApi(new GetInspectionNoticeInfo(this.navParams.data.keyID)).subscribe(
      res => {
        if (res.success) {
          this.inspectionNotice = res.data;
          if (this.navParams.data.segmentIndex) { this.segmentIndex = this.navParams.data.segmentIndex; this.canShowButton = true; }
          this.record = this.inspectionNotice.inspectorNotice.recordState;
          super.changeAttachmentFileType(this.inspectionNotice.attachmentList);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  download(file: Attachment) {
    file.startDowload=true;
    super.downloadFile(this.networkInfoService, file);
  }

  open(file: Attachment) {
    super.openFile(this.fileOpener, file);
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
      if(data){
        this.inspectionNotice = data;
        this.record = this.inspectionNotice.inspectorNotice.recordState;
      }
      else{
        return;
      }
    });
    searchModal.present();
  }
}
