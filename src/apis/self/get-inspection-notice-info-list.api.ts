
import { URLSearchParams } from '@angular/http';
import { BaseRequest } from './../base-request.api';
import { InspectionNoticeInfoSearch } from './../../models/self/inspection-notice-info.model';

export class GetInspectionNoticeInfoList extends BaseRequest {
    constructor(private search: InspectionNoticeInfoSearch) {
        super();
        this.method = "POST";
        this.requestUrl = "/api/system/get_inspector_notice_infos";
        this.requestBody = this.search;
    }
}