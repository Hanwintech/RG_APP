import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { BaseApiSearch } from "./../base-api-search.model";
import { TreeDataInfo } from "./../tree-data-info.model";

export class MuseumInfo {
    public museumDetailInfo: MuseumInfoDetail;
    public miniImageUrl: string;
    public attachmentList: Attachment[];

    constructor() {
        this.museumDetailInfo = new MuseumInfoDetail();
    }
}

export class MuseumInfoDetail {
    //主键ID
    public id: string;
    //名称
    public museumName: string;
    //质量等级名称
    public qualityGradeName: string;
    //所属区域
    public enumAreaName: string;
    //子区域名称
    public districtName: string;
    //地址
    public location: string;
    //缩略图
    public miniImage: string;
    //坐标X
    public coordinateX: number;
    //坐标Y
    public coordinateY: number;
    //电话号码
    public telephone: string;
    //传真
    public fax: string;
    //网址地址
    public websiteURL: string;
    //官方微博名
    public officialBlogName: string;
    //微信公众号
    public weiXinAccount: string;
    //藏品数量
    public collectionQuantity: number;
    //基本成列名称
    public basicDisplayName: string;
    //描述
    public remark: string;
    //排序字段
    public sortIndex: number;
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
    //不可移动文物外键ID
    public fk_CulturalRelicID: string;
    //标注类型
    public coordinateType: string;
    //质量等级
    public qualityGrade: number;
    //标注精确度
    public coordinateAccurate: number;
    //标注精确度名称
    public coordinateAccurateName: string;

    public patrolCount: number;
    public patrolCountProcessing: number;
    public caseCount: number;
    public caseCountProcessing: number;
}

export class MuseumPostInfo {
    public museumInfo: MuseumInfoEntity;
    //执行新增/编辑的用户Id
    public userId: string;
    public miniImage: Attachment;
    public attachmentList: Attachment[];
    public areaList: IntegerKeyValue[];
    public districtList: TreeDataInfo[];
    public qualityGradeList: IntegerKeyValue[];
    public coordinateAccurateList: IntegerKeyValue[];

    public patrolCount: number;
    public patrolCountProcessing: number;
    public caseCount: number;
    public caseCountProcessing: number;

    constructor() {
        this.museumInfo = new MuseumInfoEntity();
    }
}
export class MuseumInfoEntity {
    public id: string;
    public museumName: string;
    public qualityGrade: number;
    public enumArea: number;
    public district: number;
    public location: string;
    public miniImage: string;
    public coordinateX: number;
    public coordinateY: number;
    public coordinateAccurate: number;
    public telephone: string;
    public fax: string;
    public websiteURL: string;
    public officialBlogName: string;
    public weiXinAccount: string;
    public collectionQuantity: number;
    public basicDisplayName: string;
    public remark: string;
    public sortIndex: number;
    public addDate: string;
    public adderID: string;
    public updateDate: string;
    public updaterID: string;
    public isDeleted: boolean;
    public fK_CulturalRelicID: string;

    constructor() {
       this.clearNumbers();
    }
    public clearNumbers() {
        this.qualityGrade = -1;
        this.enumArea = -1;
        this.district = -1;
        this.coordinateAccurate = -1;
    }
}

export class MuseumInfoSearch extends BaseApiSearch {
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public museumName: string;
    public location: string;
    public remark: string;
    public area: number;
    public district: number;
    public qualityGrade: number;
    public mapLabelStatus: number;
    public coordinateAccurate: number;
    public currentLongitude: number;
    public currentLatitude: number;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() {
        this.area = -1;
        this.district = -1;
        this.qualityGrade = -1;
        this.mapLabelStatus = -1;
        this.coordinateAccurate = -1;
    }
}

export class MuseumInfoSearchDataSource {
    //所属区域
    public areaList: IntegerKeyValue[];
    //所属子区域
    public districtList: TreeDataInfo[];
    //质量等级
    public qualityGradeList: IntegerKeyValue[];
    //地图标注情况
    public mapLabelStatusList: IntegerKeyValue[];
    //地图标注精确度
    public coordinateAccurateList: IntegerKeyValue[];
}