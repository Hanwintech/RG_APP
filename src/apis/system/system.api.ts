import { BaseRequest } from './../base-request.api';
import { UserLocationInfo } from './../../models/system/user-location-info.model';

//坐标
export class PostUserCoordinateInfo extends BaseRequest {
    constructor(private userLocationInfo: UserLocationInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/post_user_coordinate_info";
        this.requestBody = this.userLocationInfo;
    }
}

//版本
export class GetAppVersionInfo extends BaseRequest {
    constructor() {
        super();
        this.method = "GET";
        this.requestUrl = "/api/system/get_app_version_info";
    }
}