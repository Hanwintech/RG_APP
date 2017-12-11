import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http, Headers, RequestMethod, Request } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../../../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch } from './../../../models/property/cultural-relic-info.model';
import { UserInfo, UserEntity } from './../../../models/user-info.model';
import { TwoLineInfo } from './../../../models/two-line/two-line-info.model';
import { UTMapDistrictClusterInfo } from './../../../models/two-line/two-line-info.model';
import { Console } from '@angular/core/src/console';

declare var BMap;
declare var BMapLib;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
declare var Cluster;
@IonicPage()
@Component({
  selector: 'page-two-line',
  templateUrl: 'two-line.html',
})
export class TwoLinePage {
  @ViewChild('map') mapElement: ElementRef;
  private pageTitle: string;
  private currentMapLevelMin: number;
  private currentMapLevelMax: number;
  private mapLevel: number;
  private map: any;
  private longitude: any;
  private latitude: any;
  private selectedId: any;
  private userInfo: UserEntity;
  private search: CulturalRelicInfoSearch;
  private twoLine = [];
  private mapDistrictClusterInfoList: UTMapDistrictClusterInfo[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public http: Http,
    public apiService: ApiService,
    public geolocation: Geolocation) {
    this.pageTitle = (this.navParams.data && this.navParams.data.title) ? this.navParams.data.title : "国保两线监控";
  }

  ionViewDidEnter() {
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    var pointData = new BMap.Point(120.78877004348, 31.346248778536);
    this.map.centerAndZoom(pointData, 17);
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]
    }));
    let longT = '120.78877004348';
    let lati = '31.346248778536';
    //  setInterval(()=>{
    //   //this.getLocation();
    // longT=longT+0.000001;
    // lati=lati+0.0000001; 
    // this.getLocation(longT,lati);
    // },1000000);
    this.getLocation(longT, lati);
    this.mapLevel = this.map.getZoom();
    this.getData(this.mapLevel);
    this.mapAddEventListener();
  }
  getLocation(longitude, latitude) {
    var pointData = new BMap.Point(longitude, latitude);
    var myLocation = new BMap.Icon("assets/map/ic_map_marker_self_df.png", new BMap.Size(34, 35));
    let mkr = new BMap.Marker(pointData, { icon: myLocation });
    // this.map.clearOverlays();
    this.map.addOverlay(mkr);
    this.map.panTo(pointData);
  }

  drawTwoLine(linePoint, color) {
    var Polygon = new BMap.Polygon(linePoint, { strokeColor: color, fillColor: "", fillOpacity: 0, strokeWeight: 2, strokeOpacity: 1 });   //创建折线
    this.map.addOverlay(Polygon);
  }
  getData(mapLevel) {
    let that = this;
    this.search = new CulturalRelicInfoSearch();
    this.userInfo = new UserEntity(localStorage.getItem('account'), localStorage.getItem('name'));
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));
    this.search.isDefaultSearch = true;

    this.search.mapLevel = mapLevel;
    this.search.isAll = true;
    this.search.isNeedPaging = false;
    this.search.isNeedSearchDataSource = true;
    this.search.searchType = 1;
    this.search.culturalRelicSearchType = 1;

    this.search.leftTopCoordinateX = this.map.getBounds().Le;
    this.search.leftTopCoordinateY = this.map.getBounds().Fe;
    this.search.rightBottomCoordinateX = this.map.getBounds().Ge;
    this.search.rightBottomCoordinateY = this.map.getBounds().Ke;
    this.apiService.sendApi(new GetCulturalRelicMapInfosUrl(this.search)).subscribe(
      res => {
        if (res.success) {
          console.log(res);
          this.twoLine = res.data.twoLineInfoList;
          this.mapDistrictClusterInfoList = res.data.mapDistrictClusterInfoList;
          if (this.mapLevel > 15) {
            for (let info of this.twoLine) {
              let color = "#" + info.twoLinePolygon.color;
              let line = [];
              for (let twoLinePoint of info.twoLinePointList) {
                line.push(new BMap.Point(twoLinePoint.x, twoLinePoint.y));
              }
              this.drawTwoLine(line, color);
            }
          }
          this.bindMarker();
        }
      }, error => {
      }
    );
  }

  private mapAddEventListener() {
    this.map.addEventListener("zoomend", function () {
      this.mapLevel = this.map.getZoom();
      this.getData(this.mapLevel);

    }.bind(this))
    this.map.addEventListener("dragend", function () {

    }.bind(this));

  }

  private addRectangleLabel(x, y, name) {
    let myIcon = new BMap.Icon("assets/map/ic_cultural_relic_level1_normal.png", new BMap.Size(34, 35));
    let myIconSelected = new BMap.Icon("assets/map/ic_cultural_relic_level1_selected.png", new BMap.Size(34, 35));
    let maker = new BMap.Marker(new BMap.Point(x, y), {
      icon: myIcon,
      enableMassClear: false,
      enableClicking: true
    })
    let lblString = "<div ' class='positionContain'><div  style='border-bottom:1px solid #fff;padding:0.2em 0.4em;'>" + name + "</div><div style='padding:0.2em 0.4em;'>案件</div></div>";
    var label = new BMap.Label(lblString, { offset: new BMap.Size(38, -40) });
    label.setStyle({
      border: "none",
      fontSize: "1em",
      color: "#fff",
      borderRadius: "0.3em",
      background: "none"
    });
    maker.setLabel(label);
    console.log(maker);
    this.map.addOverlay(maker);
  }

  private addCircleLabel(x, y, name) {
    var label;
    var point = new BMap.Point(x, y);
    var option = {
      position: point,
    }
    label = new BMap.Label("<div style='margin:7px auto;'><p style='white-space:normal'>"
      + name + "</p><p></p></div>", option);
    label.setStyle({
      color: "white",
      background: "red",
      fontSize: "14px",
      height: "64px",
      width: "64px",
      borderRadius: '50%',
      opacity: 0.9,
      fontFamily: "微软雅黑",
      textAlign: 'center'
    });
    label.addEventListener("click", function () {
      this.map.clearOverlays();

    }.bind(this));
    this.map.addOverlay(label);
  }


  private bindMarker() {
    //如果已经不再原来的缩放范围内，则清除点
    if (this.mapLevel <= this.currentMapLevelMin || this.mapLevel > this.currentMapLevelMax) {
      this.clearMarker();
    }
    this.run();

  }

  //拿到infoList数据，遍历添加label
  private run() {
    if (this.mapDistrictClusterInfoList != null && this.mapDistrictClusterInfoList.length > 0) {
      for (let cluster of this.mapDistrictClusterInfoList) {
        this.currentMapLevelMin = cluster.mapLevelMin;
        this.currentMapLevelMax = cluster.mapLevelMax;
        //如果在当前缩放范围内，已经存在该点，则不添加
        switch (cluster.districtType) {
          case 1:
          case 2:
          case 3:
            this.addCircleLabel(cluster.coordinateX, cluster.coordinateY, cluster.showName);
            break;
          case 100:
            this.addRectangleLabel(cluster.coordinateX, cluster.coordinateY, cluster.showName);
        }

      }
    }
  }

  private clearMarker() {
    this.map.clearOverlays();
  }
}

