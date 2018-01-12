import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { PostUserCoordinateInfo } from './../apis/system/system.api';
import { UserLocationInfo } from './../models/system/user-location-info.model';

declare var BMap;

@Injectable()
export class LocationWatchService {
    private _isWatching: boolean;
    public get isWatching(): boolean { return this._isWatching; }

    private _geoPosition: Subscription
    constructor(
        public geolocation: Geolocation,
        public apiService: ApiService,
        public pageService: PageService
    ) {
        this._isWatching = false;
    }

    start() {
        // localStorage.setItem('longitude', '120.78877004348');
        // localStorage.setItem('latitude', '31.346248778536');

        this._isWatching = true;
        this._geoPosition = this.geolocation.watchPosition().subscribe(
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

    stop() {
        this._isWatching = false;
        if (this._geoPosition) { this._geoPosition.unsubscribe(); }
        localStorage.removeItem('longitude');
        localStorage.removeItem('latitude');
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