import { NavParams, ViewController } from 'ionic-angular';
import { SearchModel } from './../models/interface/search-model.interface';

export class SearchPage<TSearch extends SearchModel , TSearchDataSource> {
    private _search: TSearch;
    public get search(): TSearch { return this._search; }
    public set search(value) { this._search = value; }

    private _searchDataSource: TSearchDataSource;
    public get searchDataSource(): TSearchDataSource { return this._searchDataSource }

    constructor(public params: NavParams, public viewCtrl: ViewController) {
        this._search = <TSearch>JSON.parse(JSON.stringify(params.data.search));
        this._search.clearNumbers = params.data.search.clearNumbers;
        this._searchDataSource = params.data.dataSource;
    }

    close() {
        this.viewCtrl.dismiss({ "needSearch": false });
    }

    beforeSearch;

    doSearch() {
        if (this.beforeSearch && !this.beforeSearch()) { return; }
        this.viewCtrl.dismiss({ "needSearch": true, "search": this.search });
    }
}