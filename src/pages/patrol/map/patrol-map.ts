import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { ApiService } from './../../../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../../../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../../../models/property/cultural-relic-info.model';
import { UserEntity } from './../../../models/user-info.model';
import { UTMapDistrictClusterInfo } from './../../../models/two-line/two-line-info.model';
import { EnumAreaCode, EnumDistrictType, EnumCulturalRelicLevel } from './../../../models/enum';
import { GetCulturalRelicInfo } from './../../../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../../../models/property/cultural-relic-info.model';
import { PageService } from './../../../services/page.service';
import { Attachment } from "./../../../models/attachment.model";
import { DetailPage } from './../../../base-pages/detail-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
@IonicPage()
@Component({
  selector: 'page-patrol-map',
  templateUrl: 'patrol-map.html',
})
export class PatrolMapPage extends DetailPage {
  @ViewChild('map') mapElement: ElementRef;
  private culturalRelicInfo: CulturalRelicInfo;
  private pageTitle: string;
  private currentMapLevelMin: number;
  private currentMapLevelMax: number;
  private mapLevel: number;
  private isNeedMoveToFirstIcon = false;
  private map: any;
  private showTwoLineMapLevel = 17;
  private userInfo: UserEntity;
  private search: CulturalRelicInfoSearch;
  private searchDataSource: CulturalRelicInfoSearchDataSource;
  private twoLine = [];
  private mapDistrictClusterInfoList: UTMapDistrictClusterInfo[];
  private shine;
  private shineArray = [];
  private uniqueTagList = [];
  private selectedMarkItem;
  private selectedMarkerTag;
  private hideContrl: boolean;//底部信息栏的控制
  private CardContrl: boolean;//左上角两线图信息栏的控制
  private hideDetailContrl: boolean;//底部信息栏中按钮的控制
  private zoomendControle: boolean;//解决setZoom 会出发zoomend事件的问题
  private patrolCountTemp;
  private upArrowContrl;
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
    super(navCtrl, file, fileTransfer, pageService);
    this.pageTitle = (this.navParams.data && this.navParams.data.title) ? this.navParams.data.title : "国保两线监控";
    this.hideContrl = true;
    this.hideDetailContrl = false;
    this.CardContrl = false;
    this.zoomendControle = true;
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
    this.getLocation(longT, lati);
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
          this.showPicture("", this.culturalRelicInfo.twoLimitImageList);
        } else {
          this.pageService.showErrorMessage(res.reason);
        }
      },
      error => {
        this.pageService.showErrorMessage(error);
      });

  }

  showPicture(fileUrl: string, attachmentList: Attachment[]) {
    super.showSlidesPage(attachmentList, fileUrl);
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

  private getLocation(longitude, latitude) {
    var pointData = new BMap.Point(longitude, latitude);
    var myLocation = new BMap.Icon("assets/map/ic_map_marker_self.png", new BMap.Size(34, 35));
    let mkr = new BMap.Marker(pointData, { icon: myLocation, enableMassClear: false });
    this.map.addOverlay(mkr);
    this.map.panTo(pointData);
  }

  private drawTwoLine(linePoint, color) {
    var Polygon = new BMap.Polygon(linePoint, { strokeColor: color, fillColor: "", fillOpacity: 0.3, strokeWeight: 2, strokeOpacity: 1 });   //创建折线
    this.map.addOverlay(Polygon);
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
          console.log(res);
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
        console.log(this.mapLevel);
        this.getData(this.mapLevel);
        //控制左上角的两线信息栏
        this.CardContrl = this.mapLevel >= this.showTwoLineMapLevel ? false : true;
      }
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
      let picName = this.setMarkerByCRlevel();

      this.patrolCountTemp = cluster.patrolCount == 0 ? 0 : cluster.patrolDoingCount + "/" + cluster.patrolCount;
      //需要闪烁的文保点
      if (cluster.caseDoingCount > 0 || cluster.patrolDoingCount > 0) {
        myIcon = new BMap.Icon("assets/map/ic_cultural_relic_level1_normal.png", new BMap.Size(34, 35));
        let status = 0;
        lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'>";
        this.shine = setInterval(() => {
          this.map.removeOverlay(marker);
          if (status == 0) {
            myIcon = new BMap.Icon("assets/map/" + picName + "warning.png", new BMap.Size(34, 35));
            lblString = "<div id=" + cluster.uniqueTag + " class='positionContain warning'>";
            status = 1;
          }
          else {
            if (this.selectedMarkerTag == cluster.uniqueTag) {
              myIcon = new BMap.Icon("assets/map/" + picName + "selected.png", new BMap.Size(34, 35));
              lblString = "<div id=" + cluster.uniqueTag + " class='positionContain' name='selected'>";
            }
            else {
              myIcon = new BMap.Icon("assets/map/" + picName + "normal.png", new BMap.Size(34, 35));
              lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'>";
            }
            status = 0;
          }
          marker = new BMap.Marker(pt, { icon: myIcon, })
          this.mapAddOverlay(myIcon, lblString, this.patrolCountTemp, pt, cluster, marker, picName);
        }, 500);
        this.shineArray.push(this.shine);
      }
      else {
        if (this.selectedMarkerTag == cluster.uniqueTag) {
          myIcon = new BMap.Icon("assets/map/" + picName + "normal.png", new BMap.Size(34, 35));
          lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'  name='selected'>";
        }
        else {
          myIcon = new BMap.Icon("assets/map/" + picName + "normal.png", new BMap.Size(34, 35));
          lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'>";
        }
        marker = new BMap.Marker(pt, { icon: myIcon, })
        this.mapAddOverlay(myIcon, lblString, this.patrolCountTemp, pt, cluster, marker, picName);
      }
    }
  }

  private mapAddOverlay(myIcon, lblString, patrolCountTemp, pt, cluster, marker, picName) {
    let lblStringNew = lblString + "<div  style='border-bottom:1px solid #fff;padding:0.2em 0.4em;'>"
      + cluster.showName + "</div><div style='padding:0.2em 0.4em;'>巡查：" + patrolCountTemp + "</div></div>";
    let label = new BMap.Label(lblStringNew, { offset: new BMap.Size(8, -60) });
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
    this.map.addOverlay(marker);
    label.addEventListener("click", function (event) {
      this.hideContrl = false;
      this.upArrowContrl = false;
      this.hideDetailContrl = false;
      this.selectedMarkItem = cluster;
      let list, index;
      list = document.getElementsByClassName("positionContain");
      for (index = 0; index < list.length; ++index) {
        list[index].removeAttribute("name");
        let childImg = list[index].parentNode.previousSibling.firstChild;
        childImg.setAttribute("src", "assets/map/" + picName + "normal.png");
      }
      document.getElementById(cluster.uniqueTag).setAttribute("name", "selected");
      this.selectedMarkerTag = cluster.uniqueTag;
      this.setIcon(this.selectedMarkerTag);

    }.bind(this));
  }

  //根据culturalRelicLevel判断marker
  private setMarkerByCRlevel() {
    let picsName = "";
    switch (this.search.culturalRelicLevel) {
      case EnumCulturalRelicLevel["全国重点文物保护单位"]:
        picsName = "ic_cultural_relic_level1_";
        break;
      case EnumCulturalRelicLevel["省级文物保护单位"]:
        picsName = "ic_cultural_relic_level2_";
        break;
      case EnumCulturalRelicLevel["市级文物保护单位"]:
        picsName = "ic_cultural_relic_level3_";
        break;
      case EnumCulturalRelicLevel["县区级文物保护单位"]:
        picsName = "ic_cultural_relic_level4_";
        break;
      case EnumCulturalRelicLevel["其他不可移动文物"]:
        picsName = "ic_cultural_relic_level5_";
        break;
      case EnumCulturalRelicLevel["博物馆"]:
        picsName = "ic_cultural_relic_level6_";
        break;
      case EnumCulturalRelicLevel["文物市场"]:
        picsName = "ic_cultural_relic_level7_";
        break;
      case EnumCulturalRelicLevel["工地"]:
        picsName = "ic_cultural_relic_level8_";
        break;
      default:
        picsName = "ic_cultural_relic_level1_";
    }
    return picsName;
  }

  //设置label下方的marker图标
  private setIcon(id) {
    let pImg = document.getElementById(id).parentNode.previousSibling.firstChild as HTMLElement;
    pImg.setAttribute("src", "assets/map/ic_cultural_relic_level1_selected.png");
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
      offset: new BMap.Size(-45, -45),
    }
    this.patrolCountTemp = cluster.patrolCount == 0 ? 0 : cluster.patrolDoingCount + "/" + cluster.patrolCount;
    label = new BMap.Label("<div style='margin:30px auto;'><div>"
      + cluster.showName + "</div><div>" + cluster.culturalRelicCount + "</div></div>", option);
    label.setStyle({
      color: "white",
      background: circleColor,
      fontSize: "14px",
      height: "90px",
      width: "90px",
      borderWidth: '1px ',
      borderColor: "white",
      borderRadius: '50%',
      fontFamily: "微软雅黑",
      textAlign: 'center'
    });
    label.addEventListener("click", function () {
      this.upArrowContrl = false;
      this.hideDetailContrl = true;
      this.hideContrl = false;
      this.selectedMarkItem = cluster;
      this.mapLevel = this.currentMapLevelMax + 1;
      this.isNeedMoveToFirstIcon = true;
      this.map.clearOverlays();
      if (this.isNeedMoveToFirstIcon) {
        let movePoint = new BMap.Point(cluster.coordinateX, cluster.coordinateY);
        this.map.setCenter(movePoint);
        this.zoomendControle = false;
        this.map.setZoom(this.mapLevel);
        this.isNeedMoveToFirstIcon = false;
      }
      this.getData(this.mapLevel);
    }.bind(this));
    this.map.addOverlay(label);
  }

  //拿到infoList数据，遍历添加label
  private bindMarker() {
    if (this.mapDistrictClusterInfoList != null && this.mapDistrictClusterInfoList.length > 0) {
      for (let cluster of this.mapDistrictClusterInfoList) {
        this.currentMapLevelMin = cluster.mapLevelMin;
        this.currentMapLevelMax = cluster.mapLevelMax;
        //如果在当前缩放范围内，已经存在该点，则不添加
        if (this.uniqueTagList.indexOf(cluster.uniqueTag) == -1) {
          this.uniqueTagList.push(cluster.uniqueTag);
          switch (cluster.districtType) {
            case EnumDistrictType["省"]:
            case EnumDistrictType["市"]:
            case EnumDistrictType["县区"]:
              this.addCircleLabel(cluster);
              this.mapLevel = cluster.mapLevelMax;
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
        if (this.isNeedMoveToFirstIcon) {
          let movePoint = new BMap.Point(this.mapDistrictClusterInfoList[0].coordinateX, this.mapDistrictClusterInfoList[0].coordinateY);
          this.map.setZoom(this.mapLevel);
          this.map.setCenter(movePoint);
          this.isNeedMoveToFirstIcon = false;
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
        if (this.search.districtCoordinateX && this.search.districtCoordinateY) {
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
