import { Injectable } from '@angular/core';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { FileUploadService } from './../services/file-upload.service';
import { Attachment } from './../models/attachment.model';

@Injectable()
export class ImagePickerService {

    constructor(
        public imagePicker: ImagePicker,
        public fileUploadService: FileUploadService
    ) { }

    /**
    * 使用@ionic-native/image-picker获取照片
    */
    getPictures(): Promise<Attachment[]> {
        return new Promise<Attachment[]>((resolve, reject) => {
            let opt: ImagePickerOptions = { width: 1980, height: 1440, quality: 80 };
            this.imagePicker.getPictures(opt).then(
                files => {
                    if (files && files.length > 0) {
                        new ImageUploadNotes(this.fileUploadService, files, attachments => {
                            if (attachments) {
                                resolve(attachments);
                            } else {
                                reject("上传图片失败！");
                            }
                        });
                    } else {
                        reject("未选择图片！");
                    }
                },
                error => {
                    reject("上传图片失败！");
                });
        });
    }
}

export class ImageUploadNotes {
    private attachments: Attachment[];
    private isCompleted: boolean;

    constructor(private fileUploadService: FileUploadService, private filePaths: string[], private onUploadCompleted) {
        if (this.onUploadCompleted) {
            this.attachments = new Array(this.filePaths.length);
            this.isCompleted = false;

            for (let i = 0; i < this.filePaths.length; i++) {
                new ImageUploadNote(this.fileUploadService, i, this.filePaths[i], (index, attachment) => {
                    if (attachment) {
                        this.attachments[index] = attachment;

                        let tempIsCompleted: boolean = true;
                        for (let a of this.attachments) {
                            if (!a) {
                                tempIsCompleted = false;
                                break;
                            }
                        }

                        if (tempIsCompleted && !this.isCompleted) {
                            this.isCompleted = true;
                            this.onUploadCompleted(this.attachments);
                        }
                    } else {
                        this.isCompleted = true;
                        this.onUploadCompleted();
                    }
                });
            }
        }
    }
}

export class ImageUploadNote {
    constructor(private fileUploadService: FileUploadService, private index: number, private file: string, private onUploadCompleted) {
        if (this.onUploadCompleted) {
            this.fileUploadService.upload(this.file).then(
                attachment => {
                    this.onUploadCompleted(this.index, attachment);
                },
                error => {
                    this.onUploadCompleted(this.index);
                }
            );
        }
    }
}