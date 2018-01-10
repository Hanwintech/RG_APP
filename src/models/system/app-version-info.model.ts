import { Attachment } from "./../attachment.model";

export class AppVersionInfo {
    public appVersion: string;
    public title: string;
    public updateRemark: string;
    public attachmentList: Attachment[];
}