//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseBySourceInfo {
    public reportQueryCaseBySource: UPReportQueryCaseBySource;

}
export class UPReportQueryCaseBySource {
    public caseSource: number;
    public caseSourceName: string;
    public caseCount: number;
    public sumFineAmount: number;

}
