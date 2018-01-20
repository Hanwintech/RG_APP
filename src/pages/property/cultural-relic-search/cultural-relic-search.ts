import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { SystemConst } from "./../../../services/system-const.service";
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

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public systemConst: SystemConst
  ) {
    super(params, viewCtrl);
    this.areaChanged(this.search.district);
    this.typeChanged(this.search.culturalRelicTwoStageType);
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

  typeChanged(twoStageType) {
    this.twoStageTypeList  = this.systemConst.EMPTY_SELECT_LIST;
    this.search.culturalRelicTwoStageType = twoStageType ? twoStageType : this.systemConst.EMPTY_INTEGER;
    for (let d of this.searchDataSource.culturalRelicTwoStageTypeList) {
      if (d.parentId == this.search.culturalRelicType.toString()) {
        let kvp: IntegerKeyValue = new IntegerKeyValue();
        kvp.key = d.value;
        kvp.value = d.text;
        this.twoStageTypeList.push(kvp)
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
    this.areaChanged(this.search.district);
    this.typeChanged(this.search.culturalRelicTwoStageType);
  }
}
