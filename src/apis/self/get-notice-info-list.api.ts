
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { NoticeInfoSearch } from './../../models/self/notice-info.model';

export class GetNoticeInfoList extends BaseRequest {
    constructor(private search: NoticeInfoSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_notice_infos";
        this.requestBody = this.search;
    }
}