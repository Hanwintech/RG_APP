import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { PostUserCoordinateInfo } from './../apis/system/system.api';
import { UserLocationInfo } from './../models/system/user-location-info.model';

declare var BMap;
declare var baidumap_location;
declare var BMAP_STATUS_SUCCESS;

@Injectable()
export class LocationWatchService {
    private _isWatching: boolean;
    public get isWatching(): boolean { return this._isWatching; }

    private _needAlert: boolean;

    private _baiduMapGeolocation;

    private _intervalId: number;

    constructor(
        public device: Device,
        public apiService: ApiService,
        public pageService: PageService,
        public geolocation: Geolocation
    ) {
        this._isWatching = false;
        this._needAlert = false;
        this._baiduMapGeolocation = new BMap.Geolocation();
    }

    init() {
        if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
            console.log(baidumap_location);
            baidumap_location.getCurrentPosition(
                positionData => {
                    let pointArr = [new BMap.Point(positionData.longitude, positionData.latitude)];
                    new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
                        if (data.status === BMAP_STATUS_SUCCESS) {
                            localStorage.setItem('bdLongitude', data.points[0].lng);
                            localStorage.setItem('bdLatitude', data.points[0].lat);
                            localStorage.setItem('longitude', localStorage.getItem('bdLongitude'));
                            localStorage.setItem('latitude', localStorage.getItem('bdLatitude'));
                        }
                    }.bind(this));
                    console.log("1st time baidu_location.getCurrentPosition()");
                    console.log(positionData);
                },
                error => {
                    console.log("1st time baidu_location.getCurrentPosition() error");
                    console.log(error);
                });
        } else {
            this._baiduMapGeolocation.getCurrentPosition(
                res => {
                    if (this._baiduMapGeolocation.getStatus() == 0) {
                        let pointArr = [new BMap.Point(res.longitude, res.latitude)];
                        new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
                            if (data.status === BMAP_STATUS_SUCCESS) {
                                localStorage.setItem('bdLongitude', data.points[0].lng);
                                localStorage.setItem('bdLatitude', data.points[0].lat);
                                localStorage.setItem('longitude', localStorage.getItem('bdLongitude'));
                                localStorage.setItem('latitude', localStorage.getItem('bdLatitude'));
                            }
                        }.bind(this));
                    }
                    console.log("1st time baiduMap.getCurrentPosition()");
                    console.log(res);
                }, { "timeout": 4000, "maximumAge": 5000 });
        }
    }
    
    start() {
        this._isWatching = true;
        this._needAlert = true;

        this.getPosition();
        this._intervalId = setInterval(() => { this.getPosition(); }, 5000);
    }

    stop() {
        this._isWatching = false;

        clearInterval(this._intervalId);
        localStorage.removeItem('longitude');
        localStorage.removeItem('latitude');
    }

    getPosition() {
        if (this._isWatching && localStorage.getItem('userId')) {
            if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
                baidumap_location.getCurrentPosition(
                    positionData => {
                        this.convertAndSave(positionData.longitude, positionData.latitude);
                        console.log("baidumap_location");
                        console.log(positionData);
                    },
                    error => {
                        this.getPositionByNativeGeolocation();
                        console.log("baidumap_location error");
                        console.log(error);
                    });
            } else {
                this.getPositionByNativeGeolocation();
            }
        } else {
            this.stop();
        }
    }

    getPositionByNativeGeolocation() {
        this.geolocation.getCurrentPosition().then((resp) => {
            this.convertAndSave(resp.coords.longitude, resp.coords.latitude);
        }).catch((error) => {
            localStorage.setItem('longitude', localStorage.getItem('bdLongitude'));
            localStorage.setItem('latitude', localStorage.getItem('bdLatitude'));
        });
    }

    convertAndSave(longitude, latitude) {
        let pointArr = [new BMap.Point(longitude, latitude)];
        new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
            if (data.status === BMAP_STATUS_SUCCESS) {
                localStorage.setItem('longitude', data.points[0].lng);
                localStorage.setItem('latitude', data.points[0].lat);
                this.uploadLocation();
            } else {
                localStorage.setItem('longitude', localStorage.getItem('bdLongitude'));
                localStorage.setItem('latitude', localStorage.getItem('bdLatitude'));
            }
        }.bind(this));
    }

    uploadLocation() {
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