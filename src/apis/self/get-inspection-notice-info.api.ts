import { GetListAPI } from './../get-list-api.api';
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';

export class GetInspectionNoticeInfoList extends BaseRequest {

    constructor(private Id: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('Id', this.Id);
        this.method = "GET";
        this.requestUrl ="/api/system/get_inspector_notice_info";
        this.requestArgument = params;
    }
}