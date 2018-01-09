
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { GetListAPI } from './../get-list-api.api';

export class GetCaseInputInfos extends GetListAPI {
    constructor() {
        super("/api/system/get_case_input_infos");
    }
}
