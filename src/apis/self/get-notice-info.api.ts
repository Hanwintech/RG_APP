
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';

export class GetNoticeInfo extends BaseRequest {
    constructor(private noticeId: string, private userId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('noticeId', this.noticeId);
        params.set('userId', this.userId);
        this.method = "GET";
        this.requestUrl = "/api/system/get_notice_info";
        this.requestArgument = params;
    }
}