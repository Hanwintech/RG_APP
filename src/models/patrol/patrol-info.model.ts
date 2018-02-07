import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { TreeDataInfo } from "./../tree-data-info.model";
import { CommonUserInfo } from "./../user-info.model";

export class PatrolInfoDetails {
    //巡查信息视图
    public patrolInfo: UVPatrolCaseInfo;
    //地区名称(举转名称)
    public enumAreaName: string;
    //文物级别名称(枚举名称)
    public culturalRelicLevelName: string;
    //巡查状态名称(枚举名称)
    public patrolStateName: string;
    //选中的问题情况
    public selectedCaseProblemList: number[];
    //问题情况集合
    public patrolCaseProblemList: UTPatrolCaseProblem[];
    //附件集合
    public attachmentList: Attachment[];
    public patrolImageUrl: string;
    // 当前用户对该巡查记录是否可处理
    public isCanDispose: boolean;


    constructor() {
        this.patrolInfo = new UVPatrolCaseInfo();
    }
}

export class UVPatrolCaseInfo {
    public keyID: string;
    public fK_ManageUnitID: string;
    public manageUnitName: string;
    public enumArea: number;
    public areaName: string;
    public district: number;
    public districtName: string;
    public fK_CulturalRelicID: string;
    public culturalRelicName: string;
    public location: string;
    public culturalRelicLevel: number;
    public culturalRelicCode: string;
    public patrolUserID: string;
    public patrolUser: string;
    public patroDate: string;
    public othersPeople: string;
    public patrolDescription: string;
    public patrolState: number;
    public problemDescription: string;
    public isImmediately: boolean;
    public processingResults: string;
    public permission: boolean;
    public approvalNumber: string;

    public coordinateX: number;
    public coordinateY: number;
    public remark: string;
    public adderID: string;
    public addDate: string;
    public updaterID: string;
    public updateDate: string;
    public isDeleted: boolean;
    public culturalRelicX: number;
    public culturalRelicY: number;

    public patrolImageName: string;

    public orderIndex: number;
}

export class UTPatrolCaseProblem {
    public id: string;
    public caseProblem: string;
    public sortIndex: number;
    public caseValue: number;
}

export class UVPatrolCaseProcess {
    public keyID: string;
    public patrolInfoID: string;
    public previousProcessID: string;
    public processResult: number;
    public processDescription: string;
    public transactUserID: string;
    public transactUser: string;
    public transactUserManageUnitID: string;
    public mobilePhone: string;
    public transactUserManageUnitName: string;
    public runState: number;
    public enumArea: number;
    public areaName: string;
    public district: number;
    public districtName: string;
    public fK_CulturalRelicID: string;
    public culturalRelicName: string;
    public location: string;
    public culturalRelicLevel: number;
    public culturalRelicCode: string;
    public patrolUserID: string;
    public patrolUser: string;
    public othersPeople: string;
    public patroDate: string;
    public patrolDescription: string;
    public patrolState: number;
    public problemDescription: string;
    public arriveDate: string;
    public processDate: string;
    public submitUserName: string;
    public submitUserManageUnitName: string;

}

export class UTPatrolCaseProces {
    /// 主键ID
    public id: string;
    public iDOracleRaw16: string;
    /// 巡查记录
    public fk_Patrol_CaseInfoID: string;
    public previousProcessID: string;
    public processResult: number;
    /// 处理结果（枚举）
    public currentProcess: number;
    /// 处理说明
    public processDescription: string;
    /// 处理人
    public transactUser: string;
    public transactUserManageUnitID: string;
    public submitUser: string;
    /// 所属部门
    public submitUserManageUnitID: string;
    /// 处理时间
    public submitDate: string;
    /// 处理状态（1: 未阅   2:未处理   3:已处理   4:已撤销  ）
    public runState: number
    /// 新增时间
    public addDate: string;
    /// 新增人
    public adderID: string;
    /// 更新时间
    public updateDate: string;
    /// 更新人
    public updaterID: string;
    /// 逻辑删除标记（0：可用）
    public isDeleted: boolean;

}

export class PatrolProcessInfo {
    /// 巡查处理信息
    public patrolCaseProcess: UTPatrolCaseProces;
    /// 巡查处理附件集合
    public attachmentList: Attachment[];
    /// 可选择的执法人员
    public canSelectLawUserInfoList: CommonUserInfo[];
    /// 可选择的巡查处理人员
    public canSelectPatrolUserInfoList: CommonUserInfo[];
    /// 处理结果集合
    public processResultList: IntegerKeyValue[];
    /// 选择的处理人员
    public selectedUserInfoList: CommonUserInfo[];
    /// 巡查计划中设置的默认执法处理人员
    public defaultLawUserInfoList: CommonUserInfo[];
}

export class PatrolProcessInfoDetails {
    public patrolCaseProcess: UVPatrolCaseProcess;
    public attachmentList: Attachment[];
}

export class PatrolInfo {
    public patrol: PatrolEntity;
    public attachmentList: Attachment[];
    public selectedCaseProblemList: number[];
    public selectedUserInfoList: CommonUserInfo[];
    //人员离文物点距离
    public personPointDistance: number;

    constructor() {
        this.patrol = new PatrolEntity();
        this.attachmentList = [];
        this.selectedCaseProblemList = [];
        this.selectedUserInfoList = [];
    }
}

export class PatrolEntity {
    public id: string;
    public fK_ManageUnitID: string;
    public fK_CulturalRelicID: string;
    public patrolUserID: string;
    public patroDate: string;
    public othersPeople: string;
    public patrolDescription: string;
    public patrolState: number;
    public problemDescription: string;
    public isImmediately: number;
    public processingResults: string;
    public coordinateX: number;
    public coordinateY: number;
    public remark: string;
    public adderID: string;
    public addDate: string;
    public updaterID: string;
    public updateDate: string;
    public isDeleted: boolean;
    public permission: boolean;
    public approvalNumber: string;

    constructor() {
        this.clearNumbers();
    }
    clearNumbers() {
        this.patrolState = -1;
    }
}

export class PatrolEditDataSource {
    public code: number;
    public message: string;
    public tag: string;
    public patrolCaseProblemList: UTPatrolCaseProblem[];
    public patrolStatusList: IntegerKeyValue[];
    public disposeTypeList: IntegerKeyValue[];
    public permissionList: IntegerKeyValue[];
    public canSelectUserInfoList: CommonUserInfo[];

    constructor() {
        this.patrolCaseProblemList = [];
        this.patrolStatusList = [];
        this.disposeTypeList = [];
        this.permissionList = [];
        this.canSelectUserInfoList = [];
    }
}

export class PatrolInfoSearch {
    public culturalRelicName: string;
    public patrolUserName: string;
    public startDateTime: string;
    public endDateTime: string;
    public othersPeople: string;
    public area: number;
    public district: number;
    public culturalRelicLevel: number;
    public manageUnitName: string;
    public patrolStatus: number;
    public disposeType: number;
    public pageSize: number;
    public pageIndex: number;
    public isNeedPaging: boolean;
    public keyword: string;
    public searchType: number;
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public isDefaultSearch: boolean;
    public culturalRelicID: string;
    public appRole: number[];

    public isMapShow: boolean;
    public leftTopCoordinateX: number;
    public leftTopCoordinateY: number;
    public rightBottomCoordinateX: number;
    public rightBottomCoordinateY: number;

    constructor() {
        this.clearNumbers();
    }
    public clearNumbers() {
        this.area = -1;
        this.culturalRelicLevel = -1;
        this.patrolStatus = -1;
        this.disposeType = -1;
        this.district = -1;
    }
}

export class PatrolInfoSearchDataSource {
    public code: number;
    public message: string;
    public tag: string;
    public areaList: IntegerKeyValue[];
    //所属子区域
    public districtList: TreeDataInfo[];
    public culturalRelicLevelList: IntegerKeyValue[];
    public patrolStatusList: IntegerKeyValue[];
    public disposeTypeList: IntegerKeyValue[];
}