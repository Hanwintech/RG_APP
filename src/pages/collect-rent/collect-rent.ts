import { SearchCondition } from './../../models/search-condition';
import { INeedPayedMoney } from './../../models/need-payed-money.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ApiService } from '../../services/api.service';
import { PageService } from '../../services/page.service';
import { GetRentNeedPayedMoneyList } from '../../apis/collect-rent/get-rent-need-payed-money-list.api';

/**
 * Generated class for the CollectRentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collect-rent',
  templateUrl: 'collect-rent.html',
})
export class CollectRentPage {
  refresher;
  condition: SearchCondition;
  rentList: Array<INeedPayedMoney> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
    public pageService: PageService,
    public popoverCtrl: PopoverController
  ) {
    this.condition = new SearchCondition();
    this.condition.name = '';
    this.condition.certno = '';
    this.condition.address = '';
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CollectRentPage');
    this.fetchRentList();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.fetchRentList();
  }

  fetchRentList() {
    this.pageService.showLoading('加载中');
    let api = new GetRentNeedPayedMoneyList(this.condition.name, this.condition.certno, this.condition.address);
    this.apiService.sendApi(api).subscribe(res => {
      if (this.refresher) {
        this.refresher.complete();
      }
      if (res.success) {
        this.rentList = <Array<INeedPayedMoney>>res.data;
      } else {
        this.pageService.showMessage(res.reason);
      }
      this.pageService.dismissLoading();
    }, error => {
      this.pageService.dismissLoading();
      this.pageService.showMessage(error);
    })
  }

  showDetail(rent) {
    this.navCtrl.push('CollectRentDetailPage', {rent: rent});
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create('SearchConditionPage', this.condition);
    popover.onDidDismiss(() => {
      this.fetchRentList();
    });
    popover.present({
      ev: ev
    });
  }

}
