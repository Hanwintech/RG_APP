import { GetListAPI } from './../get-list-api.api';

export class GetMuseumInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_museum_infos");
    }
}