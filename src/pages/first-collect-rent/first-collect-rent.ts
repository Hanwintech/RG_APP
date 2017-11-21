import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { GetFirstNeedPayedMoneyList } from '../../apis/collect-rent/get-first-need-payed-money-list.api';
import { INeedPayedMoney } from '../../models/need-payed-money.model';
import { SearchCondition } from '../../models/search-condition';
import { ApiService } from '../../services/api.service';
import { PageService } from '../../services/page.service';

/**
 * Generated class for the FirstCollectRentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-first-collect-rent',
  templateUrl: 'first-collect-rent.html',
})
export class FirstCollectRentPage {

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
    let api = new GetFirstNeedPayedMoneyList(this.condition.name, this.condition.certno, this.condition.address);
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
    this.navCtrl.push('FirstCollectRentDetailPage', {rent: rent});
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
