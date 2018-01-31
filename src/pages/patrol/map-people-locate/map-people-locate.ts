import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { EnumCulturalRelicLevel } from './../../../models/enum';
import { PageService } from './../../../services/page.service';
import { MapPage } from './../../../base-pages/map-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
@IonicPage()
@Component({
  selector: 'page-map-people-locate',
  templateUrl: 'map-people-locate.html',
})
export class MapPeopleLocatePage extends MapPage {
  @ViewChild('map') mapElement: ElementRef;
  culturalRelicName: string;
  location: string;
  patrolInfo: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public platform: Platform,
    public pageService: PageService,
    public http: Http,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer) {
    super(navCtrl, navParams, platform, pageService,
      modalCtrl, apiService, file, fileTransfer);
    this.patrolInfo = this.navParams.data.patrolInfo.patrolInfo;
  }

  ionViewDidEnter() {
    this.culturalRelicName = this.patrolInfo.culturalRelicName;
    this.location = this.patrolInfo.location;
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    this.peopleLocate();
    //巡查人员的定位信息
    if (this.patrolInfo.coordinateX) {
      let pointData = new BMap.Point(this.patrolInfo.coordinateX, this.patrolInfo.coordinateY);
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
      if (this.patrolInfo.culturalRelicX) {
        this.locateCultural();
      }
      else {
        //显示人员的定位信息
        let longT = localStorage.getItem("longitude");
        let lati =localStorage.getItem("latitude");
        super.getLocation(longT, lati);
        this.map.centerAndZoom(new BMap.Point(longT, lati), 16);
      }
    }
  }

  //定位到文物
  locateCultural() {
    if (this.patrolInfo.culturalRelicX) {
      let picName = this.setMarkerByCRlevel(this.patrolInfo.culturalRelicLevel);
      let culturalPointData = new BMap.Point(this.patrolInfo.culturalRelicX, this.patrolInfo.culturalRelicY);
      let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
      let mkr = new BMap.Marker(culturalPointData, { icon: myLocation });
      this.map.addOverlay(mkr);
      this.map.centerAndZoom(culturalPointData, 16);
      let twoLineInfoList = this.navParams.data.culturalRelicInfo.twoLineInfoList;
      if (twoLineInfoList) {
        for (let info of twoLineInfoList) {
          let color = "#" + info.twoLinePolygon.color;
          if (info.twoLinePolygon.polygonType == 2) {
            color = "#507daf";
          }
          let line = [];
          for (let twoLinePoint of info.twoLinePointList) {
            line.push(new BMap.Point(twoLinePoint.x, twoLinePoint.y));
          }
          this.drawTwoLine(line, color);
        }
      }
    }
    else {
      let toast = this.toastCtrl.create({
        message: '文物位置信息未标注！',
        duration: 2000,
        position: 'bottom',
      });
      toast.present();
    }

  }

  drawTwoLine(linePoint, color) {
    let Polygon = new BMap.Polygon(linePoint, { strokeColor: color, fillColor: "", fillOpacity: 0.3, strokeWeight: 2, strokeOpacity: 1 });   //创建折线
    this.map.addOverlay(Polygon);
  }

  //根据culturalRelicLevel判断marker
  setMarkerByCRlevel(culturalRelicLevel) {
    let picsName = "";
    switch (culturalRelicLevel) {
      case EnumCulturalRelicLevel["全国重点文物保护单位"]:
        picsName = "ic_cultural_relic_level1_normal";
        break;
      case EnumCulturalRelicLevel["省级文物保护单位"]:
        picsName = "ic_cultural_relic_level2_normal";
        break;
      case EnumCulturalRelicLevel["市级文物保护单位"]:
        picsName = "ic_cultural_relic_level3_normal";
        break;
      case EnumCulturalRelicLevel["县区级文物保护单位"]:
        picsName = "ic_cultural_relic_level4_normal";
        break;
      case EnumCulturalRelicLevel["其他不可移动文物"]:
        picsName = "ic_cultural_relic_level5_normal";
        break;
      case EnumCulturalRelicLevel["博物馆"]:
        picsName = "ic_cultural_relic_level6_normal";
        break;
      case EnumCulturalRelicLevel["文物市场"]:
        picsName = "ic_cultural_relic_level7_normal";
        break;
      case EnumCulturalRelicLevel["工地"]:
        picsName = "ic_cultural_relic_level8_normal";
        break;
      default:
        picsName = "ic_cultural_relic_level1_normal";
    }
    return picsName;
  }

  //人员定位
  peopleLocate() {
    let pointData = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
    let myLocation = new BMap.Icon("assets/map/ic_map_marker_self.png", new BMap.Size(34, 35));
    let personLocate = new BMap.Marker(pointData, { icon: myLocation, enableMassClear: false });
    this.map.addOverlay(personLocate);
  }

  //获取当前所在位置
  selfLocation() {
    let movePoint = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
    this.map.setCenter(movePoint);
  }
}
