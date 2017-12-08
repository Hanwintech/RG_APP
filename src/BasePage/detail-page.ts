import { NavController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { BasePage } from "./base-page";
import { PageService } from './../services/page.service';

export class DetailPage extends BasePage {
    constructor(
        public navCtrl: NavController, 
        public file: File,
        public fileTransfer: FileTransfer,
        public pageService: PageService
    ) {
        super(navCtrl, file, fileTransfer, pageService);
    }
}