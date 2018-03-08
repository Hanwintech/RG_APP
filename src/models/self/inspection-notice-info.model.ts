import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { BaseApiSearch } from "./../base-api-search.model";

export class InspectionNoticeInfo {
    public userId: string;
    public manageUnitId: string;
    //督察通知信息实体
    public inspectorNotice: UVInspectorNotice;
    //状态名称
    public recordStateName: string;
    //附件集合
    public attachmentList: Attachment[];
}

export class UVInspectorNotice {
    //督察通知主键
    public keyID: string;
    //接收单位Id
    public toManageUnitID: string;
    //接收单位名称
    public toManageUnitName: string;
    //文件编号
    public fileNumber: string;
    //文件主题
    public fileTitle: string;
    //文物ID
    public fK_CulturalRelicID: string;
    //文物名称
    public culturalRelicName: string;
    //状态
    public recordState: number;
    //情况描述
    public situationDescription: string;
    //发送单位Id
    public fromManageUnitID: string;
    //发送单位名称
    public fromManageUnitName: string;
    //发送人员Id
    public fromPeople: string;
    //发送人员名称
    public fromPeopleName: string;
    //发送时间
    public fromTime: string;
    //回复内容
    public replyContent: string;
    //回复人员Id
    public replyUserID: string;
    //回复人员名称
    public replyUserName: string;
    //回复时间
    public replyTime: string;
    //备注
    public remark: string;
    //添加日期
    public addDate: string;
    //添加人员
    public adderID: string;
    //更新日期
    public updateDate: string;
    //更新人员
    public updaterID: string;
    //逻辑删除标记
    public isDeleted: boolean;
}

export class InspectionNoticeInfoSearch extends BaseApiSearch {
    //是否自己发送的
    public isSend: boolean;
    //当前登录用户Id
    public userId: string;
    //当前登录用户所属管理单位Id
    public manageUnitId: string;
    //用户类型
    public userType: number;
    //发送开始时间
    public startDateTime: string;
    //发送结束时间
    public endDateTime: string;
    //状态
    public recordState: number;
    //发送单位
    public fromManageUnitName: string;
    //文物名称
    public culturalRelicName: string;
    //主题
    public fileTitle: string;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() {
        this.recordState = -1;
    }
}

export class InspectionNoticeInfoSearchDataSource {
    public recordStateList: IntegerKeyValue[];
}