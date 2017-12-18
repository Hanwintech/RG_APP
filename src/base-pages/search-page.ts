import { NavParams, ViewController } from 'ionic-angular';

export class SearchPage<TSearch, TSearchDataSource> {
    private _search: TSearch;
    public get search(): TSearch { return this._search; }
    public set search(value) { this._search = value; }

    private _searchDataSource: TSearchDataSource;
    public get searchDataSource(): TSearchDataSource { return this._searchDataSource }

    constructor(public params: NavParams, public viewCtrl: ViewController) {
        this._search = params.data.search;
        this._searchDataSource = params.data.dataSource;
    }

    close() {
        this.viewCtrl.dismiss({ "needSearch": false });
    }

    doSearch() {
        this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
    }
}