import { BaseRequest } from './../base-request.api';
import { URLSearchParams } from '@angular/http';
import { InspectionNoticeInfo } from './../../models/self/inspection-notice-info.model';

export class SetMessageStatus extends BaseRequest {
    constructor(private messageId: string, private userId: string, private status: any) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('messageId', this.messageId);
        params.set('userId', this.userId);
        params.set('status', this.status);
        this.method = "GET";
        this.requestUrl = "/api/system/set_message_status";
        this.requestArgument = params;
    }
}