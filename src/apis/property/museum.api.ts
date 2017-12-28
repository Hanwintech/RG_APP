import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { GetListAPI } from './../get-list-api.api';
import { MuseumPostInfo } from './../../models/property/museum-info.model';

export class GetMuseumInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_museum_infos");
    }
}

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

export class DeleteMuseumInfo extends BaseRequest {
    constructor(private id: string,private userId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', this.id);
        params.set('userId',this.userId);
        this.method = "GET";
        this.requestUrl = "/api/system/delete_museum_info";
        this.requestArgument = params;
    }
}

export class EditMuseumInfo extends BaseRequest {
    constructor(private id: string,private userId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', this.id);
        params.set('userId',this.userId);
        this.method = "GET";
        this.requestUrl = "/api/system/edit_museum_info";
        this.requestArgument = params;
    }
}

export class PostMuseumInfo extends BaseRequest {
    constructor(private culturalRelicPostInfo: MuseumPostInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/post_museum_info";
        this.requestBody = this.culturalRelicPostInfo;
    }
}