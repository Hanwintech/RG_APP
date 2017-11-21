import { BaseRequest } from '../base-request.api';
/**
 * GetUserInfoApi
 */
export class GetPayedPersonList extends BaseRequest {
    constructor() {
        super();
        this.method = "GET";
        this.requestUrl = "/api/fee/get_payed_person_list";
    }
}