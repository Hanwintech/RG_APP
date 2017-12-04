import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Http, Headers, RequestMethod, Request } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../../../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch } from './../../../models/property/cultural-relic-info.model';
import { UserInfo, UserEntity } from './../../../models/user-info.model';
import { TwoLineInfo } from './../../../models/two-line/two-line-info.model';

declare var BMap;
@IonicPage()
@Component({
  selector: 'page-two-line',
  templateUrl: 'two-line.html',
})
export class TwoLinePage {
  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public longitude: any;
  public latitude: any;
  public selectedId: any;
  private userInfo: UserEntity;
  private search: CulturalRelicInfoSearch;
  private twoLine=[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private http: Http,
    private apiService: ApiService,
    public geolocation: Geolocation) {

  }

  ionViewDidEnter() {
    this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    var pointData = new BMap.Point(120.78877004348, 31.346248778536);
    this.map.centerAndZoom(pointData, 17)
    let longT = 120.78877004348;
    let lati = 31.346248778536;
    //  setInterval(()=>{
    //   //this.getLocation();
    // longT=longT+0.000001;
    // lati=lati+0.0000001; 
    // this.getLocation(longT,lati);
    // },1000000);
    this.getLocation(longT,lati);
    this.getData();
    //this.drawTwoLine();
  }


  getLocation(longitude, latitude) {
    var pointData = new BMap.Point(longitude, latitude);
    var myLocation = new BMap.Icon("assets/map/my-location.ico", new BMap.Size(34, 35));
    let mkr = new BMap.Marker(pointData, { icon: myLocation });
   // this.map.clearOverlays();
    this.map.addOverlay(mkr);
    this.map.panTo(pointData);
  }

  drawTwoLine(linePoint,color) {
    var Polygon = new BMap.Polygon(linePoint, { strokeColor:color, fillColor:"",fillOpacity:0,strokeWeight: 2, strokeOpacity: 1});   //创建折线
    console.log(Polygon);
    this.map.addOverlay(Polygon);
  }
  getData() {
    let that=this;
    this.search = new CulturalRelicInfoSearch();
    this.userInfo = new UserEntity(localStorage.getItem('account'), localStorage.getItem('name'));
    this.search.userId = localStorage.getItem("userId");
    this.search.manageUnitId = localStorage.getItem("manageUnitId");
    this.search.userType = Number(localStorage.getItem("userType"));
    this.search.isDefaultSearch = true;
    this.search.isNeedPaging = false;
    this.search.isNeedSearchDataSource = true;
    this.search.searchType = 1;
    this.search.culturalRelicSearchType = 1;
    this.search.mapLevel = 18.0;
    this.search.culturalRelicName = "沙湖科技园";
    this.search.leftTopCoordinateX = 0;
    this.search.leftTopCoordinateY = 0;
    this.search.rightBottomCoordinateX = 400;
    this.search.rightBottomCoordinateY = 600;
    this.apiService.sendApi(new GetCulturalRelicMapInfosUrl(this.search)).subscribe(
      res => {
        if (res.success) {
          console.log(res);
          this.twoLine=res.data.twoLineInfoList;
          for (let i = 0; i < this.twoLine.length; i++) {
            let color="#"+this.twoLine[i].twoLinePolygon.color;
            let line=[];
            for(let j=0;j<this.twoLine[i].twoLinePointList.length;j++){
             line.push(new BMap.Point(this.twoLine[i].twoLinePointList[j].x, this.twoLine[i].twoLinePointList[j].y));
            }
            this.drawTwoLine(line,color);
          }
        }
      }, error => {

      }
    );
  }
}
