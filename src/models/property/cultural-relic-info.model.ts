import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { TwoLineInfo, UTMapDistrictCluster } from "./../two-line/two-line-info.model";
import { TreeDataInfo } from "./../tree-data-info.model";

export class CulturalRelicInfo {
    public culturalRelic: CulturalRelicInfoDetail;
    public upCulturalRelic: UPGetCulturalRelicInfos;
    public enumAreaName: string;
    public miniImage: Attachment;
    public miniImageUrl: string;
    public attachmentList: Attachment[];
    public twoLimitTabTypeName: string;
    public twoLimitAttachmentList: Attachment[];
    public twoLineInfoList: TwoLineInfo[];
    public coordinateAccurateList: IntegerKeyValue[];
    public twoLimitImageList: Attachment[];
}

export class CulturalRelicInfoDetail {
    public keyID: string;
    public culturalRelicName: string;
    public culturalRelicCode: string;
    public enumArea: number;
    public district: number;
    public districtName: string;
    public location: string;
    public culturalRelicLevel: number;
    public levelName: string;
    public statisticsTime: string;
    public culturalRelicType: number;
    public culturalRelicTypeName: string;
    public culturalRelicTwoStageType: number;
    public culturalRelicTwoStageTypeName: string;
    public manageUnitName: string;
    public miniImage: string;
    public coordinateX: number;
    public coordinateY: number;
    public coordinateTypeName: string;
    public coordinateType: number;
    public coordinateAccurateName: string;
    public remark: string;
    public sortIndex: number;
    public addDate: string;
    public adderID: string;
    public adderName: string;
    public updateDate: string;
    public updaterID: string;
    public updaterName: string;
    public twoLimitTabType: number;
    public protectionRange: string;
    public constructionControl: string;
    public iconAttachmentID: string;
    public twoLimitIconAttachmentID: string;
    public iconFileName: string;
    public patrolCount: number;
    public patrolCountProcessing: number;
    public caseCount: number;
    public caseCountProcessing: number;
    public twoLimitCulturalRelicID: string;
}

export class UPGetCulturalRelicInfos {
    public culturalRelicID: string;
    public culturalRelicName: string;
    public culturalRelicLevel: number;
    public remark: string;
    public enumArea: number;
    public district: number;
    public districtName: string;
    public iconFileName: string;
    public businessID: string;
    public culturalRelicType: number;
    public culturalRelicTwoStageType: number;
    public distance: number;
    public sortOrder: number;
    public totalCount: number;
    public coordinateX: number;
    public coordinateY: number;
}

export class CulturalRelicInfoSearch {
    public pageSize: number;
    public pageIndex: number;
    public isNeedPaging: boolean;
    public isNeedSearchDataSource: boolean;
    public keyword: string;
    public searchType: number;
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public isDefaultSearch: boolean;
    public culturalRelicName: string;
    public culturalRelicCode: string;
    public location: string;
    public statisticsTime: string;
    public manageUnitName: string;
    public remark: string;
    public culturalRelicLevel: number;
    public area: number;
    public district: number;
    public culturalRelicType: number;
    public culturalRelicTwoStageType: number;
    public mapLabelStatus: number;
    public coordinateAccurate: number;
    public isAll: boolean;
    public mapLevel: number;
    public leftTopCoordinateX: number;
    public leftTopCoordinateY: number;
    public rightBottomCoordinateX: number;
    public rightBottomCoordinateY: number;
    public culturalRelicSearchType: number;
    public startDate: string;
    public endDate: string;

    public distance: number;
    public twoLimitTabType: number;
    public currentLongitude: number;
    public currentLatitude: number;

    public culturalRelicLevelName: string;
    public areaName: string;
    public districtName: string;
    public districtCoordinateX: number;
    public districtCoordinateY: number;

    constructor() {
        this.clearNumbers();
    }
    public clearNumbers() {
        this.culturalRelicLevel = -1;
        this.area = -1;
        this.district = -1;
        this.culturalRelicType = -1;
        this.culturalRelicTwoStageType = -1;
        this.mapLabelStatus = -1;
        this.coordinateAccurate = -1;
    }
}

export class CulturalRelicInfoSearchDataSource {
    //级别
    public culturalRelicLevelList: IntegerKeyValue[];
    //所属区域
    public areaList: IntegerKeyValue[];
    //所属子区域
    public districtList: TreeDataInfo[];
    //分类
    public culturalRelicTypeList: IntegerKeyValue[];
    /// 二级分类
    public culturalRelicTwoStageTypeList: TreeDataInfo[];
    //地图标注情况
    public mapLabelStatusList: IntegerKeyValue[];
    //标注精确度
    public coordinateAccurateList: IntegerKeyValue[];
    //两线标注情况
    public twoLimitTabTypeList: IntegerKeyValue[];

    public mapDistrictClusterList: UTMapDistrictCluster[];
}