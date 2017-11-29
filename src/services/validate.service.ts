import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {
    constructor() { }

    isMobilePhoneNumber(str: string) {
        let reg = new RegExp("^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$");
        return reg.test(str);
    }

    isTelephoneNumber(str: string) {
        let reg = new RegExp("^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$");
        return reg.test(str);
    }

    isEmail(str: string) {
        let reg = new RegExp("^[A-Za-z0-9\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$");
        return reg.test(str);
    }
}