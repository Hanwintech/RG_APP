import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
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

    private _canAddCultural: boolean;
    public get canAddCultural(): boolean { return this._canAddCultural; }
    public set canAddCultural(value) { this._canAddCultural = value; }

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
        super(navCtrl, file, fileTransfer, pageService,modalCtrl);
    }

    showKeywordSearchPage(keyword: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let searchModal = this.modalCtrl.create('CommonSimpleSearchPage', { "keyword": keyword });
            searchModal.onDidDismiss(data => {
                let needSearch = data ? data.needSearch : false;
                keyword = data ? data.keyword : keyword;
                resolve({ "needSearch": needSearch, "keyword": keyword });
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

    private _isLastPage: boolean;
    public get isLastPage(): boolean { return this._isLastPage; }
    public set isLastPage(value) { this._isLastPage = value; }

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public actionSheetCtrl: ActionSheetController,
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
        this._isLastPage = false;
    }

    nextPage(ionInfiniteScrollEvent) {
        if (!this._isLastPage) {
            this.condition.pageIndex = this._nextPageIndex++;
            this.getData(ionInfiniteScrollEvent, false);
        } else if (ionInfiniteScrollEvent) {
            ionInfiniteScrollEvent.complete();
            this.pageService.dismissLoading();
        }
    }

    getData(ionInfiniteScrollEvent, isNewSearch) {
        this.api.condition = this.condition;
        console.log(this.api.condition);
        this.apiService.sendApi(this.api).subscribe(
            res => {
                if (res.success) {
                    if (isNewSearch) {
                        this.dataList = [];
                        this._nextPageIndex = 1;
                    }
                    this.conditionDataSource = res.data[this.conditionDataSourceName];
                    //获取新一页的数据
                    let temp = res.data[this.dataListName] ? res.data[this.dataListName] : [];
                    for (let cr of temp) {
                        this.dataList.push(cr);
                    }

                    this._isLastPage = res.data.isLastPage

                    if (ionInfiniteScrollEvent) {
                        ionInfiniteScrollEvent.complete();
                    }
                } else {
                    //控制瀑布流控件状态
                    if (ionInfiniteScrollEvent) {
                        ionInfiniteScrollEvent.enable(false);
                    }
                    this.pageService.showErrorMessage(res.reason);
                }
                this.pageService.dismissLoading();
            },
            error => {
                if (ionInfiniteScrollEvent) {
                    ionInfiniteScrollEvent.enable(false);
                }
                this.pageService.dismissLoading();
                this.pageService.showErrorMessage(error);
            });
    }

    refreshDataList(ionRefreshEvent) {
        this.condition.pageIndex = 0;
        this.getData(null, true);
        ionRefreshEvent.complete();

    }

    showSimpleSearch() {
        this.pageService.showLoading("数据加载中...");
        super.showKeywordSearchPage(this.condition.keyword)
            .then(data => {
                if (data && data.needSearch) {
                    this.condition.keyword = data.keyword;
                    this.condition.isDefaultSearch = true;
                    this.condition.pageIndex = 0;        
                    this.getData(null, true);
                } else {
                    this.pageService.dismissLoading();
                }
            })
            .catch(error => {
                this.pageService.showErrorMessage(error);
            });
    }

    showSearch(searchPage: string) {
        console.log(this.conditionDataSource);
        super.showConditionalSearchPage(searchPage, { "search": this.condition, "dataSource": this.conditionDataSource })
            .then(data => {
                if (data && data.needSearch) {
                    this.condition = data.search;
                    this.condition.isDefaultSearch = false;
                    this.condition.pageIndex = 0;
                    this.condition.keyword = "";
                    this.getData(null, true);
                }
            })
            .catch(error => {
                this.pageService.showErrorMessage(error);
            });
    }

    defaultView(page: string, data: any) {
        this.navCtrl.push(page, data);
    }

    defaultAdd;

    defaultModify;

    defaultDelete;

    pressDataItem(dataItem) {
       if(this.canAddCultural){
        let actionSheet = this.actionSheetCtrl.create({
            title: '操作',
            buttons: [
                { text: '编辑', handler: () => { if (this.defaultModify) { this.defaultModify(dataItem); } } },
                { text: '删除', handler: () => { if (this.defaultModify) { this.defaultDelete(dataItem); } } }
            ]
        });
        actionSheet.present();
       }
    }
}