import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ApiService } from './../../services/api.service';
import { EnumAppRole } from './../../models/enum';
import { PageService } from './../../services/page.service';
import { MapPage } from './../../base-pages/map-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-cultural-relic-map',
  templateUrl: 'cultural-relic-map.html',
})
export class CulturalRelicMapPage extends MapPage {

  @ViewChild('map') mapElement: ElementRef;
  private CardContrl: boolean;//左上角两线图信息栏的控制
  private canAdd: boolean;
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

  ionViewDidLoad() {
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
    if(longT&&lati&&(longT!=lati)){
      super.getLocation(longT, lati);
      let pointData = new BMap.Point(longT, lati);
      this.map.centerAndZoom(pointData, this.showTwoLineMapLevel-2);
      this.mapLevel = this.map.getZoom() + 1;
      this.getData(this.mapLevel);
      this.mapAddEventListener();
    }
    else{
      this.pageService.showErrorMessage("获取数据失败，请重新打开该页面！");
    }
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
    let searchModal = this.modalCtrl.create("MapSearchPage", { "search": this.search, "dataSource": this.searchDataSource });
    searchModal.onDidDismiss(data => {
      if (data&&data.needSearch) {
        that.getSearchData(data.search);
        setTimeout(() => {
          // if(this.mapDistrictClusterInfoList.length==0){
          //   this.pageService.showMessage("当前可视范围内没有满足条件的文物!");
          // }
        }, 500);
      }
    });
    searchModal.present();
  }
}
