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
  private map: any;
  private longitude: any;
  private latitude: any;
  private selectedId: any;
  private userInfo: UserEntity;
  private search: CulturalRelicInfoSearch;
  private twoLine = [];
  private mapDistrictClusterInfo: UTMapDistrictClusterInfo[];
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
    this.map.centerAndZoom(pointData, 16);
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
    this.getData(this.map.getZoom());
    this.mapAddEventListener();
    //this.drawTwoLine();
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

    //this.search.culturalRelicName = "沙湖科技园";
    this.search.leftTopCoordinateX = this.map.getBounds().Le;
    this.search.leftTopCoordinateY = this.map.getBounds().Fe;
    this.search.rightBottomCoordinateX = this.map.getBounds().Ge;
    this.search.rightBottomCoordinateY = this.map.getBounds().Ke;
    this.apiService.sendApi(new GetCulturalRelicMapInfosUrl(this.search)).subscribe(
      res => {
        if (res.success) {
          console.log(res);
          this.twoLine = res.data.twoLineInfoList;
          this.mapDistrictClusterInfo = res.data.mapDistrictClusterInfoList;
          let mapZoom = this.map.getZoom();
          if (mapZoom > 15) {
            for (let info of this.twoLine) {
              let color = "#" + info.twoLinePolygon.color;
              let line = [];
              for (let twoLinePoint of info.twoLinePointList) {
                line.push(new BMap.Point(twoLinePoint.x, twoLinePoint.y));
              }
              this.drawTwoLine(line, color);
            }
          }

        }
      }, error => {
      }
    );
  }

  private mapAddEventListener() {
    this.map.addEventListener("zoomend", function () {
      this.map.clearOverlays();
      let mapZoom = this.map.getZoom();
      this.getData(mapZoom);
      if (this.mapDistrictClusterInfo.length>0) {
        for (let cluster of this.mapDistrictClusterInfo) {
          this.zoom(cluster.coordinateX, cluster.coordinateY, cluster.showName);
        }
      }

    }.bind(this))
    this.map.addEventListener("dragend",function(){

    }.bind(this));

  }
  private zoom(x, y, name) {
    var label;
    var point = new BMap.Point(x, y);
    var option = {
      position: point,
    }
    for (let i = 0; i < 10; i++) {
      label = new BMap.Label("<div style='margin:7px auto;'><p style='white-space:normal'>" + name + "</p><p></p></div>", option);

    }
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
    label.addEventListener("click",function(){
      this.map.clearOverlays();
    }.bind(this));
    this.map.addOverlay(label);
  }
}

