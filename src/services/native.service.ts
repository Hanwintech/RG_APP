import { Injectable } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ApiService } from './api.service';
import { PageService } from './page.service';
import { NetworkInformationService } from './network-information.service';
import { GetAppVersionInfo } from './../apis/system/system.api';
import { AppVersionInfo } from './../models/system/app-version-info.model';

@Injectable()
export class NativeService {
    private _version: string;
    public get version(): string { return this._version; }

    private newVersionInfo: AppVersionInfo;

    constructor(
        public platform: Platform,
        public alertCtrl: AlertController,
        public transfer: FileTransfer,
        public appVersion: AppVersion,
        public file: File,
        public inAppBrowser: InAppBrowser,
        public apiService: ApiService,
        public pageService: PageService,
        public networkInfoService: NetworkInformationService
    ) { }

    /**
     * 检查app是否需要升级
     */
    detectionUpgrade() {
        //这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
        this.apiService.sendApi(new GetAppVersionInfo()).subscribe(
            res => {
                this.newVersionInfo = res.data;
                this.appVersion.getVersionNumber()
                    // 对应/config.xml中version的值
                    .then((value: string) => {
                        this._version = value;
                        if (this._version != this.newVersionInfo.appVersion) {
                            let message = "发现新版本,是否立即升级？";
                            if (this.networkInfoService.isConnected
                                &&
                                (this.networkInfoService.connectionType == "2g"
                                    ||
                                    this.networkInfoService.connectionType == "2g"
                                    ||
                                    this.networkInfoService.connectionType == "2g")

                            ) {
                                message += "（会产生数据流量）";
                            }
                            this.pageService.showComfirmMessage(
                                message,
                                () => { this.downloadApp(); },
                                () => { }
                            );
                        }
                    })
                    .catch(error => { this.pageService.showErrorMessage("检查APP当前版本出错！"); });
            },
            error => { this.pageService.showErrorMessage("检查APP最新版本出错！"); },
            () => { }
        );
    }

    /**
     * 下载安装app
     */
    downloadApp() {
        if (this.isAndroid()) {
            let alert = this.alertCtrl.create({
                title: '下载进度：0%',
                enableBackdropDismiss: false,
                buttons: ['后台下载']
            });
            alert.present();

            const fileTransfer: FileTransferObject = this.transfer.create();
            const apk = this.file.externalRootDirectory + this.newVersionInfo.attachmentList[0].fileShowName; //apk保存的目录

            fileTransfer.download(this.newVersionInfo.attachmentList[0].fileUrl, apk).then(() => {
                window['install'].install(apk.replace('file://', ''));
            });

            fileTransfer.onProgress((event: ProgressEvent) => {
                let num = Math.floor(event.loaded / event.total * 100);
                if (num === 100) {
                    alert.dismiss();
                } else {
                    let title = document.getElementsByClassName('alert-title')[0];
                    title && (title.innerHTML = '下载进度：' + num + '%');
                }
            });
        }
        if (this.isIos()) {
            this.openUrlByBrowser(this.newVersionInfo.attachmentList[0].fileUrl);
        }
    }

    /**
     * 通过浏览器打开url
     */
    openUrlByBrowser(url: string): void {
        this.inAppBrowser.create(url, '_system');
    }

    /**
     * 是否真机环境
     * @return {boolean}
     */
    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }

    /**
     * 是否android真机环境
     * @return {boolean}
     */
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    /**
     * 是否ios真机环境
     * @return {boolean}
     */
    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }
}