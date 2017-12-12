import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { BaseApiSearch } from "./../base-api-search.model";

export class NoticeInfo {
    public noticeInfoDetails: UVNoticeBasicInfo;
    public attachmentList: Attachment[];
}

export class UVNoticeBasicInfo {
    public keyID: string;
    public infoCategory: number;
    public infoCategoryName: string;
    public title: string;
    public briefIntroduction: string;
    public sendDept: string;
    public sendDeptName: string;
    public sendDate: string;
    public noticeLevel: number;
    public noticeLevelName: string;
    public limitedDate: string;
    public noticeText: string;
    public sendRange: number;
    public sendRangeName: string;
    public readTimes: number;
    public state: number;
    public addDate: string;
    public adderID: string;
    public adderName: string;
    public relatedDepartmentNames: string;
    public updateDate: string;
    public updaterID: string;
}

export class NoticeInfoSearch extends BaseApiSearch {
    //当前登录用户Id
    public userId: string;
    //当前登录用户所属管理单位Id
    public manageUnitId: string;
    //用户类型
    public userType: number;
    public infoCategory: number;
    public noticeLevel: number;
    public sendRange: number;
    public title: string;
    public briefIntroduction: string;
    public sendDeptName: string;
    public relatedDepartmentName: string;
    public sendDateStart: string;
    public sendDateEnd: string;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() {
        this.infoCategory = -1;
        this.noticeLevel = -1;
        this.sendRange = -1;
    }
}

export class NoticeInfoSearchDataSource {
    //公告类别
    public infoCategoryList: IntegerKeyValue[];
    //公告等级
    public noticeLevelList: IntegerKeyValue[];
    //发送范围
    public sendRangeList: IntegerKeyValue[];
}