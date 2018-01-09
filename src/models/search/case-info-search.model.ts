import { BaseApiSearch } from "./../base-api-search.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
import { TreeDataInfo } from "./../tree-data-info.model";
export class CaseInfoSearch extends BaseApiSearch {
    public  userId:string;
    public  manageUnitId:string;
    public  userType:number;
    public  caseState:number;
    public  culturalRelicName:string;
    public  caseReason:string;
    public  caseSource:number;
    public  investigationProcedure:number;
    public  startDateTime:string;
    public  endDateTime:string;
    public  area:number;
    public  district:number;
    public  culturalRelicLevel:number;
    public  manageUnitName:string;
    public  officer:string;
    public  pageSize:number;
    public  pageIndex:number;
    public  isNeedPaging:boolean;
    public  keyword:string;
    public  searchType:number;
    public  culturalRelicID:string;


    public  isDefaultSearch:boolean;


    public  isMapShow:boolean;
    public  leftTopCoordinateX:number ;
    public  leftTopCoordinateY:number ;
    public  rightBottomCoordinateX:number ;
    public  rightBottomCoordinateY:number ;
}

export class CaseInfoSearchDataSource{
    public caseStateList:IntegerKeyValue[];
    public caseSourceList:IntegerKeyValue[];
    public investigationProcedureList:IntegerKeyValue[];
    public areaList:IntegerKeyValue[];
    public districtList:TreeDataInfo[];
    public culturalRelicLevelList:IntegerKeyValue[];
}