import { BaseApiSearch } from "./../base-api-search.model";

export class LawFileInfoSearch extends BaseApiSearch {
    public userId:string;
    public manageUnitId:string;
    public userType:number;
    public pageSize:number;
    public pageIndex:number;
    public isNeedPaging:boolean;
    public keyword:string;
    public searchType:number;
    public isDefaultSearch:boolean;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() { }
}