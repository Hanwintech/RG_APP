
import { GetListAPI } from './../get-list-api.api';

export class GetLawFileInfos extends GetListAPI {
    constructor() {
        super("/api/system/get_law_file_infos");
    }
}
