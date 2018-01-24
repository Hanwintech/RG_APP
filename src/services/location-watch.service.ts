import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { PostUserCoordinateInfo } from './../apis/system/system.api';
import { UserLocationInfo } from './../models/system/user-location-info.model';

declare var BMap;
declare var BMAP_STATUS_SUCCESS;

@Injectable()
export class LocationWatchService {
    private _isWatching: boolean;
    public get isWatching(): boolean { return this._isWatching; }

    private _needAlert: boolean;

    private _baiduMapGeolocation;

    private _intervalId: number;

    constructor(
        public geolocation: Geolocation,
        public apiService: ApiService,
        public pageService: PageService
    ) {
        this._isWatching = false;
        this._needAlert = false;
        this._baiduMapGeolocation = new BMap.Geolocation();
        // this._baiduMapGeolocation.enableSDKLocation()
    }

    init() {
        this.geolocation.getCurrentPosition({ "timeout": 4000, "maximumAge": 5000 })
            .then(res => {
                console.log("1st time geolocation.getCurrentPosition()");
                console.log(res);
            })
            .catch(error => {
                console.log("1st time geolocation.getCurrentPosition() error");
                console.log(error);
            });

        this._baiduMapGeolocation.getCurrentPosition(
            res => {
                console.log("1st time baiduMap.getCurrentPosition()");
                console.log(res);
            }, { "timeout": 4000, "maximumAge": 5000 });
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
            this.geolocation.getCurrentPosition({ "timeout": 4000, "maximumAge": 5000 }).then(res => {
                if (res && res.coords) {
                    let pointArr = [new BMap.Point(res.coords.longitude, res.coords.latitude)];
                    new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
                        if (data.status === BMAP_STATUS_SUCCESS) {
                            localStorage.setItem('longitude', data.points[0].lng);
                            localStorage.setItem('latitude', data.points[0].lat);
                            this.uploadLocation();
                        } else {
                            localStorage.removeItem('longitude');
                            localStorage.removeItem('latitude');
                            this.startGetPositionByBaiduMap();
                        }
                    }.bind(this));
                } else {
                    localStorage.removeItem('longitude');
                    localStorage.removeItem('latitude');
                    this.getPositionByBaiduMap();
                }
            }).catch((error) => {
                localStorage.removeItem('longitude');
                localStorage.removeItem('latitude');
                this.getPositionByBaiduMap();
            });
        } else {
            this.stop();
        }
    }

    getPositionByBaiduMap() {
        this._baiduMapGeolocation.getCurrentPosition(res => {
            if (this._baiduMapGeolocation.getStatus() == 0) {
                let pointArr = [new BMap.Point(res.longitude, res.latitude)];
                new BMap.Convertor().translate(pointArr, 1, 5, function (data) {
                    if (data.status === BMAP_STATUS_SUCCESS) {
                        localStorage.setItem('longitude', data.points[0].lng);
                        localStorage.setItem('latitude', data.points[0].lat);
                        this.uploadLocation();
                    } else {
                        localStorage.removeItem('longitude');
                        localStorage.removeItem('latitude');
                    }
                }.bind(this));
            } else {
                localStorage.removeItem('longitude');
                localStorage.removeItem('latitude');
                if (this._needAlert) {
                    this.pageService.showErrorMessage("无法定位您的位置！");
                    this._needAlert = false;
                }
            }
        }, { "timeout": 4000, "maximumAge": 5000 });
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