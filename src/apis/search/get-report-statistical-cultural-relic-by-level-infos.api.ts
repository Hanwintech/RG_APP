import { BaseRequest } from './../base-request.api';
import { ReportStatisticalCulturalRelicSearch } from './../../models/search/report-statistical-cultural-relic-search.model';

export class GetReportStatisticalCulturalRelicByLevelInfos extends BaseRequest {
    constructor(private search: ReportStatisticalCulturalRelicSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_report_statistical_cultural_relic_by_level_infos";
        this.requestBody = this.search;
    }
}