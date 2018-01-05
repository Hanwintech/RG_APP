import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { GetPatrolInfo } from './../../../apis/patrol/patrol-info.api';
import { PatrolInfoDetails } from './../../../models/patrol/patrol-info.model';

import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';

@IonicPage()
@Component({
  selector: 'page-patrol-info-detail',
  templateUrl: 'patrol-info-detail.html',
})
export class PatrolInfoDetailPage extends DetailPage {
  private patrolInfo: PatrolInfoDetails;
  private caseProblem: string[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.patrolInfo = this.navParams.data;

    this.apiService.sendApi(new GetPatrolInfo(this.patrolInfo.patrolInfo.keyID, localStorage.getItem("userId"), localStorage.getItem("manageUnitId"), localStorage.getItem("userType"))).subscribe(
      res => {
        if (res.success) {
          this.patrolInfo = res.data;

          let allProblems = {};
          for (let p of this.patrolInfo.patrolCaseProblemList) {
            allProblems[p.caseValue] = p.caseProblem;
          }

          this.caseProblem = [];
          for (let i: number = 0; i < this.patrolInfo.selectedCaseProblemList.length; i++) {
            this.caseProblem.push((i + 1).toString() + "." + allProblems[this.patrolInfo.selectedCaseProblemList[i]]);
          }

          super.changeAttachmentFileType(this.patrolInfo.attachmentList);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showLocation() {
    this.apiService.sendApi(new GetCulturalRelicInfo(this.patrolInfo.patrolInfo.fK_CulturalRelicID)).subscribe(
      res => {
        if (res.success) {
          let culturalRelicInfo: CulturalRelicInfo = res.data;
          this.navCtrl.push('MapPeopleLocatePage', culturalRelicInfo);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  showCulturalRelic(fK_CulturalRelicID: string) {
    this.navCtrl.push('CulturalRelicInfoDetailPage', fK_CulturalRelicID);
  }

  showCaseProblem() {
    this.navCtrl.push('CaseProblemListPage', { "list": this.patrolInfo.patrolCaseProblemList, "selected": this.patrolInfo.selectedCaseProblemList });
  }

  showLog() {
    this.navCtrl.push('PatrolInfoDetailProcessPage', this.patrolInfo);
  }

  close() {
    this.navCtrl.pop();
  }
}
