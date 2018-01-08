import { NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { PageService } from './../services/page.service';
import { Attachment } from "./../models/attachment.model";

export class BasePage {
    private fileTransferObj: FileTransferObject;

    constructor(
        public navCtrl: NavController,
        public file: File,
        public fileTransfer: FileTransfer,
        public pageService: PageService
    ) {
        this.fileTransferObj = this.fileTransfer.create();
    }

    public changeAttachmentFileType(attachmentList: Attachment[]) {
        if (attachmentList && attachmentList.length > 0) {
            for (let att of attachmentList) {
                if (att) {
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
                }
            }
        }
    }

    public downloadFile(fileUrl: string, fileName: string) {
        fileUrl = fileUrl.replace("/CompressionFile/", "/OriginalFile/")
        this.fileTransferObj.download(fileUrl, this.file.externalRootDirectory + 'com.hanwintech.wwbhzf/' + fileName).then((entry) => {
            this.pageService.showMessage('下载完成: ' + entry.toURL());
        }, (error) => {
            this.pageService.showErrorMessage(error);
        });
    }

    public showSlidesPage(attachmentList: Attachment[], fileUrl: string) {
        let picUrls: string[] = [];
        let currentIndex: number = 0;
        for (let i = 0; i < attachmentList.length; i++) {
            if (attachmentList[i].fileType == "img") {
                picUrls.push(attachmentList[i].fileUrl)
            }
            if (attachmentList[i].fileUrl == fileUrl) {
                currentIndex = i;
            }
        }
        this.navCtrl.push("ShowPicturePage", { "picUrls": picUrls, "currentIndex": currentIndex });
    }

    public hasRole(role: number): boolean {
        let appRoles: number[] = eval(localStorage.getItem('appRole'));
        return appRoles && appRoles.indexOf(role) > -1
    }
}