import { NavController, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { GetListAPI } from "./../apis/get-list-api.api";
import { BasePage } from "./base-page";
import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { SystemConst } from './../services/system-const.service';

export class ListBasePage extends BasePage {
    private _condition: any;
    public get condition(): any { return this._condition; }
    public set condition(value) { this._condition = value; }

    private _conditionDataSource: any;
    public get conditionDataSource(): any { return this._conditionDataSource; }
    public set conditionDataSource(value) { this._conditionDataSource = value; }

    private _dataList: any[];
    public get dataList(): any[] { return this._dataList; }
    public set dataList(value) { this._dataList = value; }

    private _api: GetListAPI;
    public get api(): GetListAPI { return this._api; }
    public set api(value) { this._api = value; }

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public file: File,
        public fileTransfer: FileTransfer,
        public pageService: PageService,
        public systemConst: SystemConst,
        public conditionDataSourceName: string,
        public dataListName: string
    ) {
        super(navCtrl, file, fileTransfer, pageService);
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

export class PagingListPage extends ListBasePage {
    private _nextPageIndex: number;
    public get nextPageIndex(): number { return this._nextPageIndex; }
    public set nextPageIndex(value) { this._nextPageIndex = value; }

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public file: File,
        public fileTransfer: FileTransfer,
        public apiService: ApiService,
        public pageService: PageService,
        public systemConst: SystemConst,
        public conditionDataSourceName: string,
        public dataListName: string
    ) {
        super(navCtrl, modalCtrl, file, fileTransfer, pageService, systemConst, conditionDataSourceName, dataListName);

        this._nextPageIndex = this.systemConst.DEFAULT_PAGE_INDEX;
    }

    nextPage(ionInfiniteScrollEvent) {
        this.condition.pageIndex = this._nextPageIndex++;
        this.getData(ionInfiniteScrollEvent, false);
    }

    getData(ionInfiniteScrollEvent, isNewSearch) {
        this.api.condition = this.condition;
        this.apiService.sendApi(this.api).subscribe(
            res => {
                if (res.success) {
                    if (isNewSearch) {
                        this.dataList = [];
                        this._nextPageIndex = 0;
                    }
                    this.conditionDataSource = res.data[this.conditionDataSourceName];
                    //获取新一页的数据
                    let temp = res.data[this.dataListName] ? res.data[this.dataListName] : [];
                    for (let cr of temp) {
                        this.dataList.push(cr);
                    }

                    //控制瀑布流控件状态
                    if (ionInfiniteScrollEvent) {
                        if (res.data.isLastPage) {
                            ionInfiniteScrollEvent.enable(false);
                        } else {
                            ionInfiniteScrollEvent.complete();
                        }
                    }
                } else {
                    if (ionInfiniteScrollEvent) {
                        ionInfiniteScrollEvent.enable(false);
                    }
                    this.pageService.showErrorMessage(res.reason);
                }
            },
            error => {
                if (ionInfiniteScrollEvent) {
                    ionInfiniteScrollEvent.enable(false);
                }
                this.pageService.showErrorMessage(error);
            });
    }


    showSimpleSearch() {
        super.showKeywordSearchPage(this.condition.keyword)
            .then(data => {
                if (data.needSearch) {
                    this.condition.keyword = data.keyword;
                    this.condition.isDefaultSearch = true;
                    this.getData(null, true);
                }
            })
            .catch(error => {
                this.pageService.showErrorMessage(error);
            });
    }

    showSearch(searchPage: string) {
        super.showConditionalSearchPage(searchPage, { "search": this.condition, "dataSource": this.conditionDataSource })
            .then(data => {
                if (data.needSearch) {
                    this.condition = data.search;
                    this.condition.isDefaultSearch = false;
                    this.condition.keyword = "";
                    this.getData(null, true);
                }
            })
            .catch(error => {
                this.pageService.showErrorMessage(error);
            });
    }
}