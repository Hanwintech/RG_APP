import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
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
    var pointData = new BMap.Point(120.78877004348,31.346248778536);
    this.map.centerAndZoom(pointData, 14)
    let longT=120.78877004348;
    let lati=31.346248778536; 
     setInterval(()=>{
      //this.getLocation();
    longT=longT+0.000001;
    lati=lati+0.0000001; 
    this.getLocation(longT,lati);
    },1000);
  
  }


  getLocation(longitude,latitude) {
      var pointData = new BMap.Point(longitude,latitude);
      var myLocation = new BMap.Icon("assets/map/my-location.ico", new BMap.Size(34, 35));
      let mkr = new BMap.Marker(pointData, {icon: myLocation});
     // this.map.centerAndZoom(pointData, 14);//设置中心和地图显示级别
      this.map.clearOverlays();      
      this.map.addOverlay(mkr);
      this.map.panTo(pointData);
  }
}
