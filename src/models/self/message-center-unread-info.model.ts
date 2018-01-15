import { IntegerKeyLongValue } from "./../integer-key-value.model";

export class MessageCenterUnreadInfo {
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public messageShowTypeList: IntegerKeyLongValue[];
}