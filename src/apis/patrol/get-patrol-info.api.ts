
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';

export class GetPatrolInfo extends BaseRequest {
    constructor(private patrolId: string, private userId: string, private manageUnitId: string, private userType: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('patrolId', this.patrolId);
        params.set('userId', this.userId);
        params.set('manageUnitId', this.manageUnitId);
        params.set('userType', this.userType);
        this.method = "GET";
        this.requestUrl = "/api/system/get_patrol_info";
        this.requestArgument = params;
    }
}