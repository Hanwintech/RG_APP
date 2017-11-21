import { ToastController, LoadingController, Loading } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class PageService {
    loading: Loading;

    constructor(private toastCtrl: ToastController,
        public loadingCtrl: LoadingController) {
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
            position: 'bottom'
        });
        toast.present();
    }
}