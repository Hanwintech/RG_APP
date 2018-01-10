import { Attachment } from "./../attachment.model";
export class LawFileInfos {

    public totalCount: number;
    public isLastPage: boolean;
    public code: number;
    public message: string;
    public tag: string;
    public lawFileInfoList: LawFileInfo[];

}
export class LawFileInfo {
    public lawFile: LawFileEntity;
    public typeName: string;
    public attachmentList: Attachment;
}
export class LawFileEntity {
    public iD: string;
    public fileTitle: string;
    public keyWords: string;
    public abstract: string;
    public remark: string;
    public type:number;
    public addDate: string;
    public adderID: string;
    public updateDate: string;
    public updaterID: string;
    public isDeleted: boolean;

}

