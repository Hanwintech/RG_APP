import { BaseRequest } from './../base-request.api';
import { UserLocationInfo } from './../../models/system/user-location-info.model';

export class PostUserCoordinateInfo extends BaseRequest {
    constructor(private userLocationInfo: UserLocationInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/post_user_coordinate_info";
        this.requestBody = this.userLocationInfo;
    }
}