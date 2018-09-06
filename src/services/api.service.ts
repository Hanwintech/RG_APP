import { App } from 'ionic-angular';
import { IHttpCommonResponse } from './../models/http-common-response.model';
import { BaseRequest } from './../apis/base-request.api';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestMethod, Request } from '@angular/http';
import 'rxjs/add/operator/map';

import { EnumAreaCode } from './../models/enum'
import { PageService } from './../services/page.service';

@Injectable()
export class ApiService {
    public get areaCode(): EnumAreaCode {
        return EnumAreaCode.淮安市;
    }

    private _token: string;
    public get token(): string {
        if (!this._token) {
            this._token = localStorage.getItem('token');
        }
        return this._token;
    }
    public set token(v: string) {
        localStorage.setItem('token', v);
        this._token = v;
    }

    public get baseUrl(): string {
        // return ""; //江苏省 = 1,
        // return ""; //南京市 = 2,
        // return ""; //无锡市 = 3,
        // return ""; //徐州市 = 4,
        // return ""; //常州市 = 5,
        // return ""; //苏州市 = 6,
        // return ""; //南通市 = 7,
        // return ""; //连云港市 = 8,
       return "http://58.210.177.10:10039"; //淮安市 = 9,
         //return "http://localhost:9080";
        // return ""; //盐城市 = 10,
        // return ""; //扬州市 = 11,
        // return ""; //镇江市 = 12,
        // return ""; //泰州市 = 13,
        // return ""; //宿迁市 = 14,
        // return ""; //昆山市 = 15,
        // return ""; //泰兴市 = 16,
        // return ""; //沭阳县 = 17,
        // return ""; //大丰 = 18
    }

    constructor(private http: Http, private app: App, private pageService: PageService) { }

    getToken(account: string, password: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            method: RequestMethod.Post,
            url: this.baseUrl + '/api/token',
            headers: headers,
            body: "grant_type=password" + "&username=" + account + "&password=" + password
        };
        return this.http.request(new Request(options))
            .map(res => res.json());
    }

    sendApi(request: BaseRequest) {
        let headers = new Headers();
        headers.append('Authorization', 'bearer ' + this.token);
        if (request.method == 'POST') {
            headers.append('Content-Type', 'application/json');
        }
        let options = {
            method: request.method,
            url: this.baseUrl + request.requestUrl,
            headers: headers,
            body: JSON.stringify(request.requestBody),
            params: request.requestArgument
        };
        return this.http.request(new Request(options))
            .map(res => <IHttpCommonResponse<any>>res.json())
            .catch<IHttpCommonResponse<any>, IHttpCommonResponse<any>>(err => {
                if (err.status == 401){
                    this.pageService.showErrorMessage("登录时间过长，请重新登录！");
                    this.app.getRootNav().setRoot("LoginPage", { logout: true });
                }
                return new Promise(resolve=>{res => <IHttpCommonResponse<any>>res.json()}); 
            } );
       
    }
}