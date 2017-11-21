import { BaseRequest } from '../base-request.api';
import { URLSearchParams } from '@angular/http';
/**
 * GetUserInfoApi
 */
export class GetNewInvoiceNoBook extends BaseRequest {
    constructor(comminutyId) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('comminutyId', comminutyId);
        this.method = "GET";
        this.requestUrl = "/api/fee/get_new_invoice_no_book";
        this.requestArgument = params;
    }
}