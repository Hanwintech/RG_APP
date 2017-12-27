import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { GetListAPI } from './../get-list-api.api';
import { CulturalRelicPostInfo } from './../../models/property/cultural-relic-info.model';

export class GetCulturalRelicInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_cultural_relic_infos");
    }
}

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

export class EditCulturalRelicInfo extends BaseRequest {
    constructor(private id: string,private userId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', this.id);
        params.set('userId',this.userId);
        this.method = "GET";
        this.requestUrl = "/api/system/edit_cultural_relic_info";
        this.requestArgument = params;
    }
}

export class PostCulturalRelicInfo extends BaseRequest {
    constructor(private culturalRelicPostInfo: CulturalRelicPostInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/post_cultural_relic_info";
        this.requestBody = this.culturalRelicPostInfo;
    }
}

export class DeleteCulturalRelicInfo extends BaseRequest {
    constructor(private id: string,private userId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', this.id);
        params.set('userId',this.userId);
        this.method = "GET";
        this.requestUrl = "/api/system/delete_cultural_relic_info";
        this.requestArgument = params;
    }
}