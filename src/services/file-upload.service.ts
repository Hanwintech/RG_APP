import { Injectable } from '@angular/core';
import { Headers, RequestMethod, Request } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

import 'rxjs/add/operator/map';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { Attachment } from './../models/attachment.model';

@Injectable()
export class FileUploadService {
    constructor(public fileTransfer: FileTransfer, public apiService: ApiService, public pageService: PageService) { }

    upload(filePath: string): Promise<Attachment> {
        return new Promise<Attachment>((resolve, reject) => {
            let fileName = filePath.substr(filePath.lastIndexOf("/") + 1);
            let fileExt = fileName.substr(fileName.lastIndexOf(".") + 1);
            if (fileExt.includes("?")) {
                fileExt = fileExt.substring(0, fileExt.indexOf("?"));
                fileName = fileName.substring(0, fileName.lastIndexOf(".")) + "." + fileExt;
            }
            let options: FileUploadOptions = { fileName: fileName };

            this.fileTransfer.create().upload(filePath, encodeURI(this.apiService.baseUrl + '/api/Upload/SaveTempFile'), options, true).then(
                res => {
                    resolve(JSON.parse(res.response).data);
                },
                error => {
                    reject(error);
                });
        });
    }
}