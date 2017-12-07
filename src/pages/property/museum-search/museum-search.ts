import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { MuseumInfoSearch, MuseumInfoSearchDataSource } from './../../../models/property/museum-info.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";

@IonicPage()
@Component({
  selector: 'page-museum-search',
  templateUrl: 'museum-search.html',
})
export class MuseumSearchPage {
  private search: MuseumInfoSearch;
  private searchDataSource: MuseumInfoSearchDataSource;
  private districtList: IntegerKeyValue[];

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.search = params.data.search;
    this.searchDataSource = params.data.dataSource;
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
  
  close() {
    this.viewCtrl.dismiss({ "needSearch": false });
  }

  clear() {
    this.search.museumName = "";
    this.search.location = "";
    this.search.remark = "";
    this.search.clearNumbers();
    this.districtList = [];
    this.areaChanged();
  }

  doSearch() {
    this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
  }
}
