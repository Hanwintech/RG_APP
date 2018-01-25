import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { NetworkInformationService } from './../../../services/network-information.service';
import { DetailPage } from './../../../base-pages/detail-page';
import * as MuseumAPI  from './../../../apis/property/museum.api';
import { MuseumInfo } from './../../../models/property/museum-info.model';
import { EnumAppRole } from "./../../../models/enum";
import { Attachment } from "./../../../models/attachment.model";

@IonicPage()
@Component({
  selector: 'page-museum-info-detail',
  templateUrl: 'museum-info-detail.html',
})
export class MuseumInfoDetailPage extends DetailPage {
  private canShowLocation: boolean;
  private museumInfo: MuseumInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer,
    public networkInfoService: NetworkInformationService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.canShowLocation = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.Volunteer);
    this.museumInfo = new MuseumInfo();

    let museumID = this.navParams.data

    this.apiService.sendApi(new MuseumAPI.GetMuseumInfo(museumID)).subscribe(
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
    super.downloadFile(this.networkInfoService, fileUrl, fileName);
  }

  showAttachmentList(fileUrl: string) {
    this.showPicture(fileUrl, this.museumInfo.attachmentList)
  }

  showLocation() {
    let museumMapInfo = new MuseumInfo();
    museumMapInfo.museumDetailInfo = this.museumInfo.museumDetailInfo;
    let locate = this.modalCtrl.create("MapCulturalRelicLocatePage", {"culturalRelicMapInfo":museumMapInfo,"coordinateAccurateList":this.museumInfo.coordinateAccurateList});
    locate.onDidDismiss(data => {
      if(data){
        this.museumInfo.museumDetailInfo.coordinateX=data.culturalRelicX;
        this.museumInfo.museumDetailInfo.coordinateY=data.culturalRelicY;
        this.museumInfo.museumDetailInfo.coordinateAccurate=data.coordinateAccurate;
      }
    });
    locate.present();
  }
}
