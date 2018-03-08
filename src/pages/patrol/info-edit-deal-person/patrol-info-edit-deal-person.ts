import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-patrol-info-edit-deal-person',
  templateUrl: 'patrol-info-edit-deal-person.html',
})
export class PatrolInfoEditDealPersonPage {
  private keyword;
  private canSelectUserInfoList;
  private selectUserIds;

  constructor(private params: NavParams, private viewCtrl: ViewController) {
    this.canSelectUserInfoList = this.params.data.canSelectUserInfoList;
    this.selectUserIds = [];

    for (let i = 0; i < this.params.data.selectedUserInfoList.length; i++) {
      for (let j = 0; j < this.canSelectUserInfoList.length; j++) {
        if (this.params.data.selectedUserInfoList[i].userId == this.canSelectUserInfoList[j].userId) {
          this.selectUserIds[j] = true;
          break;
        }
      }
    }
  }

  doSelectAll() {
    for (let i = 0; i < this.canSelectUserInfoList.length; i++) {
      this.selectUserIds[i] = true;
    }
  }

  doEmptied() {
    for (let i = 0; i < this.canSelectUserInfoList.length; i++) {
      this.selectUserIds[i] = false;
    }
  }

  doSearch() {
    let selectUsers = []
    for (let i = 0; i < this.selectUserIds.length; i++) {
      if (this.selectUserIds[i] === true) {
        selectUsers.push(this.canSelectUserInfoList[i]);
      }
    }
    this.viewCtrl.dismiss(selectUsers);
  }
}
