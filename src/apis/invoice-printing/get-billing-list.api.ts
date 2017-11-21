import { BaseRequest } from '../base-request.api';
import { URLSearchParams } from '@angular/http';
/**
 * get_billing_list
 */
export class GetBillingList extends BaseRequest {
    constructor(name, certno, address) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('name', name);
        params.set('certno', certno);
        params.set('address', address);
        this.method = "GET";
        this.requestUrl = "/api/fee/get_billing_list";
        this.requestArgument = params;
    }
}