import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../../../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { UserEntity } from './../../../models/user-info.model';
import { UTMapDistrictClusterInfo } from './../../../models/two-line/two-line-info.model';
import { EnumAreaCode, EnumDistrictType } from './../../../models/enum';
import { PageService } from './../../../services/page.service';
import { Attachment } from "./../../../models/attachment.model";
import { DetailPage } from './../../../base-pages/detail-page';
import { MapPage } from './../../../base-pages/map-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-two-line',
  templateUrl: 'two-line.html',
})
export class TwoLinePage extends MapPage {
  @ViewChild('map') mapElement: ElementRef;
  private pageTitle: string;
  private CardContrl: boolean;//左上角两线图信息栏的控制
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public pageService: PageService,
    public http: Http,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer,
    public geolocation: Geolocation) {
    super(navCtrl, navParams, platform, pageService,
      modalCtrl, apiService, file, fileTransfer, geolocation);
    this.hideContrl = true;
    this.hideDetailContrl = false;
    this.CardContrl = false;
    this.zoomendControle = true;
    this.pageTitle = (this.navParams.data && this.navParams.data.title) ? this.navParams.data.title : "国保两线监控";
  }

  list() {
    this.navCtrl.push('PatrolInfoListPage');
  }

  ionViewDidEnter() {
    setInterval(()=>{
      this.getLocation(localStorage.getItem("longitude"),localStorage.getItem("latitude"));
    },60000);
    this.initSearchData();
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]
    }));
    let longT =localStorage.getItem("longitude");
    let lati = localStorage.getItem("latitude");
    super.getLocation(longT, lati);
    let pointData = new BMap.Point(longT, lati);
    this.map.centerAndZoom(pointData, this.showTwoLineMapLevel);
    this.mapLevel = this.map.getZoom() + 1;
    this.getData(this.mapLevel);
    this.mapAddEventListener();
  }
  //底部查看详情面板
  controlBottom() {
    this.hideContrl = this.hideContrl ? false : true;
    this.hideDetailContrl = false;
    this.upArrowContrl = this.hideContrl;
  }

  showBottomInfo() {
    this.hideContrl = false;
    this.upArrowContrl = false;
  }
  //获取当前所在位置
  selfLocation() {
    let movePoint = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
    this.map.setCenter(movePoint);
  }

  showSearch() {
    let that = this;
    this.search.isDefaultSearch = false;
    let searchModal = this.modalCtrl.create("TwoLineSearchPage", { "search": this.search, "dataSource": this.searchDataSource });
    searchModal.onDidDismiss(data => {
      if (data.needSearch) {
        that.getSearchData(data.search);
      }
    });
    searchModal.present();
  }
}