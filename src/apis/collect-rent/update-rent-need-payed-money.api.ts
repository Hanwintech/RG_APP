import { INeedPayedMoney } from './../../models/need-payed-money.model';
import { BaseRequest } from './../base-request.api';
/**
 * PostMemoApi
 */
export class UpdateRentNeedPayedMoney extends BaseRequest {
    constructor(private rent: INeedPayedMoney) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/fee/update_rent_need_payed_money";
        this.requestBody = this.rent;
    }
}