//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseByMonthlyInfo {
    public reportQueryCaseByMonthly: UPReportQueryCaseByMonthly;

}
export class UPReportQueryCaseByMonthly {
    public indexYear: number;
    public indexMonth: number;
    public caseCount: number;
    public sumFineAmount: number;

}