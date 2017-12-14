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
  private isNeedMoveToFirstIcon = false;
  private map: any;
  private showTwoLineMapLevel = 17;
  private longitude: any;
  private latitude: any;
  private selectedId: any;
  private userInfo: UserEntity;
  private search: CulturalRelicInfoSearch;
  private twoLine = [];
  private mapDistrictClusterInfoList: UTMapDistrictClusterInfo[];
  private shine;
  private shineArray = [];
  private uniqueTagList = [];
  private selectedMarkItem;
  private hideContrl:boolean;
  private caseCountTemp;
  private patrolCountTemp;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public http: Http,
    public apiService: ApiService,
    public geolocation: Geolocation) {
    this.pageTitle = (this.navParams.data && this.navParams.data.title) ? this.navParams.data.title : "国保两线监控";
    this.hideContrl=true;

  }

  ionViewDidEnter() {
    //  setInterval(()=>{
    //   //this.getLocation();
    // longT=longT+0.000001;
    // lati=lati+0.0000001; 
    // this.getLocation(longT,lati);
    // },1000000);
    this.map = new BMap.Map(this.mapElement.nativeElement);//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    var pointData = new BMap.Point(120.788713, 31.345924);
    this.map.centerAndZoom(pointData, 16);
    this.map.addControl(new BMap.MapTypeControl({
      mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
      ]
    }));
    let longT = '120.788713';
    let lati = '31.345924';
    this.getLocation(longT, lati);
    this.mapLevel = this.map.getZoom() + 1;
    this.getData(this.mapLevel);
    this.mapAddEventListener();
  }
  //底部查看详情面板
  controlBottom(){
  this.hideContrl=this.hideContrl?false:true;
  }

  private initSearchData() {
    this.search = new CulturalRelicInfoSearch();
    this.userInfo = new UserEntity(localStorage.getItem('account'), localStorage.getItem('name'));
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));
    this.search.isDefaultSearch = true;
    this.search.isAll = true;
    this.search.isNeedPaging = false;
    this.search.isNeedSearchDataSource = true;
    this.search.searchType = 1;
    this.search.culturalRelicSearchType = 1;
    this.search.leftTopCoordinateX = this.map.getBounds().Le;
    this.search.leftTopCoordinateY = this.map.getBounds().Fe;
    this.search.rightBottomCoordinateX = this.map.getBounds().Ge;
    this.search.rightBottomCoordinateY = this.map.getBounds().Ke;
  }
  private getLocation(longitude, latitude) {
    var pointData = new BMap.Point(longitude, latitude);
    var myLocation = new BMap.Icon("assets/map/ic_map_marker_self.png", new BMap.Size(34, 35));
    let mkr = new BMap.Marker(pointData, { icon: myLocation, enableMassClear: false, });
    this.map.addOverlay(mkr);
    this.map.panTo(pointData);
  }

  private drawTwoLine(linePoint, color) {
    var Polygon = new BMap.Polygon(linePoint, { strokeColor: color, fillColor: "", fillOpacity: 0, strokeWeight: 2, strokeOpacity: 1 });   //创建折线
    this.map.addOverlay(Polygon);
  }
  private getData(mapLevel) {
    let that = this;
    this.initSearchData();
    this.search.mapLevel = this.mapLevel;
    this.apiService.sendApi(new GetCulturalRelicMapInfosUrl(this.search)).subscribe(
      res => {
        if (res.success) {
          console.log(res);
          this.twoLine = res.data.twoLineInfoList;
          this.mapDistrictClusterInfoList = res.data.mapDistrictClusterInfoList;
          this.bindMarker();
        }
      }, error => {
      }
    );
  }

  private mapAddEventListener() {
    this.map.addEventListener("zoomend", function () {
      this.map.clearOverlays();
      for (let shineItem of this.shineArray) {
        clearInterval(shineItem);
      }
      this.uniqueTagList = [];
      this.mapLevel = this.map.getZoom();
        this.getData(this.mapLevel);
    }.bind(this))
    this.map.addEventListener("dragend", function () {
      this.getData(this.mapLevel);
    }.bind(this));

  }

  //详细文物点信息所用的矩形信息框
  private addRectangleLabel(cluster) {
    if (cluster) {
      let myIcon;
      let lblString;
      let pt = new BMap.Point(cluster.coordinateX, cluster.coordinateY);
      let marker;
      this.caseCountTemp = cluster.caseCount == 0 ? 0 : cluster.caseDoingCount + "/" + cluster.caseCount;
      this.patrolCountTemp = cluster.patrolCount == 0 ? 0 : cluster.patrolDoingCount + "/" + cluster.patrolCount;

      //需要闪烁的文保点
      if (cluster.caseDoingCount > 0 || cluster.patrolDoingCount > 0) {
        myIcon = new BMap.Icon("assets/map/ic_cultural_relic_level1_normal.png", new BMap.Size(34, 35));
        lblString = "<div class='positionContain'>";
        let status = 0;
        this.shine = setInterval(() => {
          this.map.removeOverlay(marker);
          if (status == 0) {
            myIcon = new BMap.Icon("assets/map/ic_cultural_relic_level1_warning.png", new BMap.Size(34, 35));
            lblString = "<div class='positionContain warning'>";
            status = 1;
          }
          else {
            myIcon = new BMap.Icon("assets/map/ic_cultural_relic_level1_normal.png", new BMap.Size(34, 35));
            lblString = "<div class='positionContain'>";
            status = 0;
          }
          marker = new BMap.Marker(pt, { icon: myIcon, })
          this.mapAddOverlay(myIcon, lblString, this.caseCountTemp, this.patrolCountTemp, pt, cluster, marker);
        }, 500);
        this.shineArray.push(this.shine);
      }
      else {
        myIcon = new BMap.Icon("assets/map/ic_cultural_relic_level1_normal.png", new BMap.Size(34, 35));
        lblString = "<div class='positionContain'>";
      }
      marker = new BMap.Marker(pt, { icon: myIcon, })
      this.mapAddOverlay(myIcon, lblString, this.caseCountTemp, this.patrolCountTemp, pt, cluster, marker);
    }
  }
  private mapAddOverlay(myIcon, lblString, caseCountTemp, patrolCountTemp, pt, cluster, marker) {
    lblString = lblString + "<div  style='border-bottom:1px solid #fff;padding:0.2em 0.4em;'>"
      + cluster.showName + "</div><div style='padding:0.2em 0.4em;'>案件:" + caseCountTemp +
      "&nbsp;&nbsp;&nbsp;&nbsp;巡查：" + patrolCountTemp + "</div></div>";
    let label = new BMap.Label(lblString, { offset: new BMap.Size(8, -60) });
    label.setStyle({
      border: "none",
      fontSize: "1em",
      color: "#fff",
      borderRadius: '2px;',
      background: "none"
    });
    if (this.mapLevel >= this.showTwoLineMapLevel) {
      marker.setLabel(label);
    }
    label.addEventListener("click",function(){
      this.hideContrl=false;
      this.selectedMarkItem=cluster;
      console.log(this.selectedMarkItem);
    }.bind(this))
    this.map.addOverlay(marker);
  }
  //聚合所用的圆圈
  private addCircleLabel(cluster) {
    let circleColor;
    if (cluster.caseDoingCount > 0 || cluster.patrolDoingCount > 0) {
      circleColor = "#f05853";
    }
    else {
      circleColor = "#1fa0f2";
    }
    let label;
    let point = new BMap.Point(cluster.coordinateX, cluster.coordinateY);
    let option = {
      position: point,
    }
    label = new BMap.Label("<div style='margin:2.8rem auto;'><div>"
      + cluster.showName + "</div><div>" + cluster.culturalRelicCount + "</div></div>", option);
    label.setStyle({
      color: "white",
      background: circleColor,
      fontSize: "12px",
      height: "9rem",
      width: "9rem",
      borderWidth: '1px ',
      borderColor: "white",
      borderRadius: '50%',
      fontFamily: "微软雅黑",
      textAlign: 'center'
    });
    label.addEventListener("click", function () {
      this.mapLevel = this.currentMapLevelMax + 1;
      this.isNeedMoveToFirstIcon = true;
      if (this.isNeedMoveToFirstIcon) {
        let movePoint = new BMap.Point(this.mapDistrictClusterInfoList[0].coordinateX, this.mapDistrictClusterInfoList[0].coordinateY);
        //this.map.centerAndZoom(movePoint, this.mapLevel);
        this.map.setZoom(this.mapLevel);
        this.map.setCenter(movePoint);
        this.isNeedMoveToFirstIcon = false;
      }
      //this.getData(this.mapLevel);
      this.map.clearOverlays();
    }.bind(this));
    this.map.addOverlay(label);
  }

  private bindMarker() {
    //this.map.clearOverlays(this.marker.getLabel());
    //如果已经不再原来的缩放范围内，则清除点
    // if (this.mapLevel <= this.currentMapLevelMin || this.mapLevel > this.currentMapLevelMax) {
    //   //this.clearMarker(maker);
    //   this.map.clearOverlays();
    // }
    //清除所有闪动点

    this.run();
  }

  //拿到infoList数据，遍历添加label
  private run() {
    if (this.mapDistrictClusterInfoList != null && this.mapDistrictClusterInfoList.length > 0) {
      for (let cluster of this.mapDistrictClusterInfoList) {
        this.currentMapLevelMin = cluster.mapLevelMin;
        this.currentMapLevelMax = cluster.mapLevelMax;
        //如果在当前缩放范围内，已经存在该点，则不添加
        if (this.uniqueTagList.indexOf(cluster.uniqueTag) == -1) {
          this.uniqueTagList.push(cluster.uniqueTag);
          switch (cluster.districtType) {
            case 1:
            case 2:
            case 3:
              this.addCircleLabel(cluster);
              //clearInterval(this.shine);
              break;
            case 100:
              //添加闪烁     
              this.addRectangleLabel(cluster);
              if (this.mapLevel >= this.showTwoLineMapLevel) {
                if (this.twoLine) {
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

          }
        }
      }


    }
  }

  private clearMarker() {
    this.map.clearOverlays();
  }
}

