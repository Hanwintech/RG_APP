import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { EnumCulturalRelicLevel } from './../../../models/enum';
import { ActionSheet } from 'ionic-angular/components/action-sheet/action-sheet';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-map-cultural-relic-locate',
  templateUrl: 'map-cultural-relic-locate.html',
})
export class MapCulturalRelicLocatePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker:any;
  culturalRelicMapInfo: any;
  coordinateAccurateList: any;
  coordinateAccurate: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidEnter() {
    this.culturalRelicMapInfo=this.navParams.data.culturalRelicMapInfo;
    this.coordinateAccurateList = this.navParams.data.coordinateAccurateList;
    this.coordinateAccurate = this.navParams.data.culturalRelicMapInfo.coordinateAccurate;
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    let picName = this.setMarkerByCRlevel(this.navParams.data.culturalRelicMapInfo.culturalRelicLevel);
    let pointData = new BMap.Point(this.navParams.data.culturalRelicMapInfo.culturalRelicX, this.navParams.data.culturalRelicMapInfo.culturalRelicY);
    let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
    this.marker = new BMap.Marker(pointData, { icon: myLocation });
    this.marker.enableDragging();
    this.marker.addEventListener("dragend", function (e) {
      this.culturalRelicMapInfo.culturalRelicX=e.point.lng;
      this.culturalRelicMapInfo.culturalRelicY=e.point.v;
    });
    this.map.addOverlay(this.marker);
    this.map.centerAndZoom(pointData, 16);
    this.map.addEventListener("click",function(e){
      this.culturalRelicMapInfo.culturalRelicX=e.point.lng;
      this.culturalRelicMapInfo.culturalRelicY=e.point.lat;
      this.map.removeOverlay(this.marker);
      let picName = this.setMarkerByCRlevel(this.navParams.data.culturalRelicMapInfo.culturalRelicLevel);
      let pointData = new BMap.Point(this.culturalRelicMapInfo.culturalRelicX,this.culturalRelicMapInfo.culturalRelicY);
      let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
      this.marker = new BMap.Marker(pointData, { icon: myLocation });
      this.map.addOverlay(this.marker);
    }.bind(this));
  }

  operation() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '操作',
      buttons: [
        {
          text: '查看相关图片', handler: () => {
            // if (this.defaultModify) { this.defaultModify(dataItem); } 
          }
        },
        {
          text: '查看相关案件', handler: () => {
          }
        },
        { text: '查看相关巡查', handler: () => { } },
        { text: '标注文物点', handler: () => { } }
      ]
    });
    actionSheet.present();
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

  back() {
    this.viewCtrl.dismiss();
  }
  close(){
    this.viewCtrl.dismiss(this.culturalRelicMapInfo);
  }
}
