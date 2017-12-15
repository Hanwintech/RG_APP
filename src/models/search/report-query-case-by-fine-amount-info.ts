//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseByFineAmountInfo {
    public reportQueryCaseByFineAmount: UPReportQueryCaseByFineAmount;

}
export class UPReportQueryCaseByFineAmount {
    public fineLevel: number;
    public minValue: number;
    public maxValue: number;
    public levelName: string;
    public caseCount: number;
    public sumFineAmount: number;
    
}

