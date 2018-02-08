import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

import { PageService } from './page.service';

@Injectable()
export class NetworkInformationService {
    private _isConnected: boolean;
    public get isConnected(): boolean { return this._isConnected; }

    private _connectionType: string;
    public get connectionType(): string { return this._connectionType; }

    private _disconnectSubscription;
    private _connectSubscription;
    private _changeSubscription;

    constructor(public network: Network, public pageService: PageService) {
        this._isConnected = (this.network.type == "ethernet"
            || this.network.type == "wifi"
            || this.network.type == "2g"
            || this.network.type == "3g"
            || this.network.type == "4g");
        this._connectionType = this.network.type;

        this._disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            this._isConnected = false;
            this._connectionType = "none";
            this.pageService.showMessage("网络已断开");
        });

        this._connectSubscription = this.network.onConnect().subscribe(() => {
            this._isConnected = true;
            this._connectionType = this.network.type;
            this.pageService.showMessage("网络已连接");
        });

        // this._changeSubscription = this.network.onchange().subscribe(() => {
        //     this._isConnected = true;
        //     this._connectionType = this.network.type;
        // });
    }
}