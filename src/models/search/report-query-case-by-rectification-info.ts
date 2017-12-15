//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseByRectificationInfo {
    public reportQueryCaseByRectification: UPReportQueryCaseByRectification;

}
export class UPReportQueryCaseByRectification {
    public isFinish: number;
    public rectificationName: string;
    public caseCount: number;
    public sumFineAmount: number;

}

