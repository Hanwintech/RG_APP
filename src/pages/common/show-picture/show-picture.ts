import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';

declare var Swiper;

@IonicPage()
@Component({
  selector: 'page-show-picture',
  templateUrl: 'show-picture.html',
})
export class ShowPicturePage {
  @ViewChild('panel') panel: ElementRef;
  private tempPicUrls: string[] = [];
  private picUrls: string[] = [];
  private currentIndex: number = 0;
  constructor(
    public navParams: NavParams,
    public file: File
  ) {
    this.tempPicUrls = this.navParams.data.picUrls;
    this.currentIndex = this.navParams.data.currentIndex;
    for (let i = 0; i < this.tempPicUrls.length; i++) {
      if (this.tempPicUrls[i].substr(0, 4) == "file") {
        let dir = this.tempPicUrls[i].substring(0, this.tempPicUrls[i].lastIndexOf("/") + 1);
        let fileName = this.tempPicUrls[i].substring(this.tempPicUrls[i].lastIndexOf("/") + 1);
        this.file.readAsDataURL(dir, fileName).then(dataUrl => {
          this.tempPicUrls[i] = dataUrl;
          this.checkFinish();
        });
        this.tempPicUrls[i] = "";
      }
      else{
        this.checkFinish();
      }
    }
  }

  ionViewDidLoad() {
    //http://www.swiper.com.cn/api/index.html
    new Swiper(this.panel.nativeElement, {
      initialSlide: this.currentIndex,//初始化显示第几个
      zoom: true,//双击,手势缩放
      loop: true,//循环切换
      lazyLoading: true,//延迟加载
      lazyLoadingOnTransitionStart: true,//    lazyLoadingInPrevNext : true,
      pagination: '.swiper-pagination',//分页器
      paginationType: 'fraction'//分页器类型
    })
  }

  checkFinish() {
    for (let url of this.tempPicUrls) {
      if (!url) {
        return;
      }
    }
    this.picUrls = this.tempPicUrls;
  }
}
