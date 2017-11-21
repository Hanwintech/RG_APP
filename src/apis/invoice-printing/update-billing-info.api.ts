import { IBilling } from './../../models/billing.model';
import { BaseRequest } from './../base-request.api';
/**
 * PostMemoApi
 */
export class UpdateBillingInfo extends BaseRequest {
    constructor(private billing: IBilling) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/fee/update_billing_info";
        this.requestBody = this.billing;
    }
}