import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { EnumCulturalRelicLevel } from './../../../models/enum';

declare var BMap;
@IonicPage()
@Component({
  selector: 'page-map-locate',
  templateUrl: 'map-locate.html',
})
export class MapLocatePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  culturalRelicMapInfo = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    let picName = this.setMarkerByCRlevel(this.navParams.data.culturalLevel);
    this.personLocate();
    if (this.navParams.data.coordinate.coordinateX) {
      let pointData = new BMap.Point(this.navParams.data.coordinate.coordinateX, this.navParams.data.coordinate.coordinateY);
      let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
      this.marker = new BMap.Marker(pointData, { icon: myLocation });
      this.map.addOverlay(this.marker);
      this.map.centerAndZoom(pointData, 16);
    }
    else{
      let pointData = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
      this.map.centerAndZoom(pointData, 16);
    }
    this.moveMarker();

  }

  moveMarker() {
    if(this.marker){
      this.marker.enableDragging();
      this.marker.addEventListener("dragend", function (e) {
        this.culturalRelicMapInfo.culturalRelicX = e.point.lng;
        this.culturalRelicMapInfo.culturalRelicY = e.point.v;
      }.bind(this));
    }
    this.enableClick();
    this.map.addEventListener("click", function (e) {
      this.culturalRelicMapInfo.culturalRelicX = e.point.lng;
      this.culturalRelicMapInfo.culturalRelicY = e.point.lat;
      this.addMarker(this.culturalRelicMapInfo.culturalRelicX, this.culturalRelicMapInfo.culturalRelicY);
      this.marker.enableDragging();
      this.map.addOverlay(this.marker);
    }.bind(this));
  }

  save() {
    this.viewCtrl.dismiss(this.culturalRelicMapInfo);
  }
  //解决地图click事件在移动端失效的问题
  enableClick() {
    this.map.addEventListener("touchstart", function (e) {
      this.map.disableDragging();
    }.bind(this));
    this.map.addEventListener("touchmove", function (e) {
      this.map.enableDragging();
    }.bind(this));
    this.map.addEventListener("touchend", function (e) {
      this.map.disableDragging();
    }.bind(this));
  }

  back() {
    this.navCtrl.pop();
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

  addMarker(X, Y) {
    if (this.marker) {
      this.map.removeOverlay(this.marker);
    }
    let picName = this.setMarkerByCRlevel(this.navParams.data.culturalLevel);
    let pointData = new BMap.Point(X, Y);
    let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
    this.marker = new BMap.Marker(pointData, { icon: myLocation });
  }

  //人员定位
  personLocate() {
    let pointData = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
    let myLocation = new BMap.Icon("assets/map/ic_map_marker_self.png", new BMap.Size(34, 35));
    let personLocate = new BMap.Marker(pointData, { icon: myLocation, enableMassClear: false });
    this.map.addOverlay(personLocate);
  }

  //获取当前所在位置
  selfPersonLocation() {
    let movePoint = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
    this.map.setCenter(movePoint);
  }
}
