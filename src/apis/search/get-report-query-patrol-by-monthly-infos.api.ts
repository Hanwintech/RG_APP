import { BaseRequest } from './../base-request.api';
import { ReportQueryPatrolSearch } from './../../models/search/report-query-patrol-search.model';

export class GetReportQueryPatrolByMonthlyInfos extends BaseRequest {
    constructor(private search: ReportQueryPatrolSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_report_query_patrol_by_monthly_infos";
        this.requestBody = this.search;
    }
}