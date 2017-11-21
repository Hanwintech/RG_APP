import { Injectable } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { Observable } from 'rxjs/Observable';

/**
 * BleService
 */
@Injectable()
export class BLEService {

    public get connectedDevice(): IBLEDevice {
        return JSON.parse(localStorage.getItem('connectedDevice'));
    }
    public set connectedDevice(v: IBLEDevice) {
        localStorage.setItem('connectedDevice', JSON.stringify(v));
    }

    constructor(
        private ble: BLE
    ) {

    }

    bleEnabled(): Promise<any> {
        return this.ble.isEnabled();
    }

    openBLE(): Promise<any> {
        return this.ble.enable();
    }

    scanDevice(): Observable<IBLEDevice> {
        return this.ble.scan([], 5);
    }

    connectDevice(device: IBLEDevice): Observable<IBLEDevice> {
        return this.ble.connect(device.id);
    }

}

export interface IBLEDevice {
    name: string;
    id: string;
    advertising: Array<number>;
    rssi: number;
}