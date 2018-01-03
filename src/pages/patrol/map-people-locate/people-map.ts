import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController,ToastController  } from 'ionic-angular';
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
  selector: 'page-people-map',
  templateUrl: 'people-map.html',
})
export class PeopleMapPage extends MapPage {
  @ViewChild('map') mapElement: ElementRef;
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
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    if(!this.navParams.data.coordinateX){
      let toast = this.toastCtrl.create({
        message: '没有巡查人员位置信息！',
        duration: 30000,
        position: 'bottom',
      });
      toast.present();
    }
    else{
      let pointData = new BMap.Point(this.navParams.data.coordinateX,this.navParams.data.coordinateY);
      let myLocation = new BMap.Icon("assets/map/ic_map_marker_people.png", new BMap.Size(34, 45));
      let mkr = new BMap.Marker(pointData, { icon: myLocation });
      this.map.addOverlay(mkr);

    }
    let pointData = new BMap.Point(this.navParams.data.coordinateX,this.navParams.data.coordinateY);
    this.map.centerAndZoom(pointData, 16);
  }
  
  locateCutural(){

  }
}
