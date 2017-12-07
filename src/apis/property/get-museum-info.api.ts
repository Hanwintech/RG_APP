
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';

export class GetMuseumInfo extends BaseRequest {
    constructor(private id: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', this.id);
        this.method = "GET";
        this.requestUrl = "/api/system/get_museum_info";
        this.requestArgument = params;
    }
}