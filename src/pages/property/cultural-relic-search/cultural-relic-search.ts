import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SearchPage } from './../../../base-pages/search-page';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";

@IonicPage()
@Component({
  selector: 'page-cultural-relic-search',
  templateUrl: 'cultural-relic-search.html',
})
export class CulturalRelicSearchPage extends SearchPage<CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource> {
  private districtList: IntegerKeyValue[];
  private twoStageTypeList: IntegerKeyValue[];

  constructor(public params: NavParams, public viewCtrl: ViewController) {
    super(params, viewCtrl);
    this.districtList = [];
    this.twoStageTypeList = [];
    this.areaChanged();
    this.typeChanged();
  }

  areaChanged() {
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

  typeChanged() {
    this.twoStageTypeList = [];
    let temp: IntegerKeyValue[] = [];
    for (let d of this.searchDataSource.culturalRelicTwoStageTypeList) {
      if (d.parentId == this.search.culturalRelicType.toString()) {
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
      this.twoStageTypeList.push(kvp)
      for (let kv of temp) {
        this.twoStageTypeList.push(kv)
      }
    }
  }

  clear() {
    this.search.culturalRelicName = "";
    this.search.culturalRelicCode = "";
    this.search.location = "";
    this.search.statisticsTime = "";
    this.search.manageUnitName = "";
    this.search.remark = "";
    this.search.clearNumbers();
    this.districtList = [];
    this.twoStageTypeList = [];
    this.areaChanged();
    this.typeChanged();
  }
}
