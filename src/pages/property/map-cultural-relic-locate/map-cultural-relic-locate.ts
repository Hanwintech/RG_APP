import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ActionSheetController } from 'ionic-angular';
import { EnumCulturalRelicLevel } from './../../../models/enum';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { ApiService } from './../../../services/api.service';
import { Attachment } from "./../../../models/attachment.model";
import { BasePage } from '../../../base-pages/base-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { PageService } from './../../../services/page.service';

declare var BMap;
@IonicPage()
@Component({
  selector: 'page-map-cultural-relic-locate',
  templateUrl: 'map-cultural-relic-locate.html',
})
export class MapCulturalRelicLocatePage extends BasePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  culturalRelicMapInfo: any;
  coordinateAccurateList: any;
  canShowFooter: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public apiService: ApiService,
    public pageService: PageService,
    public file: File,
    public fileTransfer: FileTransfer,
    public actionSheetCtrl: ActionSheetController) {
    super(navCtrl, file, fileTransfer, pageService);
  }

  ionViewDidLoad() {
    this.initialEvent();
    this.map.addOverlay(this.marker);
    this.map.centerAndZoom(new BMap.Point(this.culturalRelicMapInfo.culturalRelicX, this.culturalRelicMapInfo.culturalRelicY), 15);
    if(this.culturalRelicMapInfo.twolineInfo){
      for (let info of this.culturalRelicMapInfo.twolineInfo) {
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

  //初始化数据及动作
  initialEvent() {
    this.culturalRelicMapInfo = this.navParams.data.culturalRelicMapInfo;
    this.coordinateAccurateList = this.navParams.data.coordinateAccurateList;
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    this.addMarker();
  }

  moveMarker() {
    this.marker.enableDragging();
    this.marker.addEventListener("dragend", function (e) {
      this.culturalRelicMapInfo.culturalRelicX = e.point.lng;
      this.culturalRelicMapInfo.culturalRelicY = e.point.v;
    }.bind(this));

    this.enableClick();
    this.map.addEventListener("click", function (e) {
      this.culturalRelicMapInfo.culturalRelicX = e.point.lng;
      this.culturalRelicMapInfo.culturalRelicY = e.point.lat;
      this.addMarker();
      this.marker.enableDragging();
      this.map.addOverlay(this.marker);
    }.bind(this));
  }

  disableMarker() {
    this.marker.disableDragging();
    this.map.removeEventListener("click");
  }

  viewDetail() {
    this.navCtrl.push('CulturalRelicInfoDetailPage', this.culturalRelicMapInfo.culturalRelicId);
  }

  viewPatrol() {
    this.navCtrl.push('PatrolInfoListPage', { "culturalRelicID": this.culturalRelicMapInfo.culturalRelicId });
  }

  viewPic() {
    this.apiService.sendApi(new GetCulturalRelicInfo(this.culturalRelicMapInfo.culturalRelicId)).subscribe(
      res => {
        if (res.success) {
          let culturalRelicImageInfo = res.data;
          super.changeAttachmentFileType(culturalRelicImageInfo.twoLimitImageList)
          this.showPicture("", culturalRelicImageInfo.twoLimitImageList);
          if (!culturalRelicImageInfo.twoLimitImageList.length) {
            this.pageService.showErrorMessage("无相关图片！");
          }
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });
  }

  //查看图片
  showPicture(fileUrl: string, attachmentList: Attachment[]) {
    super.showSlidesPage(attachmentList, fileUrl);
  }

  addMarker() {
    if (this.marker) {
      this.map.removeOverlay(this.marker);
    }
    let picName = this.setMarkerByCRlevel(this.navParams.data.culturalRelicMapInfo.culturalRelicLevel);
    let pointData = new BMap.Point(this.culturalRelicMapInfo.culturalRelicX, this.culturalRelicMapInfo.culturalRelicY);
    let myLocation = new BMap.Icon("assets/map/" + picName + ".png", new BMap.Size(34, 45));
    this.marker = new BMap.Marker(pointData, { icon: myLocation });
    this.marker.addEventListener("dragend", function (e) {
      this.culturalRelicMapInfo.culturalRelicX = e.point.lng;
      this.culturalRelicMapInfo.culturalRelicY = e.point.v;
    }.bind(this));
  }

  operation() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '操作',
      buttons: [
        { text: '查看相关图片', handler: () => { this.viewPic() } },
        { text: '查看相关案件', handler: () => { this.viewPatrol() } },
        { text: '查看相关巡查', handler: () => { this.viewPatrol() } },
        { text: '标注文物点', handler: () => { this.canShowFooter = true; this.moveMarker(); } }
      ]
    });
    actionSheet.present();
  }

  //获取当前所在位置
  selfLocation() {
    let movePoint = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
    this.map.setCenter(movePoint);
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


  drawTwoLine(linePoint, color) {
    let Polygon = new BMap.Polygon(linePoint, { strokeColor: color, fillColor: "", fillOpacity: 0.3, strokeWeight: 2, strokeOpacity: 1 });   //创建折线
    this.map.addOverlay(Polygon);
}

  back() {
    this.viewCtrl.dismiss();
  }

  close() {
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
}
