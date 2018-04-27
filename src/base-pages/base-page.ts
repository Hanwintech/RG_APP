import { NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { PageService } from './../services/page.service';
import { NetworkInformationService } from './../services/network-information.service';
import { Attachment } from "./../models/attachment.model";

export class BasePage {
    private _localFileDir: string;
    private fileTransferObj: FileTransferObject;

    constructor(
        public navCtrl: NavController,
        public file: File,
        public fileTransfer: FileTransfer,
        public pageService: PageService
    ) {
        this.fileTransferObj = this.fileTransfer.create();
        //this._localFileDir = "file:///data/user/0/download/";
        this._localFileDir = this.file.externalDataDirectory
    }

    public changeAttachmentFileType(attachmentList: Attachment[]) {
        if (attachmentList && attachmentList.length > 0) {
            for (let att of attachmentList) {
                if (att) {
                    att.fileType = att.fileType.toLowerCase();
                    if (att.fileType == 'xls' || att.fileType == 'xlsx') {
                        att.fileType = "excel";
                    } else if (att.fileType == 'html' || att.fileType == 'htm') {
                        att.fileType = "html";
                    } else if (att.fileType == 'jpg' || att.fileType == 'jpeg' || att.fileType == 'png' || att.fileType == 'gif') {
                        att.fileType = "img";
                    } else if (att.fileType == 'pdf') {
                        att.fileType = "pdf";
                    } else if (att.fileType == 'ppt' || att.fileType == 'pptx') {
                        att.fileType = "ppt";
                    } else if (att.fileType == 'txt') {
                        att.fileType = "txt";
                    } else if (att.fileType == 'doc' || att.fileType == 'docx') {
                        att.fileType = "word";
                    } else {
                        att.fileType = "other_file";
                    }

                    console.log(this._localFileDir + att.fileName);
                    this.file.checkFile(this._localFileDir, att.fileName)
                        .then(() => {
                            console.log("文件已下载：" + att.fileName);
                            att.isDownloaded = true;
                        })
                        .catch(error => {
                            console.log("文件未下载：" + att.fileName);
                            console.log(error);
                        })
                }
            }
        }
    }

    public downloadFile(networkInfoService: NetworkInformationService, file: Attachment) {
        if (networkInfoService.connectionType == "2g"|| networkInfoService.connectionType == "3g"|| networkInfoService.connectionType == "4g") {
            this.pageService.showComfirmMessage(
                "正在使用数据流量,是否确定要下载？",
                () => { this.downloadFilePrivately(file); },
                () => { }
            );
        } else {
            this.downloadFilePrivately(file);
        }
    }

    public downloadAttachment(networkInfoService: NetworkInformationService, attachment: Attachment) {
        if (attachment.isDownloaded) {
            this.pageService.showMessage('文件已存在: ' + this._localFileDir + attachment.fileName);
        } else if (networkInfoService.connectionType == "2g"|| networkInfoService.connectionType == "3g"|| networkInfoService.connectionType == "4g") {
            this.pageService.showComfirmMessage(
                "正在使用数据流量,是否确定要下载？",
                () => { this.downloadFilePrivately(attachment); },
                () => { }
            );
        } else {
            this.downloadFilePrivately(attachment);
        }
    }

    private downloadFilePrivately(file: Attachment) {
        let fileUrl = file.fileUrl.replace("/CompressionFile/", "/OriginalFile/")
        console.log(this.file.externalDataDirectory);
        console.log(this._localFileDir + file.fileName);
        this.file.createFile(this._localFileDir, file.fileName, true).then(() => {
            this.fileTransferObj.download(fileUrl, this._localFileDir + file.fileName).then(
                (entry) => {
                    file.isDownloaded = true;
                    this.pageService.showMessage('下载完成');
                },
                (error) => {
                    console.log(error);
                    file.startDowload=false;
                    if (error.http_status == 404) {
                        this.pageService.showErrorMessage("文件丢失，请联系管理员！");
                    } else {
                        this.pageService.showErrorMessage(JSON.stringify(error));
                    }
                });
        });
    }

    public showSlidesPage(attachmentList: Attachment[], fileUrl: string) {
        let picUrls: string[] = [];
        let currentIndex: number = 0;
        for (let i = 0; i < attachmentList.length; i++) {
            if (attachmentList[i].fileType == "img") {
                if (attachmentList[i].isDownloaded) {
                    picUrls.push(this._localFileDir + attachmentList[i].fileName);
                } else {
                    picUrls.push(attachmentList[i].fileUrl);
                }
            }
            if (attachmentList[i].fileUrl == fileUrl) {
                currentIndex = i;
            }
        }
        this.navCtrl.push("ShowPicturePage", { "picUrls": picUrls, "currentIndex": currentIndex });
    }

    public openFile(fileOpener: FileOpener, attachment: Attachment) {
        let fileMIMEType: string = 'application/octet-stream';

        attachment.fileType = attachment.fileType.toLowerCase();
        if (attachment.fileType == 'pdf') {
            fileMIMEType = "application/pdf";
        } else if (attachment.fileType == 'excel') {
            fileMIMEType = "application/vnd.ms-excel";
        } else if (attachment.fileType == 'word') {
            fileMIMEType = "application/msword";
        } else if (attachment.fileType == 'ppt') {
            fileMIMEType = "application/vnd.ms-powerpoint";
        } else if (attachment.fileType == 'html') {
            fileMIMEType = "text/html";
        } else if (attachment.fileType == 'img') {
            fileMIMEType = "image/jpeg";
        } else if (attachment.fileType == 'txt') {
            fileMIMEType = "text/plain";
        }

        fileOpener.open(this._localFileDir + attachment.fileName, fileMIMEType)
            .then(() => console.log("open file：" + this._localFileDir + attachment.fileName))
            .catch(e => console.log("open file error：" + this._localFileDir + attachment.fileName));
    }

    public hasRole(role: number): boolean {
        let appRoles: number[] = eval(localStorage.getItem('appRole'));
        return appRoles && appRoles.indexOf(role) > -1
    }
}