import { BaseRequest } from './../base-request.api';
import { UserInfo } from './../../models/user-info.model';

export class UpdateUserInfo extends BaseRequest {
    constructor(private model: UserInfo) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/update_user_info";
        this.requestBody = this.model;
    }
}