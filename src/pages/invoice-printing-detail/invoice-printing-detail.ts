import { UpdateBillingInfo } from './../../apis/invoice-printing/update-billing-info.api';
import { GetNewInvoiceNoBook } from './../../apis/invoice-printing/get-new-invoice-no-book.api';
import { GetNewInvoiceNo } from './../../apis/invoice-printing/get-new-invoice-no.api';
import { IBilling } from './../../models/billing.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiService } from '../../services/api.service';
import { PageService } from '../../services/page.service';
declare let cordova: any;
/**
 * Generated class for the InvoicePrintingDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-invoice-printing-detail',
  templateUrl: 'invoice-printing-detail.html',
})
export class InvoicePrintingDetailPage {

  billing: IBilling;
  invoiceNoBook;
  invoiceNoBookId;
  invoiceNos;
  invoiceNo;

  feeStatus = {
    0: '正常缴纳',
    1: '欠租补缴'
  }

  contractType =
  {
    1: '新签',
    2: '换房变更',
    3: '主体变更',
    4: '续签',
    5: '包房新签',
    6: '包房续签'
  }

  bookignInvoiceStatus =
  {
    1: '未开票',
    2: '开票中',
    3: '未领取',
    4: '已领取'
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public apiService: ApiService,
    public pageService: PageService) {
    this.billing = navParams.get('billing');
    this.billing.invoiceUser = localStorage.getItem('invoiceUser');
    this.fetchInvoiceNoBook();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePrintingDetailPage');
  }

  fetchInvoiceNoBook() {
    let api = new GetNewInvoiceNoBook(this.billing.communityId);
    this.apiService.sendApi(api).subscribe(res => {
      if (res.success) {
        this.invoiceNoBook = res.data;
      } else {
        this.pageService.showMessage(res.reason);
      }
    }, error => {
      this.pageService.showMessage(error);
    })
  }

  fetchInvoiceNo() {
    this.pageService.showLoading('加载中');
    let api = new GetNewInvoiceNo(this.invoiceNoBookId);
    this.apiService.sendApi(api).subscribe(res => {
      this.pageService.dismissLoading();
      if (res.success) {
        this.invoiceNos = res.data;
      } else {
        this.pageService.showMessage(res.reason);
      }
    }, error => {
      this.pageService.dismissLoading();
      this.pageService.showMessage(error);
    })
  }

  print() {

    this.pageService.showLoading('打印中');

    var content = '\n 姓名: ';
    content += this.billing.name;
    content += '\n 身份证号码: ';
    content += this.billing.certNo;
    content += '\n 租贷位置: ';
    content += this.billing.address;
    content += '\n 期数: ';
    content += this.billing.terms;
    content += '\n 租金金额: ';
    content += this.billing.money;
    content += '\n 开票日期: ';
    var date = new Date(this.billing.payedDate);
    var datestring = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
    content += datestring;

    content += '\n\n\n\n\n\n\n\n\n\n';

    cordova.plugins.Jolimark.print(content, msg => {
      this.pageService.dismissLoading();
      this.pageService.showMessage('打印成功');
    }, error => {
      this.pageService.dismissLoading();
      this.pageService.showMessage(error);
    });
  }

  // success() {
  //   this.pageService.dismissLoading();
  //   this.pageService.showMessage('打印成功');
  // }

  // error(error) {
  //   this.pageService.dismissLoading();
  //   this.pageService.showMessage(error);
  // }
  submit() {
    const alert = this.alertCtrl.create({
      title: '提交',
      message: '请确认发票已正确打印',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确认提交',
          handler: () => {
            this.pageService.showLoading('正在提交');
            let api = new UpdateBillingInfo(this.billing);
            this.apiService.sendApi(api).subscribe(res => {
              this.pageService.dismissLoading();
              if (res.success) {
                localStorage.setItem('invoiceUser', this.billing.invoiceUser);
                this.pageService.showMessage('提交成功');
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
      ]
    });
    alert.present();
  }

}
