import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../../../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { UserEntity } from './../../../models/user-info.model';
import { UTMapDistrictClusterInfo } from './../../../models/two-line/two-line-info.model';
import { EnumAreaCode, EnumDistrictType, EnumCulturalRelicLevel } from './../../../models/enum';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';
import { PageService } from './../../../services/page.service';
import { DetailPage } from './../../../base-pages/detail-page';
import { MapPage } from './../../../base-pages/map-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-map-people-locate',
  templateUrl: 'map-people-locate.html',
})
export class MapPeopleLocatePage extends MapPage {
  @ViewChild('map') mapElement: ElementRef;
  culturalRelicName:string;
  location:string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
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
  }

  ionViewDidEnter() {
    console.log(this.navParams.data);
    this.culturalRelicName=this.navParams.data.culturalRelic.culturalRelicName;
    this.location=this.navParams.data.culturalRelic.location;
    this.initSearchData();
    this.search.isDefaultSearch = false;
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    //巡查人员的定位信息
    if (this.navParams.data.coordinateX) {
      let pointData = new BMap.Point(this.navParams.data.culturalRelic.coordinateX, this.navParams.data.culturalRelic.coordinateY);
      let myLocation = new BMap.Icon("assets/map/ic_map_marker_people.png", new BMap.Size(34, 45));
      let mkr = new BMap.Marker(pointData, { icon: myLocation });
      this.map.addOverlay(mkr);
      this.map.centerAndZoom(pointData, 16);
    }
    else {
      let toast = this.toastCtrl.create({
        message: '没有巡查人员位置信息！',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
      if (this.navParams.data.culturalRelic.culturalRelicX) {
        this.locateCultural();
      }
      else {
        //显示人员的定位信息
        let longT = '120.788713';
        let lati = '31.345924';
        super.getLocation(longT, lati);
        this.map.centerAndZoom(new BMap.Point(longT, lati), 16);
      }
    }
  }

  //定位到文物
  locateCultural() {
    //this.search.culturalRelicName = this.navParams.data.culturalRelic.culturalRelicName;
    let culturalPointData = new BMap.Point(this.navParams.data.culturalRelic.culturalRelicX, this.navParams.data.culturalRelic.culturalRelicY);
    this.mapLevel=this.showTwoLineMapLevel;
    this.getData(this.mapLevel);
    this.map.centerAndZoom(culturalPointData, 16);
  }
}
