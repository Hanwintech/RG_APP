import { UpdateRentNeedPayedMoney } from './../../apis/collect-rent/update-rent-need-payed-money.api';
import { GetPayedPersonList } from './../../apis/collect-rent/get-payed-person-list.api';
import { GetRentNeedPayedMoneyDetail } from './../../apis/collect-rent/get-rent-need-payed-money-detail.api';
import { INeedPayedMoney } from './../../models/need-payed-money.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../services/api.service';
import { PageService } from '../../services/page.service';

/**
 * Generated class for the CollectRentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collect-rent-detail',
  templateUrl: 'collect-rent-detail.html',
})
export class CollectRentDetailPage {

  rent: INeedPayedMoney;
  payedPerson = [];

  feeType =
  {
    1: '保证金',
    2: '差额租金',
    3: '有线电视收视费',
    4: '宽带上网费',
    5: '清洁费',
    6: '租金',
    7: '提前退租扣款',
    8: '逾期退房扣款',
    9: '物品损坏',
    10: '综合押金',
    11: '费用补缴'
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
    public pageService: PageService) {
    this.rent = this.navParams.get('rent');
    this.fetchCodes();
    this.fetchDetail(this.rent.contractID, this.rent.feeType, this.rent.terms);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectRentDetailPage');
  }

  fetchCodes() {
    let api = new GetPayedPersonList();
    this.apiService.sendApi(api).subscribe(res => {
      if (res.success) {
        this.payedPerson = res.data;
      } else {
        this.pageService.showMessage(res.reason);
      }
    }, error => {
      this.pageService.showMessage(error);
    })
  }

  fetchDetail(id, feeType, terms) {
    this.pageService.showLoading('加载中');
    let api = new GetRentNeedPayedMoneyDetail(id, feeType, terms);
    this.apiService.sendApi(api).subscribe(res => {
      this.pageService.dismissLoading();
      if (res.success) {
        this.rent = <INeedPayedMoney>res.data;
        this.rent.payedDate = new Date().toISOString();
      } else {
        this.pageService.showMessage(res.reason);
      }
    }, error => {
      this.pageService.dismissLoading();
      this.pageService.showMessage(error);
    })
  }

  submit() {
    this.pageService.showLoading('加载中');
    let api = new UpdateRentNeedPayedMoney(this.rent);
    this.apiService.sendApi(api).subscribe(res => {
      this.pageService.dismissLoading();
      if (res.success) {
        this.pageService.showMessage("保存成功");
        this.navCtrl.pop();
      } else {
        this.pageService.showMessage(res.reason);
      }
    }, error => {
      this.pageService.dismissLoading();
      this.pageService.showMessage(error);
    })
  }

}
