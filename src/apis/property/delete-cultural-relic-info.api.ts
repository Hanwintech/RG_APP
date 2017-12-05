
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';

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