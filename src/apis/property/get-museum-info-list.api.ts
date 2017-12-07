
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { MuseumInfoSearch } from './../../models/property/museum-info.model';

export class GetMuseumInfoList extends BaseRequest {
    constructor(private search: MuseumInfoSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_museum_infos";
        this.requestBody = this.search;
    }
}