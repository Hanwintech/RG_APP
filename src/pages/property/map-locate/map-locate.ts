import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { EnumCulturalRelicLevel } from './../../../models/enum';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-map-locate',
  templateUrl: 'map-locate.html',
})
export class MapLocatePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    let picName = this.setMarkerByCRlevel(this.navParams.data.upCulturalRelic.culturalRelicLevel);
    let pointData = new BMap.Point(this.navParams.data.upCulturalRelic.coordinateX, this.navParams.data.upCulturalRelic.coordinateY);
    let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
    let mkr = new BMap.Marker(pointData, { icon: myLocation });
    this.map.addOverlay(mkr);
    this.map.centerAndZoom(pointData, 16);
  }

  close() {
    //this.viewCtrl.dismiss({ "needSearch": false });
  }

  back(){
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
}
