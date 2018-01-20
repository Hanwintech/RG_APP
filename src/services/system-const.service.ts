import { Injectable } from '@angular/core';
import { IntegerKeyValue } from "./../models/integer-key-value.model";

@Injectable()
export class SystemConst {
    public DEFAULT_PAGE_INDEX: number = 0;
    public DEFAULT_PAGE_SIZE: number = 10;

    public EMPTY_INTEGER: number = -1;

    public get EMPTY_SELECT_LIST(): IntegerKeyValue[] { return eval("[{ 'key': -1, 'value': '请选择' }]"); };
}