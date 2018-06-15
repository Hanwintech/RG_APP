import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { PageService } from './../../../services/page.service';


@IonicPage()
@Component({
  selector: 'page-cutural-relic-statistics',
  templateUrl: 'cutural-relic-statistics.html',
})
export class CuturalRelicStatisticsPage{
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public pageService: PageService,) {
  }
  culturalRelicStatistics(listType: number) {
    this.pageService.showLoading("正在加载");
    this.navCtrl.push("CulturalRelicStatisticsPage", listType);
  }
}
