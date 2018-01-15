import { BaseRequest } from './../base-request.api';
import { CulturalRelicInfoSearch } from './../../models/property/cultural-relic-info.model';
import { CoordinatePostInfo } from './../../models/two-line/two-line-info.model';

export class GetCulturalRelicMapInfosUrl extends BaseRequest {
    constructor(private search: CulturalRelicInfoSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_cultural_relic_map_infos";
        this.requestBody = this.search;
    }
}

export class PostCoordinateInfosUrl extends BaseRequest {
    constructor(private coordinateInfo: CoordinatePostInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/post_coordinate_info";
        this.requestBody = this.coordinateInfo;
    }
}