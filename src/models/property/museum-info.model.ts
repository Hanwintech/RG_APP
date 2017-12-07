import { Attachment } from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { BaseApiSearch } from "./../base-api-search.model";
import { TwoLineInfo, UTMapDistrictCluster } from "./../two-line/two-line-info.model";
import { TreeDataInfo } from "./../tree-data-info.model";
import { SystemConst } from './../../services/system-const.service';

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