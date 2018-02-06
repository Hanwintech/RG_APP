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
        //     this.geolocation.getCurrentPosition().then((resp) => {
        //         console.log(resp.coords.latitude);
        //         console.log(resp.coords.longitude);
        //         // resp.coords.latitude
        //         // resp.coords.longitude
        //     }).catch((error) => {
        //         console.log('Error getting location', error);
        //     });

        //     let watch = this.geolocation.watchPosition();
        //     watch.subscribe((data) => {
        //         // data can be a set of coordinates, or an error (if an error occurred).
        //         // data.coords.latitude
        //         // data.coords.longitude
        //         console.log(data.coords.longitude + '' + data.coords.latitude);
        //     });
        //    //watch.unsubscribe();
        }
    }
 
    start() {
        this._isWatching = true;
        this._needAlert = true;

        //this.getPosition();
        //this._intervalId = setInterval(() => { this.getPosition(); }, 5000);
    }

    stop() {
        this._isWatching = false;

        clearInterval(this._intervalId);
        localStorage.removeItem('longitude');
        localStorage.removeItem('latitude');
    }

}