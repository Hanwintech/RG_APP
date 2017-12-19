
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';

export class GetPatrolProcessDetailInfo extends BaseRequest {
    constructor(private processId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('processId', this.processId);
        this.method = "GET";
        this.requestUrl = "/api/system/get_patrol_process_detail_info";
        this.requestArgument = params;
    }
}