import { GetListAPI } from './../get-list-api.api';

export class GetNoticeInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_notice_infos");
    }
}