import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { EnumAppRole } from './../../../models/enum';
import { PageService } from './../../../services/page.service';
import { MapPage } from './../../../base-pages/map-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
declare var BMAP_ANCHOR_BOTTOM_LEFT;
@IonicPage()
@Component({
  selector: 'page-patrol-map',
  templateUrl: 'patrol-map.html',
})
export class PatrolMapPage extends MapPage {
  @ViewChild('map') mapElement: ElementRef;
  private CardContrl: boolean;//左上角两线图信息栏的控制
  private canAdd: boolean;
  private isSuccess = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public pageService: PageService,
    public http: Http,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer) {
    super(navCtrl, navParams, platform, pageService,
      modalCtrl, apiService, file, fileTransfer);
    this.hideContrl = true;
    this.hideDetailContrl = false;
    this.CardContrl = false;
    this.zoomendControle = true;
    this.canAdd = super.hasRole(EnumAppRole.Law) || super.hasRole(EnumAppRole.Volunteer);
  }

  list() {
    this.navCtrl.push('PatrolInfoListPage');
  }

  ionViewDidEnter() {
    if (localStorage.getItem("longitude") && localStorage.getItem("latitude") && !this.isSuccess) {
      this.getLocation(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
      let pointData = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
      this.map.centerAndZoom(pointData, this.showTwoLineMapLevel);
      this.isSuccess = true;
    }
    else if (!localStorage.getItem("longitude") && !localStorage.getItem("latitude") && !this.isSuccess) {
      this.pageService.showMessage("页面正在初始化");
      return;
    }
  }

  ionViewDidLoad() {
    if (!localStorage.getItem("longitude") && !localStorage.getItem("latitude")) {
      this.pageService.showMessage("正在初始化页面！");
    }
    setInterval(() => {
      console.log(localStorage.getItem("longitude") + "----" + localStorage.getItem("latitude"));
      this.getLocation(localStorage.getItem("longitude"), localStorage.getItem("latitude"));

    }, 60000);
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
    let longT = localStorage.getItem("longitude");
    let lati = localStorage.getItem("latitude");
    super.getLocation(longT, lati);
    let pointData = new BMap.Point(longT, lati);
    this.map.centerAndZoom(pointData, this.showTwoLineMapLevel);

    this.mapLevel = this.map.getZoom() + 1;
    this.getData(this.mapLevel);
    this.mapAddEventListener();
    // let bottom_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT,offset: new BMap.Size(10, 13)});
    // this.map.addControl(bottom_left_control);//添加比例尺
  }
  //底部查看详情面板
  controlBottom() {
    this.hideContrl = this.hideContrl ? false : true;
    this.upArrowContrl = this.hideContrl;
    if (!this.hideDetailContrl) {
      this.hideDetailContrl = false
    }
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
    let searchModal = this.modalCtrl.create("MapSearchPage", { "search": this.search, "dataSource": this.searchDataSource });
    searchModal.onDidDismiss(data => {
      if (data && data.needSearch) {
        that.getSearchData(data.search);
      }
    });
    searchModal.present();
  }

  addPatrol() {
    let patrolModal = this.modalCtrl.create('PatrolInfoEditPage', this.map);
    patrolModal.onDidDismiss(data => {
    });
    patrolModal.present();
  }
}
