import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Device } from '@ionic-native/device';

import { MyApp } from './app.component';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { ValidateService } from './../services/validate.service';
import { nativeImgService } from "./../services/nativeImg.service";
import { FileUploadService } from "./../services/file-upload.service";
import { ImagePickerService } from "./../services/image-picker.service";
import { SystemConst } from './../services/system-const.service';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      tabsHideOnSubPages: true,
      platforms: {
        ios: {
          backButtonText: '返回',
        }
      },
      iconMode: 'ios',
      mode: 'ios'
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SMS,
    CallNumber,
    Geolocation,
    File,
    FileTransfer,
    ApiService,
    PageService,
    ValidateService,
    SystemConst,
    nativeImgService,
    FileUploadService,
    ImagePickerService,
    Camera,
    ImagePicker,
    Device,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
