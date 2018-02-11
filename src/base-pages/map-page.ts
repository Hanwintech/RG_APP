import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { ApiService } from './../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../models/property/cultural-relic-info.model';
import { UserEntity } from './../models/user-info.model';
import { UTMapDistrictClusterInfo } from './../models/two-line/two-line-info.model';
import { GetCulturalRelicInfo } from './../apis/property/cultural-relic-info.api';
import { CulturalRelicInfo } from './../models/property/cultural-relic-info.model';
import { EnumAreaCode, EnumDistrictType, EnumCulturalRelicLevel } from './../models/enum';
import { PageService } from './../services/page.service';
import { Attachment } from "./../models/attachment.model";
import { DetailPage } from './../base-pages/detail-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
export class MapPage extends DetailPage {
    map: any;
    caseCountTemp: any;//案件
    patrolCountTemp: any;//巡查
    shine: any;//控制闪烁
    shineArray = [];
    showTwoLineMapLevel: number = 16;
    mapLevel: number;
    hideContrl: boolean;//底部面板的显示隐藏控制
    upArrowContrl: boolean;//巡查页面的arrow按钮
    hideDetailContrl: boolean;//底部面板中可点击事件的显示隐藏
    selectedMarkItem: any;
    selectedMarkerTag: any;//选中的marker、label
    selectedCircleTag: any;//选中的圆形label
    culturalRelicInfo: CulturalRelicInfo;
    search: CulturalRelicInfoSearch;
    userInfo: UserEntity;
    private twoLine = [];
    searchDataSource: CulturalRelicInfoSearchDataSource;
    private mapDistrictClusterInfoList: UTMapDistrictClusterInfo[];
    private currentMapLevelMax: number;
    private personLocate;
    uniqueTagList = [];
    isNeedMoveToFirstIcon: boolean;
    zoomendControle: boolean;//解决setZoom 会触发zoomend事件的问题
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public pageService: PageService,
        public modalCtrl: ModalController,
        public apiService: ApiService,
        public file: File,
        public fileTransfer: FileTransfer) {
        super(navCtrl, file, fileTransfer, pageService);
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
                    console.log( this.culturalRelicInfo);
                    if (this.culturalRelicInfo.twoLimitImageList) {
                        super.changeAttachmentFileType(this.culturalRelicInfo.twoLimitImageList)
                        this.showPicture("", this.culturalRelicInfo.twoLimitImageList);
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

    //初始化查询数据
    initSearchData() {
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

    getData(mapLevel) {
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
                    console.log(res.data);
                }
            }, error => {
            }
        );
    }

    //拿到infoList数据，遍历添加label
    bindMarker() {
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

    //查看图片
    showPicture(fileUrl: string, attachmentList: Attachment[]) {
        super.showSlidesPage(attachmentList, fileUrl);
    }

    //定位
    getLocation(longitude, latitude) {
        this.map.removeOverlay(this.personLocate);
        let pointData = new BMap.Point(longitude, latitude);
        let myLocation = new BMap.Icon("assets/map/ic_map_marker_self.png", new BMap.Size(34, 35));
        this.personLocate = new BMap.Marker(pointData, { icon: myLocation, enableMassClear: false });
        this.map.addOverlay(this.personLocate);
    }

    //两线图
    drawTwoLine(linePoint, color) {
        let Polygon = new BMap.Polygon(linePoint, { strokeColor: color, fillColor: "", fillOpacity: 0.3, strokeWeight: 2, strokeOpacity: 1 });   //创建折线
        this.map.addOverlay(Polygon);
    }

    //根据culturalRelicLevel判断marker
    setMarkerByCRlevel(cluster) {
        let picsName = "";
        switch (cluster.culturalRelicLevel) {
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

    //聚合所用的圆圈
    addCircleLabel(cluster) {
        let lblString;
        if (cluster.caseDoingCount > 0 || cluster.patrolDoingCount > 0) {
            if (this.selectedCircleTag == cluster.uniqueTag) {
                lblString = "<div id=" + cluster.uniqueTag + " class='circleRedLabel' name='selected'>";
            }
            else {
                lblString = "<div id=" + cluster.uniqueTag + " class='circleRedLabel'>";
            }
        }
        else {
            if (this.selectedCircleTag == cluster.uniqueTag) {
                lblString = "<div id=" + cluster.uniqueTag + " class='circleBlueLabel'  name='selected'>";
            }
            else {
                lblString = "<div id=" + cluster.uniqueTag + " class='circleBlueLabel'>";
            }
        }
        let label;
        let point = new BMap.Point(cluster.coordinateX, cluster.coordinateY);
        let option = {
            position: point,
            offset: new BMap.Size(-43, -43),
        }
        label = new BMap.Label(lblString + "<div class='contentContainer'><div>"
            + cluster.showName + "</div><div style='margin-top:6px;'>" + cluster.culturalRelicCount + "</div></div></div>", option);
        label.setStyle({
            background: "none",
            border: "none"
        });
        label.addEventListener("click", function (event) {
            this.upArrowContrl = false;
            this.hideDetailContrl = true;
            this.hideContrl = false;
            this.selectedMarkItem = cluster;
            this.selectedCircleTag = cluster.uniqueTag;
            this.patrolCountTemp = cluster.patrolCount == 0 || !cluster.patrolCount ? 0 : cluster.patrolDoingCount + "/" + cluster.patrolCount;
            this.mapLevel = this.currentMapLevelMax + 1;
            let movePoint = new BMap.Point(cluster.coordinateX, cluster.coordinateY);
            this.map.setCenter(movePoint);
            this.map.clearOverlays();
            this.zoomendControle = false;
            this.map.setZoom(this.mapLevel);
            this.getData(this.mapLevel);
        }.bind(this));
        this.map.addOverlay(label);
    }

    addRectangleLabel(cluster) {
        if (cluster) {
            let myIcon;
            let lblString;
            let pt = new BMap.Point(cluster.coordinateX, cluster.coordinateY);
            let marker;
            let picName = this.setMarkerByCRlevel(cluster);
            this.caseCountTemp = cluster.caseCount == 0 || !cluster.caseCount ? 0 : cluster.caseDoingCount + "/" + cluster.caseCount;
            this.patrolCountTemp = cluster.patrolCount == 0 || !cluster.patrolCount ? 0 : cluster.patrolDoingCount + "/" + cluster.patrolCount;
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
                        this.map.addOverlay(lblString);
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
                        this.map.addOverlay(lblString);
                        status = 0;
                    }
                    marker = new BMap.Marker(pt, { icon: myIcon, })
                    this.mapAddOverlay(lblString, this.caseCountTemp, this.patrolCountTemp, cluster, marker, picName);
                }, 500);
                this.shineArray.push(this.shine);
            }
            else {
                if (this.selectedMarkerTag == cluster.uniqueTag) {
                    myIcon = new BMap.Icon("assets/map/" + picName + "selected.png", new BMap.Size(34, 35));
                    lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'  name='selected'>";
                }
                else {
                    myIcon = new BMap.Icon("assets/map/" + picName + "normal.png", new BMap.Size(34, 30));
                    lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'>";
                }
                marker = new BMap.Marker(pt, { icon: myIcon, })
                this.mapAddOverlay(lblString, this.caseCountTemp, this.patrolCountTemp, cluster, marker, picName);
            }
        }
    }

    private mapAddOverlay(lblString, caseCountTemp, patrolCountTemp, cluster, marker, picName) {
        let lblStringNew = lblString + "<div  style='border-bottom:1px solid #fff;padding:0.2em 0.4em;'>"
            + cluster.showName + "</div><div style='padding:0.2em 0.4em;'>巡查：" + patrolCountTemp + "</div></div>";
        let label = new BMap.Label(lblStringNew, { offset: new BMap.Size(5, -50) });
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
        marker.addEventListener("click", function () {
            if (this.mapLevel <= this.currentMapLevelMax) {
                let movePoint = new BMap.Point(cluster.coordinateX, cluster.coordinateY);
                this.map.setCenter(movePoint);
                this.map.setZoom(this.showTwoLineMapLevel);
                setTimeout(() => {
                    this.selectedItem(cluster, picName);
                }, 800);
            }
        }.bind(this))
        label.addEventListener("click", function (event) {
            this.selectedItem(cluster, picName);

        }.bind(this));
    }

    //marker,label的点击选中事件
    private selectedItem(cluster, picName) {
        this.hideContrl = false;
        this.upArrowContrl = false;
        this.hideDetailContrl = false;
        this.selectedMarkItem = cluster;
        this.patrolCountTemp = cluster.patrolCount == 0 || !cluster.patrolCount ? 0 : cluster.patrolDoingCount + "/" + cluster.patrolCount;
        let list;
        list = document.getElementsByClassName("positionContain");
        for (let indexItem of list) {
            if (indexItem.hasAttribute("name")) {
                indexItem.removeAttribute("name");
                let childImg = indexItem.parentNode.previousSibling.firstChild;
                childImg.setAttribute("src", "assets/map/" + picName + "normal.png");
            }
        }
        if (document.getElementById(cluster.uniqueTag)) {
            document.getElementById(cluster.uniqueTag).setAttribute("name", "selected");
            this.selectedMarkerTag = cluster.uniqueTag;
            this.setIcon(this.selectedMarkerTag, cluster);
        }
    }

    //设置label下方的marker图标
    private setIcon(id, cluster) {
        let pImg = document.getElementById(id).parentNode.previousSibling.firstChild as HTMLElement;
        let picName = this.setMarkerByCRlevel(cluster);
        pImg.setAttribute("src", "assets/map/" + picName + "selected.png");
    }

    //为地图绑定zoom、drag事件
    mapAddEventListener() {
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

    //获取搜索数据
    getSearchData(searchData) {
        this.map.clearOverlays();
        this.search = searchData;
        this.search.culturalRelicLevel = parseInt(searchData.culturalRelicLevel);
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
}
