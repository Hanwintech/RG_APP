import { BaseRequest } from '../base-request.api';
import { URLSearchParams } from '@angular/http';
/**
 * GetUserInfoApi
 */
export class GetNewInvoiceNo extends BaseRequest {
    constructor(bookId) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('bookId', bookId);
        this.method = "GET";
        this.requestUrl = "/api/fee/get_new_invoice_no";
        this.requestArgument = params;
    }
}