export class BaseApiSearch {
    // 每个数据量
    public pageSize: number;
    // 当前索引
    public pageIndex: number;
    // 是否需要分页
    public isNeedPaging: boolean;
    // 查询关键字(用于模糊查询)
    public keyword: string;
    // 查询方式
    public searchType: number;
    // 是否默认查询条件
    public isDefaultSearch: boolean;
    public isNeedSearchDataSource: boolean;

    constructor() {
        this.pageIndex = 0;
        this.pageSize = 10;
        this.isNeedPaging = true;
        this.isNeedSearchDataSource = true;
    }
}