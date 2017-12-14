import { GetListAPI } from './../get-list-api.api';

export class GetCulturalRelicInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_cultural_relic_infos");
    }
}