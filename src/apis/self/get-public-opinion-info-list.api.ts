import { GetListAPI } from './../get-list-api.api';

export class GetPublicOpinionInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_public_opinion_infos");
    }
}