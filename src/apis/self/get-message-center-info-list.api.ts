
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { MessageCenterInfoSearch } from './../../models/self/message-center-info.model';

export class GetMessageCenterInfoList extends BaseRequest {
    constructor(private search: MessageCenterInfoSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_message_center_infos";
        this.requestBody = this.search;
    }
}