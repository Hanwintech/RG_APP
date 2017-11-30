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