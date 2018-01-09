import { BaseApiSearch } from "./../base-api-search.model";
import { IntegerKeyValue } from "./../integer-key-value.model";
export class ReportQueryPatrolSearch extends BaseApiSearch {
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public startDateTime: string;
    public endDateTime: string;
    public patrolStatus: number;
    public startYear: number;
    public endYear: number;
    public startMonth: number;
    public endMonth: number;
    public startQuarter: number;
    public endQuarter: number;
    public startHalfYear: number;
    public endHalfYear: number;

    constructor() {
        super();
        this.clearNumbers();
    }
    public clearNumbers() { }
}

export class ReportQueryCaseSearchDataSource {
    public caseStateList: IntegerKeyValue[];
    public caseSourceList: IntegerKeyValue[];
    public investigationProcedureList: IntegerKeyValue[];
}
export class ReportQueryPatrolSearchDataSource {
    public patrolStatusList: IntegerKeyValue[];
}




