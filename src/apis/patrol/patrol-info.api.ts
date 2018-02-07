import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { GetListAPI } from './../get-list-api.api';
import { PatrolInfo,PatrolProcessInfo} from './../../models/patrol/patrol-info.model';

export class GetPatrolInfoList extends GetListAPI {
    constructor() {
        super("/api/system/get_patrol_infos");
    }
}

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

export class GetPatrolEditDataSource extends BaseRequest {
    constructor(private userId: string, private manageUnitId: string, private userType: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('userId', this.userId);
        params.set('manageUnitId', this.manageUnitId);
        params.set('userType', this.userType);
        this.method = "GET";
        this.requestUrl = "/api/system/get_patrol_edit_data_source";
        this.requestArgument = params;
    }
}

export class PostPatrolInfo extends BaseRequest {
    constructor(public patrolInfo: PatrolInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/post_patrol_info";
        this.requestBody = this.patrolInfo;
    }
}

export class getPatrolProcessInfo extends BaseRequest {
    constructor(private patrolId:string, private userId: string, private manageUnitId: string, private userType: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('patrolId', this.patrolId);
        params.set('userId', this.userId);
        params.set('manageUnitId', this.manageUnitId);
        params.set('userType', this.userType);
        this.method = "GET";
        this.requestUrl = "/api/system/get_patrol_process_info";
        this.requestArgument =params;
    }
}

export class PostPatrolProcessInfo extends BaseRequest {
    constructor(public patrolProcessInfo: PatrolProcessInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/submit_patrol_process_info";
        this.requestBody = this.patrolProcessInfo;
    }
}

export class GetPatrolPlanUserInfos extends BaseRequest {
    constructor(private culId: string,private planUserType:any,private userId: string) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('culId', this.culId);
        params.set('planUserType', this.planUserType);
        params.set('userId', this.userId);
        this.method = "GET";
        this.requestUrl = "/api/system/get_patrol_plan_user_infos";
        this.requestArgument =params;
    }
}