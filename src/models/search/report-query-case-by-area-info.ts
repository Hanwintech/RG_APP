//import { BaseApiSearch } from "./../base-api-search.model";

export class ReportQueryCaseByAreaInfo {
    public reportQueryCaseByArea: UPReportQueryCaseByArea;

}
export class UPReportQueryCaseByArea {
    public area: number;
    public areaName: string;
    public caseCount: number;
    public sumFineAmount: number;

}
