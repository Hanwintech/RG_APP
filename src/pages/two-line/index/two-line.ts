import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../../../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { UserEntity } from './../../../models/user-info.model';
import { UTMapDistrictClusterInfo } from './../../../models/two-line/two-line-info.model';
import { EnumAreaCode, EnumDistrictType } from './../../../models/enum';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';
import { PageService } from './../../../services/page.service';
import { Attachment } from "./../../../models/attachment.model";
import { DetailPage } from './../../../base-pages/detail-page';
import { MapPage } from './../../../base-pages/map-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-two-line',
  templateUrl: 'two-line.html',
})
export class TwoLinePage extends MapPage {
  @ViewChild('map') mapElement: ElementRef;
  private culturalRelicInfo: CulturalRelicInfo;
  private pageTitle: string;
  private currentMapLevelMax: number;
  private userInfo: UserEntity;
  private search: CulturalRelicInfoSearch;
  private searchDataSource: CulturalRelicInfoSearchDataSource;
  private twoLine = [];
  private mapDistrictClusterInfoList: UTMapDistrictClusterInfo[];
  private uniqueTagList = [];
  private CardContrl: boolean;//左上角两线图信息栏的控制
  private zoomendControle: boolean;//解决setZoom 会出发zoomend事件的问题
  private isNeedMoveToFirstIcon: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public pageService: PageService,
    public http: Http,
    public modalCtrl: ModalController,
    public apiService: ApiService,
    public file: File,
    public fileTransfer: FileTransfer,
    public geolocation: Geolocation) {
    super(navCtrl, navParams, platform, pageService,
      modalCtrl, apiService, file, fileTransfer, geolocation);
    this.hideContrl = true;
    this.hideDetailContrl = false;
    this.CardContrl = false;
    this.zoomendControle = true;
    this.pageTitle = (this.navParams.data && this.navParams.data.title) ? this.navParams.data.title : "国保两线监控";
  }

  list() {
    this.navCtrl.push('PatrolInfoListPage');
  }

  ionViewDidLoad() {
    //  setInterval(()=>{
    //   //this.getLocation();
    // longT=longT+0.000001;
    // lati=lati+0.0000001; 
    // this.getLocation(longT,lati);
    // },1000000);
    this.initSearchData();
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
    // Projection projection=  this.map.getProjection();
    let longT = '120.788713';
    let lati = '31.345924';
    super.getLocation(longT, lati);
    this.mapLevel = this.map.getZoom() + 1;
    this.getData(this.mapLevel);
    this.mapAddEventListener();
  }
  //底部查看详情面板
  controlBottom() {
    this.hideContrl = this.hideContrl ? false : true;
    this.hideDetailContrl = false;
    this.upArrowContrl = this.hideContrl;
  }

  showBottomInfo() {
    this.hideContrl = false;
    this.upArrowContrl = false;
  }
  //获取当前所在位置
  selfLocation() {
    let longT = '120.788713';
    let lati = '31.345924';
    let movePoint = new BMap.Point(longT, lati);
    this.map.setCenter(movePoint);
  }

  viewDetail() {
    this.navCtrl.push('CulturalRelicInfoDetailPage', this.selectedMarkItem.culturalRelicId);
  }

  viewPatrol() {
    this.navCtrl.push('PatrolInfoListPage', { "culturalRelicID": this.selectedMarkItem.culturalRelicId });
  }

  viewPic() {
    this.apiService.sendApi(new GetCulturalRelicInfo(this.selectedMarkItem.culturalRelicId)).subscribe(
      res => {
        if (res.success) {
          this.culturalRelicInfo = res.data;
          super.changeAttachmentFileType(this.culturalRelicInfo.twoLimitImageList)
          super.showPicture("", this.culturalRelicInfo.twoLimitImageList);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });

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
  }

  private getData(mapLevel) {
    this.search.leftTopCoordinateX = this.map.getBounds().Le;
    this.search.leftTopCoordinateY = this.map.getBounds().Fe;
    this.search.rightBottomCoordinateX = this.map.getBounds().Ge;
    this.search.rightBottomCoordinateY = this.map.getBounds().Ke;
    this.search.mapLevel = mapLevel;
    this.apiService.sendApi(new GetCulturalRelicMapInfosUrl(this.search)).subscribe(
      res => {
        if (res.success) {
          this.twoLine = res.data.twoLineInfoList;
          this.mapDistrictClusterInfoList = res.data.mapDistrictClusterInfoList;
          this.searchDataSource = res.data.culturalRelicInfoSearchDataSource;
          this.search = res.data.search;//采用服务器端的默认查询条件
          this.bindMarker();
        }
      }, error => {
      }
    );
  }

  private mapAddEventListener() {
    this.map.addEventListener("zoomend", function (type) {
      if (this.zoomendControle) {
        this.map.clearOverlays();
        for (let shineItem of this.shineArray) {
          clearInterval(shineItem);
        }
        this.uniqueTagList = [];
        this.mapLevel = this.map.getZoom();
        this.getData(this.mapLevel);
        //控制左上角的两线信息栏
        this.CardContrl = this.mapLevel >= this.showTwoLineMapLevel ? false : true;
      }
    }.bind(this))
    this.map.addEventListener("dragend", function () {
      this.getData(this.mapLevel);
    }.bind(this));
  }

  //拿到infoList数据，遍历添加label
  private bindMarker() {
    if (this.mapDistrictClusterInfoList != null && this.mapDistrictClusterInfoList.length > 0) {
      for (let cluster of this.mapDistrictClusterInfoList) {
        this.currentMapLevelMax = cluster.mapLevelMax;
        //如果在当前缩放范围内，已经存在该点，则不添加
        if (this.uniqueTagList.indexOf(cluster.uniqueTag) == -1) {
          this.uniqueTagList.push(cluster.uniqueTag);
          switch (cluster.districtType) {
            case EnumDistrictType["省"]:
            case EnumDistrictType["市"]:
            case EnumDistrictType["县区"]:
              this.addCircleLabel(cluster);
              // this.mapLevel = cluster.mapLevelMax;
              break;
            case EnumDistrictType["文物点"]:
              //添加闪烁    
              this.addRectangleLabel(cluster);
              if (this.mapLevel >= this.showTwoLineMapLevel) {
                if (this.twoLine) {
                  for (let info of this.twoLine) {
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
          }
        }
      }
    }
    this.zoomendControle = true;
  }

  showSearch() {
    this.search.isDefaultSearch = false;
    let searchModal = this.modalCtrl.create("MapSearchPage", { "search": this.search, "dataSource": this.searchDataSource });
    searchModal.onDidDismiss(data => {
      if (data.needSearch) {
        this.map.clearOverlays();
        this.search = data.search;
        this.search.culturalRelicLevel = parseInt(data.search.culturalRelicLevel);
        let district, tempDistrictType;
        if (this.search.area > 0) {
          district = this.search.area;
        }
        if (this.search.district > 0) {
          district = this.search.district;
        }
        //如果有对应区域的坐标，则取该坐标，如果没有，则取最后一个坐标
        if (this.searchDataSource != null && this.searchDataSource.mapDistrictClusterList != null && this.searchDataSource.mapDistrictClusterList.length > 0) {
          for (let item of this.searchDataSource.mapDistrictClusterList) {
            if (item.district == district) {
              this.search.districtCoordinateX = item.coordinateX;
              this.search.districtCoordinateY = item.coordinateY;
              tempDistrictType = item.districtType;
              break;
            }
            else if (item.district == EnumAreaCode["江苏省"]) {//如果没有选择区域，则移动到江苏省
              this.search.districtCoordinateX = item.coordinateX;
              this.search.districtCoordinateY = item.coordinateY;
              tempDistrictType = item.districtType;
            }
          }
        }
        if (this.search.culturalRelicName) {
          this.zoomendControle = false;
          this.map.setZoom(17);
          this.mapLevel = 17;
          this.isNeedMoveToFirstIcon = true;
        }
        if (this.search.districtCoordinateX && this.search.districtCoordinateY && !this.search.culturalRelicName) {
          let movePoint = new BMap.Point(this.search.districtCoordinateX.toString(), this.search.districtCoordinateY.toString());
          this.map.setCenter(movePoint);
        }
        for (let shineItem of this.shineArray) {
          clearInterval(shineItem);
        }
        this.getData(this.mapLevel);
        this.uniqueTagList = [];
      }
    });
    searchModal.present();
  }
}