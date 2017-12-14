import { GetListAPI } from './../get-list-api.api';

export class GetMessageCenterInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_message_center_infos");
    }
}