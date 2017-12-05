
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { CulturalRelicInfoSearch } from './../../models/property/cultural-relic-info.model';

export class GetCulturalRelicInfo extends BaseRequest {
    constructor(private id: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', this.id);
        this.method = "GET";
        this.requestUrl = "/api/system/get_cultural_relic_info";
        this.requestArgument = params;
    }
}