import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CommonUserInfo } from "./../../../models/user-info.model";

@IonicPage()
@Component({
  selector: 'page-patrol-user-info',
  templateUrl: 'patrol-user-info.html',
})
export class PatrolUserInfoPage {
  private userInfo: string[];
  private searchQuery: string = '';
  private items;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
  ) {
    this.userInfo = this.navParams.data;
  }

  ionViewDidLoad() {
    //解决监听中文输入拼音的问题
    var node:any = document.querySelector('.searchbar-input');
    var cpLock = false;
    let that = this;
    node.addEventListener('compositionstart', function () {
      cpLock = true;
    })
    node.addEventListener('compositionend', function () {
      cpLock = false;
      if (!cpLock) {
        that.getItems(node.value);
      };
    })
    node.addEventListener('input', function () {
      if (!cpLock) {
        that.getItems(this.value);
      };
    });
  }
  
  selectAll() {
    for (let item of this.userInfo) {
      let itemData: any = item;
      itemData.boolData = true;
    }
  }

  emptyData() {
    for (let item of this.userInfo) {
      let itemData: any = item;
      itemData.boolData = false;
    }
  }

  save() {
    let result = this.userInfo.filter((item: any) => {
      if (item.boolData) return item;
    })
    this.viewCtrl.dismiss(result);
  }

  getItems(data: any) {
    this.userInfo = this.navParams.data;
    if (data) {
      this.userInfo = this.userInfo.filter((item: any) => {
        if (item.userName.indexOf(data) != -1 || item.manageUnitName.indexOf(data) != -1) return item;
      })
    }
    else {
      this.userInfo = this.navParams.data;
    }
  }
}
