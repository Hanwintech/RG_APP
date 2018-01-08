import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../../../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { UserEntity } from './../../../models/user-info.model';
import { UTMapDistrictClusterInfo } from './../../../models/two-line/two-line-info.model';
import { EnumAreaCode, EnumDistrictType, EnumCulturalRelicLevel,EnumAppRole ,EnumSearchType} from './../../../models/enum';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
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
  selector: 'page-patrol-map',
  templateUrl: 'patrol-map.html',
})
export class PatrolMapPage extends MapPage {
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
    public fileTransfer: FileTransfer,
    public geolocation: Geolocation) {
    super(navCtrl, navParams, platform, pageService,
      modalCtrl, apiService, file, fileTransfer, geolocation);
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
    //  setInterval(()=>{
    //   //this.getLocation();
    // longT=longT+0.000001;
    // lati=lati+0.0000001; 
    // this.getLocation(longT,lati);
    // },1000000);
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
    // Projection projection=  this.map.getProjection();
    let longT = '120.788713';
    let lati = '31.345924';
    super.getLocation(longT, lati);
    let pointData = new BMap.Point(longT, lati);
    this.map.centerAndZoom(pointData, 16);
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
    let longT = '120.788713';
    let lati = '31.345924';
    let movePoint = new BMap.Point(longT, lati);
    this.map.setCenter(movePoint);
  }

  showSearch() {
    let that = this;
    this.search.isDefaultSearch = false;
    let searchModal = this.modalCtrl.create("MapSearchPage", { "search": this.search, "dataSource": this.searchDataSource });
    searchModal.onDidDismiss(data => {
      if (data.needSearch) {
        that.getSearchData(data.search);
      }
    });
    searchModal.present();
  }
  addPatrol(){
    let patrolModal = this.modalCtrl.create('PatrolInfoEditPage');
    patrolModal.onDidDismiss(data => {
    });
    patrolModal.present();
  }
}
