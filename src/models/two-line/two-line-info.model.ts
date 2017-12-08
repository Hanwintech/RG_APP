export class TwoLineInfo {
    public twoLinePolygon: UTCulturalRelicPolygon;
    public twoLinePointList: UTCulturalRelicPoint[];
}

export class UTCulturalRelicPolygon {
    public id: string;
    public fk_CulturalRelicID: string;
    public polygonType: number;
    public color: string;
    public remark: string;
    public addDate: string;
    public adderID: string;
    public updateDate: string;
    public updaterID: string;
    public isDeleted: boolean;
}

export class UTCulturalRelicPoint {
    public id: string;
    public fk_PolygonID: string;
    public x: number;
    public y: number;
    public sortIndex: number;
}

export class UTMapDistrictCluster {
    public id: string;
    public enumArea: number;
    public district: number;
    public districtType: number;
    public pCMapLevelMin: number;
    public pCMapLevelMax: number;
    public appMapLevelMin: number;
    public appMapLevelMax: number;
    public coordinateX: number;
    public coordinateY: number;
    public parentDistrict: number;
    public hasChildDistrict: boolean;
    public remark: string;
    public addDate: string;
    public adderID: string;
    public updateDate: string;
    public updaterID: string;
    public isDeleted: boolean;
}

export class UTMapDistrictClusterInfo {
    businessID:number
    caseCount:number
    caseDoingCount:number
    coordinateX:number
    coordinateY:number
    culturalRelicCount:number
    culturalRelicId:number
    culturalRelicLevel:number
    districtType:number
    mapLevelMax:number
    mapLevelMin:number
    patrolCount:number
    patrolDoingCount:number
    showName:string
    twoLimitCulturalRelicId:number
    uniqueTag:string
}