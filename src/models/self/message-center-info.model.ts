import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { BaseApiSearch } from "./../base-api-search.model";
import { TreeDataInfo } from "./../tree-data-info.model";

// export class MessageCenterInfos {

//     public search: MessageCenterInfoSearch;
//     public messageCenterInfoSearchDataSource: MessageCenterInfoSearchDataSource;
//     public totalCount: number;
//     public isLastPage: boolean;
//     public code: number;
//     public message: string;
//     public tag: string;
//     public messageCenterInfoList: MessageCenterInfo[];
// }

export class MessageCenterInfo {
    public messageCenter: MessageCenterEntity;
}

export class MessageCenterEntity {
    public keyID: string;
    public fK_UserID: string;
    public readUser: string;
    public readState: number;
    public readStateName: string;
    public readTime: string;
    public msgCenterID: string;
    public messageType: number;
    public messageTypeName: string;
    public businessID: string;
    public messageTitle: string;
    public messageContent: string;
    public addManageUnitID: string;
    public addManageUnitName: string;
    public adderID: string;
    public adder: string;
    public addDate: string;
    public remark: string;
    public dealTime: string;
    public isPushed: boolean;
    public operationType: number;
    public finishedDate: string;
    public finishedUserID: string;
    public orderIndex: number;
}
export class MessageCenterInfoSearch extends BaseApiSearch {
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public startDateTime: string;
    public endDateTime: string;
    public readState: number;
    public messageType: number;
    public addManageUnitName: string;
    public adderName: string;
    public messageTitle: string;
    public messageContent: string;
    public messageOperationType: number;
    public messageShowType: number;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() {
        this.readState = -1;
        this.messageType = -1;
    }
}

export class MessageCenterInfoSearchDataSource {
    public messageTypeList: IntegerKeyValue[];
    public readStateList: IntegerKeyValue[];
    public messageOperationTypeList: IntegerKeyValue[];
}