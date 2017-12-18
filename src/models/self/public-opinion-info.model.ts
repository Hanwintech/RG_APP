import { IntegerKeyValue } from "./../integer-key-value.model";
import { BaseApiSearch } from "./../base-api-search.model";
import { TreeDataInfo } from "./../tree-data-info.model";

export class UVPublicOpinion {
    public keyID: string;
    public subject: string;
    public type: number;
    public area: number;
    public district: number;
    public sourceOfInformation: string;
    public originalLink: string;
    public publishDate: string;
    public addDate: string;
    public adderID: string;
    public updateDate: string;
    public updaterID: string;
    public districtName: string;
    public publicOpinionTypeName: string;
}

export class PublicOpinionInfoSearch extends BaseApiSearch {
    //当前登录用户Id
    public userId: string;
    //当前登录用户所属管理单位Id
    public manageUnitId: string;
    //用户类型
    public userType: number;
    public subject: string;
    public area: number;
    public district: number;
    public type: number;
    public startDateTime: string;
    public endDateTime: string;
    public publicOpinionShowType: number;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() {
        this.area = -1;
        this.district = -1;
        this.type = -1;
    }
}

export class PublicOpinionInfoSearchDataSource {
    public typeList: IntegerKeyValue[];
    public areaList: IntegerKeyValue[];
    public districtList: TreeDataInfo[];
}