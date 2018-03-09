import { Platform, ToastController, LoadingController, Loading, ActionSheetController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class PageService {
    loading: Loading;

    constructor(
        private platform: Platform,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private actionSheetCtrl: ActionSheetController
    ) {
    }

    showLoading(message) {
        this.loading = this.loadingCtrl.create({
            content: message,
            dismissOnPageChange: true
        });
        this.loading.present();
    }

    dismissLoading() {
        if (this.loading) {
            this.loading.dismissAll();
        }
    }

    showMessage(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'toastText'
        });
        toast.present();
    }

    showErrorMessage(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: 'toastText'
        });
        toast.present();
    }

    showComfirmMessage(message, yesHandler, noHandler) {
        let actionSheet = this.actionSheetCtrl.create({
            title: message,
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: '确认',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'checkmark' : null,
                    handler: yesHandler
                }, {
                    text: '取消',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: noHandler
                }
            ]
        });
        actionSheet.present();
    }
}