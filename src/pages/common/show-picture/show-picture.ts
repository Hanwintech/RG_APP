import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-show-picture',
  templateUrl: 'show-picture.html',
})
export class ShowPicturePage {
  private picUrls: string[];
  private currentIndex: number = 0;

  constructor(private navParams: NavParams) {
    this.picUrls = this.navParams.data.picUrls
    this.currentIndex = this.navParams.data.currentIndex
  }
}
