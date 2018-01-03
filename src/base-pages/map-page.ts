import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ApiService } from './../services/api.service';
import { GetCulturalRelicMapInfosUrl } from './../apis/two-line/two-line.api';
import { CulturalRelicInfoSearch, CulturalRelicInfoSearchDataSource } from './../models/property/cultural-relic-info.model';
import { UserEntity } from './../models/user-info.model';
import { UTMapDistrictClusterInfo } from './../models/two-line/two-line-info.model';
import { EnumAreaCode, EnumDistrictType, EnumCulturalRelicLevel } from './../models/enum';
import { PageService } from './../services/page.service';
import { Attachment } from "./../models/attachment.model";
import { DetailPage } from './../base-pages/detail-page';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

declare var BMap;
declare var BMAP_NORMAL_MAP;
declare var BMAP_HYBRID_MAP;
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
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public pageService: PageService,
        public modalCtrl: ModalController,
        public apiService: ApiService,
        public file: File,
        public fileTransfer: FileTransfer,
        public geolocation: Geolocation) {
        super(navCtrl, file, fileTransfer, pageService);
    }

    //查看图片
    showPicture(fileUrl: string, attachmentList: Attachment[]) {
        super.showSlidesPage(attachmentList, fileUrl);
    }

    //定位
    getLocation(longitude, latitude) {
        let pointData = new BMap.Point(longitude, latitude);
        let myLocation = new BMap.Icon("assets/map/ic_map_marker_self.png", new BMap.Size(34, 35));
        let mkr = new BMap.Marker(pointData, { icon: myLocation, enableMassClear: false });
        this.map.addOverlay(mkr);
        this.map.panTo(pointData);
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
            offset: new BMap.Size(-45, -65),
        }
        label = new BMap.Label(lblString + "<div class='contentContainer'><div>"
            + cluster.showName + "</div><div>" + cluster.culturalRelicCount + "</div></div></div>", option);
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
            this.caseCountTemp = cluster.caseCount == 0 ? 0 : cluster.caseDoingCount + "/" + cluster.caseCount;
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
                    myIcon = new BMap.Icon("assets/map/" + picName + "normal.png", new BMap.Size(34, 35));
                    lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'  name='selected'>";
                }
                else {
                    myIcon = new BMap.Icon("assets/map/" + picName + "normal.png", new BMap.Size(34, 35));
                    lblString = "<div id=" + cluster.uniqueTag + " class='positionContain'>";
                }
                marker = new BMap.Marker(pt, { icon: myIcon, })
                this.mapAddOverlay(lblString, this.caseCountTemp, this.patrolCountTemp, cluster, marker, picName);
            }
        }
    }

    private mapAddOverlay(lblString, caseCountTemp, patrolCountTemp, cluster, marker, picName) {
        let lblStringNew = lblString + "<div  style='border-bottom:1px solid #fff;padding:0.2em 0.4em;'>"
            + cluster.showName + "</div><div style='padding:0.2em 0.4em;'><span class='caseCountShow'>案件:" + caseCountTemp +
            "&nbsp;&nbsp;&nbsp;&nbsp;</span>巡查：" + patrolCountTemp + "</div></div>";
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
                // if(this.searchDataSource.)
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
        this.patrolCountTemp = cluster.patrolCount == 0 ? 0 : cluster.patrolDoingCount + "/" + cluster.patrolCount;
        let list, index;
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
            console.log(this.selectedMarkerTag);
            this.setIcon(this.selectedMarkerTag);
        }
    }

    //设置label下方的marker图标
    private setIcon(id) {
        let pImg = document.getElementById(id).parentNode.previousSibling.firstChild as HTMLElement;
        pImg.setAttribute("src", "assets/map/ic_cultural_relic_level1_selected.png");
    }
}
