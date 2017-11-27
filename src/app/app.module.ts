import { BLEService } from './../services/ble.service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiService } from '../services/api.service';
import { PageService } from '../services/page.service';
import { HttpModule } from '@angular/http';
import { BLE } from '@ionic-native/ble';

import { TabsPage } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyApp,TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
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
    MyApp,TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiService,
    PageService,
    BLEService,
    BLE,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
