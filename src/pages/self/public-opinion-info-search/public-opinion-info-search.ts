import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SearchPage } from './../../../base-pages/search-page';
import { PublicOpinionInfoSearch, PublicOpinionInfoSearchDataSource } from './../../../models/self/public-opinion-info.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";

@IonicPage()
@Component({
  selector: 'page-public-opinion-info-search',
  templateUrl: 'public-opinion-info-search.html',
})
export class PublicOpinionInfoSearchPage extends SearchPage<PublicOpinionInfoSearch, PublicOpinionInfoSearchDataSource> {
  private districtList: IntegerKeyValue[];

  constructor(public params: NavParams, public viewCtrl: ViewController) {
    super(params, viewCtrl);
    this.districtList = [];
    this.areaChanged();
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

  clear() {
    this.search.subject = "";
    this.search.clearNumbers();
    this.districtList = [];
    this.areaChanged();
  }
}