import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Device } from '@ionic-native/device';
import { SMS } from '@ionic-native/sms';
import { CallNumber } from '@ionic-native/call-number';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { JPush } from '@jiguang-ionic/jpush';

import { MyApp } from './app.component';

import { ApiService } from './../services/api.service';
import { PageService } from './../services/page.service';
import { ValidateService } from './../services/validate.service';
import { nativeImgService } from "./../services/nativeImg.service";
import { FileUploadService } from "./../services/file-upload.service";
import { ImagePickerService } from "./../services/image-picker.service";
import { SystemConst } from './../services/system-const.service';
import { NativeService } from './../services/native.service';
import { LocationWatchService } from './../services/location-watch.service';
import { NetworkInformationService } from './../services/network-information.service';
import { BackgroundMode } from '@ionic-native/background-mode';

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
    File,
    FileTransfer,
    FileOpener,
    ApiService,
    PageService,
    ValidateService,
    SystemConst,
    NativeService,
    nativeImgService,
    FileUploadService,
    ImagePickerService,
    BackgroundMode,
    Camera,
    JPush,
    AppVersion,
    InAppBrowser,
    Network,
    ImagePicker,
    Device,
    LocationWatchService,
    NetworkInformationService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
