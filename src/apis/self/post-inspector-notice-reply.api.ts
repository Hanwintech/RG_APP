import { BaseRequest } from './../base-request.api';
import { InspectionNoticeInfo } from './../../models/self/inspection-notice-info.model';

export class PostInspectorNoticeReply extends BaseRequest {
    constructor(private reply: InspectionNoticeInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/post_inspector_notice_reply";
        this.requestBody = reply
    }
}