import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { PublicOpinionInfoSearch, PublicOpinionInfoSearchDataSource } from './../../../models/self/public-opinion-info.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";

@IonicPage()
@Component({
  selector: 'page-public-opinion-info-search',
  templateUrl: 'public-opinion-info-search.html',
})
export class PublicOpinionInfoSearchPage {
  private search: PublicOpinionInfoSearch;
  private searchDataSource: PublicOpinionInfoSearchDataSource;
  private districtList: IntegerKeyValue[];

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.search = params.data.search;
    this.searchDataSource = params.data.dataSource;
    this.districtList = [];
    this.areaChanged();
    console.log(this.search);
    console.log(this.searchDataSource);
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

  close() {
    this.viewCtrl.dismiss({ "needSearch": false });
  }

  clear() {
    this.search.subject = "";
    this.search.clearNumbers();
    this.districtList = [];
    this.areaChanged();
  }

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
  }
}
