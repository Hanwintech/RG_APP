import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { SearchPage } from './../../../../base-pages/search-page';
import { ReportQueryPatrolSearchDataSource } from './../../../../models/search/report-query-patrol-search.model';
import { ReportQueryPatrolSearch } from './../../../../models/search/report-query-patrol-search.model';
import { IntegerKeyValue } from "./../../../../models/integer-key-value.model";
//import { AlertController } from 'ionic-angular';
import { PageService } from './../../../../services/page.service';


@IonicPage()
@Component({
  selector: 'page-inspect-condition-inquiry',
  templateUrl: 'inspect-condition-inquiry.html',
})
export class InspectConditionInquiryPage extends SearchPage<ReportQueryPatrolSearch, ReportQueryPatrolSearchDataSource>  {

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    //public modalCtrl: ModalController,
    //public alertCtrl: AlertController,
    public pageService: PageService
  ) {
    super(params, viewCtrl);
    //this.search.patrolStatus=-1;
  }

  clear() {
    this.search.startDateTime = "";
    this.search.endDateTime = "";
    this.search.patrolStatus=-1;
  }

}
