import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SearchPage } from './../../../base-pages/search-page';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";

@IonicPage()
@Component({
  selector: 'page-two-line-search',
  templateUrl: 'two-line-search.html',
})
export class TwoLineSearchPage extends SearchPage<CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource> {
  private districtList: IntegerKeyValue[];
  private tempArea: any;
  private tempDistrict: any;
  constructor(public params: NavParams, public viewCtrl: ViewController) {
    super(params, viewCtrl);
    this.districtList = [];
    this.areaChanged();
    this.tempArea = this.search.area + "_" + this.search.areaName;
    this.tempDistrict = this.search.district + "_" + this.search.districtName;
  }

  districtChanged() {
    if (this.tempDistrict) { this.search.district = this.tempDistrict.split("_").shift(); this.search.districtName = this.tempDistrict.split("_").pop(); }
  }
  areaChanged() {
    if (this.tempArea) { this.search.area = this.tempArea.split("_").shift(); this.search.areaName = this.tempArea.split("_").pop(); }
    this.districtList = [];
    let temp: IntegerKeyValue[] = [];
    for (let d of this.searchDataSource.districtList) {
      if (d.parentId == this.search.area.toString()) {
        let kvp: IntegerKeyValue = new IntegerKeyValue();
        kvp.key = d.value;
        kvp.value = d.text;
        temp.push(kvp)
      }
    }
    if (temp.length != 0) {
      let kvp: IntegerKeyValue = new IntegerKeyValue();
      kvp.key = -1;
      kvp.value = "请选择";
      this.districtList.push(kvp)
      for (let kv of temp) {
        this.districtList.push(kv)
      }
    }
  }

  clear() {
    this.search.culturalRelicName = "";
    this.districtList = [];
    this.areaChanged();
    this.clearData();
  }

  private clearData() {
    this.search.culturalRelicName = "";
    this.search.areaName="";
    this.search.culturalRelicLevelName="";
    this.search.districtName="";
    this.tempArea = "";
    this.tempDistrict = "";
    this.search.startDate = "";
    this.search.endDate = "";
  }
}
