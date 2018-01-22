import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ActionSheetController } from 'ionic-angular';
import { EnumCulturalRelicLevel, EnumCoordinateObjectType } from './../../../models/enum';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { PostCoordinateInfosUrl } from './../../../apis/two-line/two-line.api';
import { ApiService } from './../../../services/api.service';
import { Attachment } from "./../../../models/attachment.model";
import { BasePage } from '../../../base-pages/base-page';
import { CoordinatePostInfo } from "./../../../models/two-line/two-line-info.model";
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { PageService } from './../../../services/page.service';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-map-cultural-relic-locate',
  templateUrl: 'map-cultural-relic-locate.html',
})
export class MapCulturalRelicLocatePage extends BasePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  culturalRelicMapInfo: CulturalRelicInfo;
  coordinateAccurateList: any;
  canShowFooter: boolean = false;
  private coordinatePostInfo: CoordinatePostInfo;
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
    this.personLocate();
    this.map.addOverlay(this.marker);
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]
    }));
    if (this.culturalRelicMapInfo.culturalRelicX) {
      this.map.centerAndZoom(new BMap.Point(this.culturalRelicMapInfo.culturalRelicX, this.culturalRelicMapInfo.culturalRelicY), 15);
    }
    else {
      let pointData = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
      this.map.centerAndZoom(pointData, 16);
    }
    if (this.culturalRelicMapInfo.twolineInfo) {
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
    this.personLocate();
    console.log(this.navParams.data);
  }

  //人员定位
  personLocate() {
    let pointData = new BMap.Point(localStorage.getItem("longitude"), localStorage.getItem("latitude"));
    let myLocation = new BMap.Icon("assets/map/ic_map_marker_self.png", new BMap.Size(34, 35));
    let personLocate = new BMap.Marker(pointData, { icon: myLocation, enableMassClear: false });
    this.map.addOverlay(personLocate);
  }

  moveMarker() {
    if (this.marker) {
      this.marker.enableDragging();
      this.marker.addEventListener("dragend", function (e) {
        this.culturalRelicMapInfo.culturalRelicX = e.point.lng;
        this.culturalRelicMapInfo.culturalRelicY = e.point.lat;
      }.bind(this));
    }
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
    this.navCtrl.push('CulturalRelicInfoDetailPage', this.culturalRelicMapInfo.id);
  }

  viewPatrol() {
    this.navCtrl.push('PatrolInfoListPage', { "culturalRelicID": this.culturalRelicMapInfo.id });
  }

  viewPic() {
    this.apiService.sendApi(new GetCulturalRelicInfo(this.culturalRelicMapInfo.id)).subscribe(
      res => {
        if (res.success) {
          let culturalRelicImageInfo = res.data;
          if (culturalRelicImageInfo.twoLimitImageList) {
            super.changeAttachmentFileType(culturalRelicImageInfo.twoLimitImageList)
            this.showPicture("", culturalRelicImageInfo.twoLimitImageList);
          }
          else {
            this.pageService.showErrorMessage("没有相关图片！");
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
      this.culturalRelicMapInfo.culturalRelicY = e.point.lat;
    }.bind(this));
  }

  operation() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '操作',
      buttons: [
        { text: '查看相关图片', handler: () => { this.viewPic() } },
        { text: '查看相关巡查('+this.culturalRelicMapInfo.culturalRelic.patrolCount+')', handler: () => { this.viewPatrol() } },
        { text: '标注文物点', handler: () => { this.pageService.showMessage("您可以通过在地图上点击或者拖动图标进行文物点标注！"); this.canShowFooter = true; this.moveMarker(); } }
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
    this.viewCtrl.dismiss(this.culturalRelicMapInfo);
  }

  saveCoordinate() {
    this.coordinatePostInfo = new CoordinatePostInfo();
    if (this.culturalRelicMapInfo.culturalRelicLevel == EnumCulturalRelicLevel["博物馆"]) {
      this.coordinatePostInfo.coordinateType = EnumCoordinateObjectType["博物馆"];
    }
    else {
      this.coordinatePostInfo.coordinateType = EnumCoordinateObjectType["文物"];
    }
    this.coordinatePostInfo.businessId = this.culturalRelicMapInfo.id;
    this.coordinatePostInfo.coordinateAccurate = this.culturalRelicMapInfo.coordinateAccurate;
    this.coordinatePostInfo.coordinateX = this.culturalRelicMapInfo.culturalRelicX;
    this.coordinatePostInfo.coordinateY = this.culturalRelicMapInfo.culturalRelicY;
    this.coordinatePostInfo.userId = localStorage.getItem("userId");
    this.pageService.showComfirmMessage("确定要提交标注信息吗？",
      () => {
        this.apiService.sendApi(new PostCoordinateInfosUrl(this.coordinatePostInfo)).subscribe(
          res => {
            if (res.success) {
              this.pageService.showMessage("标注信息提交成功！");

            } else {
              this.pageService.showErrorMessage(res.reason);
            }
          },
          error => {
            this.pageService.showErrorMessage(error);
          });
        this.canShowFooter = false;
      },
      () => { });
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
