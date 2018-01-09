import{Attachment} from "./../attachment.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
export class CaseInputInfo {
    public caseInputDetails:CaseInputDetailsEntity;
    public caseSourceName:string;
    public investigationProcedureName:string;
    public caseStateName:string;
    public caseInput:CaseInputEntity;
    public attachmentList:Attachment[];
    public caseSourceList: IntegerKeyValue[];
    public investigationProcedureList: IntegerKeyValue[];
    public code:number;
    public message:string;
    public tag:string;
    public currentCaseStatus:number;
    public isPlead:boolean;
    public caseBreakLawEnterpriseInfoList:UVCaseBreakLawEnterprise[];
    public caseBreakLawPersonInfoList:UVCaseBreakLawPerson[];
    public certificateTypeList: IntegerKeyValue[];
    public degreeList: IntegerKeyValue[];
    public sexList: IntegerKeyValue[];

}

export class CaseInputDetailsEntity{

    public keyID:string;
    public caseDate:string;
    public caseReason:string;
    public caseSource:number;
    public caseState:number;
    public fK_CulturalRelicID:string;
    public fK_ManageUnitID:string;
    public investigationProcedure:number;
    public isDeleted:boolean;
    public remark:string;
    public situationDescription:string;
    public sortIndex:number;
    public manageUnitName:string;
    public culturalRelicLevel:number;
    public culturalRelicName:string;
    public enumArea:number;
    public coordinateX:number;
    public coordinateY:number;
    public miniImage:string;
    public officers:string;
    public waringState:number;
    public orderIndex:number;
    public fK_PatrolCaseInfoID:string;
}
export class CaseInputEntity{
    public  iD:string;
    public  fK_ManageUnitID:string;
    public  caseReason:string;
    public  fK_CulturalRelicID:string;
    public  caseDate:string;
    public  caseSource:number;
    public  investigationProcedure:number;
    public  situationDescription:string;
    public  caseState:number;
    public  remark:string;
    public  sortIndex:number;
    public  addDate:string;
    public  adderID:string;
    public  updateDate:string;
    public  updaterID:string;
    public  isDeleted:boolean;
    public  waringState:number;
    public  fK_PatrolCaseInfoID:string;
}
export class UVCaseBreakLawEnterprise{
    public  keyID:string;
    public  fK_CaseInputID:string;
    public  fK_CaseBreakLawEnterpriseID:string;
    public  enterpriseName:string;
    public  legalPerson:string;
    public  mobile:string;
    public  creditCode:string;
    public  address:string;
    public  remark:string;
    public  addDate:string;
    public  adderID:string;
    public  updateDate:string;
    public  updaterID:string;
}
export class UVCaseBreakLawPerson{

    public  keyID:string;
    public  fK_CaseInputID:string;
    public  fK_CaseBreakLawPersonID:string;
    public  userName:string;
    public  sex:number;
    public  age:number;
    public  mobile:string;
    public  certificateType;
    public  certificateNum:string;
    public  address:string;
    public  duty:string;
    public  degree:number;
    public  workPlace:string;
    public  remark:string;
    public  addDate:string;
    public  adderID:string;
    public  updateDate:string;
    public  updaterID:string;
    public  certificateTypeName:string;
    public  degreeName:string;
    public  fK_BreakLawEnterpriseID:string;
}

