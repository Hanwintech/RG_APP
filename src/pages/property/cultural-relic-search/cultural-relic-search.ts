import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';

@IonicPage()
@Component({
  selector: 'page-cultural-relic-search',
  templateUrl: 'cultural-relic-search.html',
})
export class CulturalRelicSearchPage {
  private search: CulturalRelicInfoSearch;
  private searchDataSource: CulturalRelicInfoSearchDataSource;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.search = params.data.search;
    this.searchDataSource = params.data.dataSource;
  }

  close() {
    this.viewCtrl.dismiss({ "needSearch": false });
  }

  clear() {
    this.search.culturalRelicName = "";
    this.search.culturalRelicCode = "";
    this.search.location = "";
    this.search.statisticsTime = "";
    this.search.manageUnitName = "";
    this.search.remark = "";
    this.search.clearNumbers();
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
    // this.search
  }

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
  }
}
