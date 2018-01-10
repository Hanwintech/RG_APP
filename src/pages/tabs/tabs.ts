import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';

import { BasePage } from './../../base-pages/base-page';
import { ApiService } from './../../services/api.service';
import { PageService } from './../../services/page.service';
import { PostUserCoordinateInfo } from './../../apis/system/system.api';
import { UserLocationInfo } from './../../models/system/user-location-info.model';
import { EnumAppRole } from "./../../models/enum";

declare var BMap;

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage extends BasePage {
  private showPatrol: boolean;
  private searchDefaultPage: number;

  private tab1Root: string;
  private tab2Root: string;
  private tab3Root: string;
  private tab4Root: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public fileTransfer: FileTransfer,
    public geolocation: Geolocation,
    public apiService: ApiService,
    public pageService: PageService
  ) {
    super(navCtrl, file, fileTransfer, pageService);

    this.showPatrol = super.hasRole(EnumAppRole.Patrol) || super.hasRole(EnumAppRole.SearchPatrol) || super.hasRole(EnumAppRole.Volunteer);

    this.tab2Root = 'PatrolMapPage';
    this.tab3Root = 'SearchIndexPage';
    this.tab4Root = 'SelfIndexPage';

    this.watchPosition();//监控实时位置
  }

  twoline() {
    var navOptions = { animation: 'wp-transition' };
    this.navCtrl.push("TwoLinePage", null, navOptions);
  }

  public showPatrolOnline() {
    this.navCtrl.getAllChildNavs()[0].select(1);
  }

  public showPatrolStatistic() {
    this.searchDefaultPage = 1;
    this.navCtrl.getAllChildNavs()[0].select(2);
  }

  public searchSelected() {
    this.searchDefaultPage = 0;
  }

  //监控实时位置
  watchPosition() {
    // localStorage.setItem('longitude', '120.78877004348');
    // localStorage.setItem('latitude', '31.346248778536');

    this.geolocation.watchPosition().subscribe(
      res => {
        if (localStorage.getItem('userId') && res && res.coords) {
          let pointArr = [new BMap.Point(res.coords.longitude, res.coords.latitude)];
          new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
            if (data.status === 0) {
              localStorage.setItem('longitude', data.points[0].lng);
              localStorage.setItem('latitude', data.points[0].lat);
              this.uploadLocation();
            } else {
              localStorage.removeItem('longitude');
              localStorage.removeItem('latitude');
              this.pageService.showErrorMessage("获取地理坐标失败！");
            }
          }.bind(this));
        } else {
          localStorage.removeItem('longitude');
          localStorage.removeItem('latitude');
          this.pageService.showErrorMessage("获取地理位置失败！");
        }
        // localStorage.setItem('longitude', '120.78877004348');
        // localStorage.setItem('latitude', '31.346248778536');
      },
      error => {
        this.pageService.showErrorMessage("获取地理位置出错！");
      },
      () => {
        localStorage.removeItem('longitude');
        localStorage.removeItem('latitude');
      }
    );
  }

  uploadLocation(){
    let location: UserLocationInfo = new UserLocationInfo();
    location.userId = localStorage.getItem('userId')
    location.longitude = localStorage.getItem('longitude')
    location.latitude = localStorage.getItem('latitude')
    this.apiService.sendApi(new PostUserCoordinateInfo(location)).subscribe(
      res => { },
      error => { this.pageService.showErrorMessage("上传地理坐标出错！"); },
      () => { }
    );
  }
}