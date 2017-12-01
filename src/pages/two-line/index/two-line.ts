import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation,Geoposition } from '@ionic-native/geolocation';
import { Http, Headers, RequestMethod, Request } from '@angular/http';

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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private http: Http,
    public geolocation: Geolocation, ) {
  }

  ionViewDidEnter() {
    this.map = new BMap.Map(this.mapElement.nativeElement, { enableMapClick: true });//创建地图实例
    this.map.enableScrollWheelZoom();//启动滚轮放大缩小，默认禁用
    this.map.enableContinuousZoom();//连续缩放效果，默认禁用 
    this.getLocation();
  }
  getLocation() {
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   let pointArr = [];
    //   let mkr = [];
    //   let convertor = new BMap.Convertor();
    //   let point = new BMap.Point(resp.coords.longitude, resp.coords.latitude);//坐标可以通过百度地图坐标拾取器获取
    //   //let point = new BMap.Point("120.777409", "31.341405");//坐标可以通过百度地图坐标拾取器获取
      
    //   pointArr.push(point);
    //   convertor.translate(pointArr, 1, 5, function (data) {
    //         console.log(data.points[0].lat);
    //         console.log(data.points[0].lng);
    //     if (data.status === 0) {
    //       var myLocation = new BMap.Icon("assets/map/my-location.ico", new BMap.Size(34, 35));
    //       let mkr = new BMap.Marker(data.points[0], {
    //         icon: myLocation,
    //         enableClicking: true
    //       });
       
    //       this.map.centerAndZoom(data.points[0], 14);//设置中心和地图显示级别    
    //       this.map.addOverlay(mkr);
    //       this.map.panTo(data.points[0]);
    //     }
    //   }.bind(this));
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
     if((data as Geoposition).coords != undefined){
       alert(data.coords.longitude);
       alert(data.coords.latitude);
      //  let pointArr = [];
      //  let mkr = [];
      //  let convertor = new BMap.Convertor();
      //  let point = new BMap.Point(data.coords.longitude, data.coords.latitude);//坐标可以通过百度地图坐标拾取器获取
      //  pointArr.push(point);
      //  convertor.translate(pointArr, 1, 5, function (data) {
      //  alert(data.points[0].lat);
      //  alert(data.points[0].lng);
      //  }.bind(this));
     }
    });
  }

  getTestData(inspectSearchPara) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = {
      method: RequestMethod.Post,
      url: "http://hmerc.hanwintech.com:10000/CHDYH.API" + '/api/Inspect/ListProperty',
      headers: headers,
      body: inspectSearchPara,
    };
    return this.http.request(new Request(options)).map(res => res.json());
  }
}
