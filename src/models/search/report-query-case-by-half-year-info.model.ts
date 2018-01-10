//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseByHalfYearInfo {
    public reportQueryCaseByHalfYear: UPReportQueryCaseByHalfYear;

}
export class UPReportQueryCaseByHalfYear {
    public indexYear: number;
    public indexHalfYear: number;
    public caseCount: number;
    public sumFineAmount: number;

}
