import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { NetworkInformationService } from './../../../services/network-information.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';
import { EnumAppRole } from "./../../../models/enum";
import { Attachment } from "./../../../models/attachment.model";

@IonicPage()
@Component({
  selector: 'page-construction-site-info-detail',
  templateUrl: 'construction-site-info-detail.html',
})
export class ConstructionSiteInfoDetailPage extends DetailPage {
  private canShowLocation: boolean;
  private culturalRelicInfo: CulturalRelicInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService,
    public networkInfoService: NetworkInformationService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.canShowLocation = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.Volunteer);
    this.culturalRelicInfo = new CulturalRelicInfo();

    let culturalRelicID = this.navParams.data

    this.apiService.sendApi(new GetCulturalRelicInfo(culturalRelicID)).subscribe(
      res => {
        if (res.success) {
          this.culturalRelicInfo = res.data;
          console.log(res.data);
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
    super.downloadFile(this.networkInfoService, fileUrl, fileName);
  }

  showAttachmentList(fileUrl: string) {
    this.showPicture(fileUrl, this.culturalRelicInfo.attachmentList)
  }

  showTwoLimitImageList() {
    this.showPicture("", this.culturalRelicInfo.twoLimitImageList)
  }

  showLocation() {
    let constructionMapInfo = new CulturalRelicInfo();
    constructionMapInfo.culturalRelic = this.culturalRelicInfo.culturalRelic;
    constructionMapInfo.culturalRelicPostInfo = this.culturalRelicInfo.culturalRelicPostInfo;

    let locate = this.modalCtrl.create("MapCulturalRelicLocatePage", {"culturalRelicMapInfo":constructionMapInfo,"coordinateAccurateList":this.culturalRelicInfo.coordinateAccurateList});
    locate.onDidDismiss(data => {
      if(data){
        this.culturalRelicInfo.culturalRelic.coordinateX=data.culturalRelicX;
        this.culturalRelicInfo.culturalRelic.coordinateY=data.culturalRelicY;
        this.culturalRelicInfo.culturalRelic.coordinateAccurate=data.culturalRelic.coordinateAccurate;
      }
    });
    locate.present();
  }
}
