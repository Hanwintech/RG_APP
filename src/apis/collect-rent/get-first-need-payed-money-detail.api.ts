import { BaseRequest } from '../base-request.api';
import { URLSearchParams } from '@angular/http';
/**
 * get_first_need_payed_money_detail
 */
export class GetFirstNeedPayedMoneyDetail extends BaseRequest {
    constructor(contractId) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('contractId', contractId);
        this.method = "GET";
        this.requestUrl = "/api/fee/get_first_need_payed_money_detail";
        this.requestArgument = params;
    }
}