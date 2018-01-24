import { BaseRequest } from './../base-request.api';
import { ReportQueryCaseSearch } from './../../models/search/report-query-case-search.model';

export class GetReportQueryCaseByRelicLevelInfos extends BaseRequest {
    constructor(private search: ReportQueryCaseSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_report_query_case_by_relic_level_infos";
        this.requestBody = this.search;
    }
}