import { GetListAPI } from './../get-list-api.api';

export class GetPatrolInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_patrol_infos");
    }
}