import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SystemConst } from "./../../../services/system-const.service";
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
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public systemConst: SystemConst
  ) {
    super(params, viewCtrl);
    this.areaChanged(this.search.district);
    this.tempArea = this.search.area + "_" + this.search.areaName;
    if (this.search.area > 0 && !this.search.areaName) {
      this.tempArea = this.search.area + "_" + "淮安市";
    }
    this.tempDistrict = this.search.district + "_" + this.search.districtName;
  }

  districtChanged() {
    if (this.tempDistrict) {
      this.search.district = this.tempDistrict.split("_").shift();
      this.search.districtName = this.tempDistrict.split("_").pop();
      this.search.districtName = this.search.districtName == "请选择" ? "" : this.search.districtName;
    }
  }
  areaChanged(district) {
    if (this.tempArea) {
      this.search.area = this.tempArea.split("_").shift();
      this.search.areaName = this.tempArea.split("_").pop();
      this.search.areaName = this.search.areaName == "请选择" ? "" : this.search.areaName;
    }
    this.districtList = this.systemConst.EMPTY_SELECT_LIST;
    this.search.district = district ? district : this.systemConst.EMPTY_INTEGER;
    for (let d of this.searchDataSource.districtList) {
      if (d.parentId == this.search.area.toString()) {
        let kvp: IntegerKeyValue = new IntegerKeyValue();
        kvp.key = d.value;
        kvp.value = d.text;
        this.districtList.push(kvp)
      }
    }
  }

  clear() {
    this.search.culturalRelicName = "";
    this.areaChanged(this.search.district);
    this.clearData();
  }

  private clearData() {
    this.search.culturalRelicName = "";
    this.tempArea = "";
    this.search.areaName = "";
    this.search.area = this.systemConst.EMPTY_INTEGER;
    this.search.culturalRelicLevelName = "";
    this.search.culturalRelicLevel = this.systemConst.EMPTY_INTEGER;
    this.tempDistrict = "";
    this.search.startDate = "";
    this.search.endDate = "";
  }
}
