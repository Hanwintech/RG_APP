
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { PublicOpinionInfoSearch } from './../../models/self/public-opinion-info.model';

export class GetPublicOpinionInfoList extends BaseRequest {
    constructor(private search: PublicOpinionInfoSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_public_opinion_infos";
        this.requestBody = this.search;
    }
}