import { GetListAPI } from './../get-list-api.api';

export class GetInspectionNoticeInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_inspector_notice_infos");
    }
}