import { BaseRequest } from './../base-request.api';
import { MessageCenterUnreadInfo } from './../../models/self/message-center-unread-info.model';

export class GetUnreadMessageCountInfo extends BaseRequest {
    constructor(public unreadMessageCountInfo: MessageCenterUnreadInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_unread_message_count_info";
        this.requestBody = this.unreadMessageCountInfo;
    }
}