import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { NetworkInformationService } from './../services/network-information.service';
import { PostUserCoordinateInfo } from './../apis/system/system.api';
import { UserLocationInfo } from './../models/system/user-location-info.model';

declare var BMap;
declare var baidumap_location;
declare var BMAP_STATUS_SUCCESS;
declare var BaiduGeolocation: any;

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
        public networkInformationService: NetworkInformationService
    ) {
        this._isWatching = false;
        this._needAlert = false;
        this._baiduMapGeolocation = new BMap.Geolocation();
    }

    init() {
        localStorage.removeItem('longitude');
        localStorage.removeItem('latitude');
        if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
            BaiduGeolocation.startWatch(
                positionData => {
                    localStorage.setItem('bdLongitude', positionData.longitude);
                    localStorage.setItem('bdLatitude', positionData.latitude);
                    localStorage.setItem('longitude', positionData.longitude);
                    localStorage.setItem('latitude', positionData.latitude);
                    localStorage.setItem('accuracy', positionData.radius);
                },
                error => {

                });
        }
    }

    start() {
        this._isWatching = true;
        this._needAlert = true;
        this.getPosition();
    }

    stop() {
        this._isWatching = false;
        if (this.device.platform == 'Android' || this.device.platform == 'iOS') { BaiduGeolocation.stopWatch(); }
        localStorage.removeItem('longitude');
        localStorage.removeItem('latitude');
        localStorage.removeItem('accuracy');
    }

    getPosition() {
        if (this._isWatching && localStorage.getItem('userId')) {
            if (this.device.platform == 'Android' || this.device.platform == 'iOS') {
                BaiduGeolocation.startWatch(
                    positionData => {
                        localStorage.setItem('bdLongitude', positionData.longitude);
                        localStorage.setItem('bdLatitude', positionData.latitude);
                        localStorage.setItem('longitude', positionData.longitude);
                        localStorage.setItem('latitude', positionData.latitude);
                        localStorage.setItem('accuracy', positionData.radius);
                        this.uploadLocation(JSON.stringify(positionData));
                    },
                    error => {
                    });
            }
        } else {
            this.stop();
        }
    }

    uploadLocation(msg) {
        if (this.networkInformationService.isConnected) {
            let location: UserLocationInfo = new UserLocationInfo();
            location.userId = localStorage.getItem('userId');
            location.longitude = localStorage.getItem('longitude');
            location.latitude = localStorage.getItem('latitude');
            location.message = msg;
            this.apiService.sendApi(new PostUserCoordinateInfo(location)).subscribe(
                res => {
                },
                error => { },
                () => { }
            );
        }
    }
}
