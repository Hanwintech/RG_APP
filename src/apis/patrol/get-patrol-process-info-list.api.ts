
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';

export class GetPatrolProcessInfoList extends BaseRequest {
    constructor(private patrolId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('patrolId', this.patrolId);
        this.method = "GET";
        this.requestUrl = "/api/system/get_patrol_process_infos";
        this.requestArgument = params;
    }
}