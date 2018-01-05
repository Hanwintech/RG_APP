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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    //let picName = this.setMarkerByCRlevel(this.navParams.data.upCulturalRelic.culturalRelicLevel);
    // let pointData = new BMap.Point(this.navParams.data.upCulturalRelic.coordinateX, this.navParams.data.upCulturalRelic.coordinateY);
    // let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
    // let mkr = new BMap.Marker(pointData, { icon: myLocation });
    // this.map.addOverlay(mkr);
    // this.map.centerAndZoom(pointData, 16);
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

  back(){
    this.navCtrl.pop();
  }
}
