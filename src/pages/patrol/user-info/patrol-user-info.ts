import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonUserInfo } from "./../../../models/user-info.model";

@IonicPage()
@Component({
  selector: 'page-patrol-user-info',
  templateUrl: 'patrol-user-info.html',
})
export class PatrolUserInfoPage {
  private userInfo:string[];
  searchQuery: string = '';
  items;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.userInfo=this.navParams.data;
  console.log(this.userInfo);
  }

  selectAll(){

  }

  emptyData(){

  }

  save(){
    
  }

  // initializeItems() {
  //   this.items = this.userInfo.userName;
  // }


  getItems(ev: any) {
    console.log( this.userInfo)
    // Reset items back to all of the items

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    // if (val && val.trim() != '') {
    //   this.userInfo= this.userInfo.filter((item:CommonUserInfo) => {
    //     return (item.userN.indexOf(val) >0);
    //   })
    // }
  }
}
