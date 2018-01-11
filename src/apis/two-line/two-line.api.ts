import { BaseRequest } from './../base-request.api';
import { CulturalRelicInfoSearch } from './../../models/property/cultural-relic-info.model';

export class GetCulturalRelicMapInfosUrl extends BaseRequest {
    constructor(public search: CulturalRelicInfoSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_cultural_relic_map_infos";
        this.requestBody = this.search;
    }
}