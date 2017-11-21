import { BaseRequest } from '../base-request.api';
import { URLSearchParams } from '@angular/http';
/**
 * get_rent_need_payed_money_detail
 */
export class GetRentNeedPayedMoneyDetail extends BaseRequest {
    constructor(contractId, feeType, terms) {
        super();
        let params: URLSearchParams = new URLSearchParams();
        params.set('contractId', contractId);
        params.set('feeType', feeType);
        params.set('terms', terms);
        this.method = "GET";
        this.requestUrl = "/api/fee/get_rent_need_payed_money_detail";
        this.requestArgument = params;
    }
}