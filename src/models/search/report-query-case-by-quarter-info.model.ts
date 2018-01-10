//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseByQuarterInfo {
    public reportQueryCaseByQuarter: UPReportQueryCaseByQuarter;

}
export class UPReportQueryCaseByQuarter {
    public indexYear: number;
    public indexQuarter: number;
    public caseCount: number;
    public sumFineAmount: number;

}
