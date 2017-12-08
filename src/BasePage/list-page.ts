import { NavController, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { BasePage } from "./base-page";
import { PageService } from './../services/page.service';
import { SystemConst } from './../services/system-const.service';

export class ListPage extends BasePage {
    private _nextPageIndex: number;
    public get nextPageIndex(): number { return this._nextPageIndex; }
    public set nextPageIndex(value) { this._nextPageIndex = value; }

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public file: File,
        public fileTransfer: FileTransfer,
        public pageService: PageService,
        public systemConst: SystemConst
    ) {
        super(navCtrl, file, fileTransfer, pageService);

        this._nextPageIndex = this.systemConst.DEFAULT_PAGE_INDEX;
    }

    showKeywordSearchPage(keyword: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let searchModal = this.modalCtrl.create('CommonSimpleSearchPage', { "keyword": keyword });
            searchModal.onDidDismiss(data => {
                resolve({ "needSearch": data.needSearch, "keyword": data.keyword });
            });
            searchModal.present();
        });
    }

    showConditionalSearchPage(component: any, data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let searchModal = this.modalCtrl.create(component, data);
            searchModal.onDidDismiss(data => {
                resolve(data);
            });
            searchModal.present();
        });
    }
}