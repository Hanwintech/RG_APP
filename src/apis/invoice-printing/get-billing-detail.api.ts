import { BaseRequest } from '../base-request.api';
import { URLSearchParams } from '@angular/http';
import { IBilling } from '../../models/billing.model';
/**
 * get_rent_need_payed_money_list
 */
export class GetBillingDetail extends BaseRequest {
    constructor(private billing: IBilling) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/fee/get_billing_detail";
        this.requestBody = this.billing;
    }
}