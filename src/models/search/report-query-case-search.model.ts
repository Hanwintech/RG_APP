import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseSearch extends BaseApiSearch {
    public userId: string;
    public manageUnitId: string;
    public userType: number;
    public caseState: string;
    public caseSource: string;
    public investigationProcedure: string;
    public startDateTime: string;
    public endDateTime: string;
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