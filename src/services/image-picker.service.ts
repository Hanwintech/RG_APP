import { Injectable } from '@angular/core';
import { IonicPage, NavParams, AlertController, NavController, Platform, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageViewerController } from 'ionic-img-viewer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file'
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Observable } from "rxjs";
import { Attachment } from './../models/attachment.model';

@Injectable()
export class ImagePickerService {

    constructor(
        public transfer: FileTransfer,
        public file: File,
        public imagePicker: ImagePicker,
        public camera: Camera,
        public alertCtrl: AlertController) { }

    /**
    * 使用@ionic-native/image-picker获取照片
    */
    getPictures(): Promise<Attachment[]> {
        return new Promise<Attachment[]>((resolve, reject) => {
            let opt: ImagePickerOptions = { width: 1980, height: 1440, quality: 80 };
            this.imagePicker.getPictures(opt).then(
                files => {
                    new ImageUploadNote(files, attachments => {
                        console.log(attachments);
                        resolve(attachments);
                    }).upload();
                },
                error => {
                    reject(error);
                });
        });
    }
}

export class ImageUploadNote {
    private count;
    private attachments: Attachment[];

    constructor(private filePaths: string[], private onUploadCompleted) {
        this.count = this.filePaths ? this.filePaths.length : 0;
        this.attachments = [];
    }

    public upload() {
        for (let i = 0; i < this.count; i++) {
            let a = new Attachment();
            this.attachments.push(a);
        }

        if (this.onUploadCompleted) {
            this.onUploadCompleted(this.attachments);
        }
    }
}
