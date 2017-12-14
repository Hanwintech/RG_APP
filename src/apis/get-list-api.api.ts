import { BaseRequest } from './base-request.api';

export class GetListAPI extends BaseRequest {
    public get condition(): any { return this.requestBody; }
    public set condition(value) { this.requestBody = value; }

    constructor(private apiUrl: string) {
        super();
        this.method = "POST";
        this.requestUrl = apiUrl;
    }
}