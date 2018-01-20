import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SystemConst } from "./../../../services/system-const.service";
import { SearchPage } from './../../../base-pages/search-page';
import { PatrolInfoSearch, PatrolInfoSearchDataSource } from './../../../models/patrol/patrol-info.model';
import { IntegerKeyValue } from "./../../../models/integer-key-value.model";

@IonicPage()
@Component({
  selector: 'page-patrol-info-search',
  templateUrl: 'patrol-info-search.html',
})
export class PatrolInfoSearchPage extends SearchPage<PatrolInfoSearch, PatrolInfoSearchDataSource> {
  private districtList: IntegerKeyValue[];

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public systemConst: SystemConst
  ) {
    super(params, viewCtrl);
    this.areaChanged(this.search.district);
  }

  areaChanged(district) {
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
    this.search.patrolUserName = "";
    this.search.manageUnitName = "";
    this.search.othersPeople = "";
    this.search.startDateTime = "";
    this.search.endDateTime = "";
    this.search.clearNumbers();
    this.areaChanged(this.search.district);
  }
}
