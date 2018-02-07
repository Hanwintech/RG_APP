import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

import { ApiService } from './../../../services/api.service';
import { PageService } from './../../../services/page.service';
import { PagingListPage } from './../../../base-pages/list-page';
import { GetMessageCenterInfoList } from './../../../apis/self/get-message-center-info-list.api';
import { MessageCenterEntity, MessageCenterInfoSearch, MessageCenterInfoSearchDataSource } from './../../../models/self/message-center-info.model';
import { EnumSearchType, EnumMessageShowType,EnumMessageCenterReadState } from './../../../models/enum';
import { SystemConst } from './../../../services/system-const.service';

@IonicPage()
@Component({
  selector: 'page-message-center-info-list',
  templateUrl: 'message-center-info-list.html',
})
export class MessageCenterInfoListPage extends PagingListPage {
  private pageTitle: string;
  private messageShowType: EnumMessageShowType;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public file: File,
    public fileTransfer: FileTransfer,
    public apiService: ApiService,
    public pageService: PageService,
    public systemConst: SystemConst
  ) {
    super(navCtrl, modalCtrl, actionSheetCtrl, file, fileTransfer, apiService, pageService, systemConst, "messageCenterInfoSearchDataSource", "messageCenterInfoList");

    this.pageService.showLoading("数据加载中...");

    //初始化父类参数
    this.api = new GetMessageCenterInfoList();
    this.condition = new MessageCenterInfoSearch();
    this.conditionDataSource = new MessageCenterInfoSearchDataSource();
    this.dataList = [];

    //初始化本页面参数
    this.messageShowType = this.navParams.data.messageShowType;
    this.pageTitle = EnumMessageShowType[this.messageShowType];

    //初始化查询条件
    this.condition.isDefaultSearch = true;
    this.condition.isNeedPaging = true;
    this.condition.searchType = EnumSearchType.All;
    this.condition.pageSize = this.systemConst.DEFAULT_PAGE_SIZE;
    this.condition.userId = localStorage.getItem("userId");
    this.condition.manageUnitId = localStorage.getItem("manageUnitId");
    this.condition.userType = Number(localStorage.getItem("userType"));
    this.condition.messageShowType = <number>this.messageShowType;
    //查询首页数据
    this.nextPage(null);
  }

  view(messageCenterEntity: MessageCenterEntity) {
    let detailPage = this.modalCtrl.create('MessageCenterInfoDetailPage', messageCenterEntity);
    detailPage.onDidDismiss(data => {
      this.refreshData();
      if(data){
        messageCenterEntity.readState=data;
        messageCenterEntity.readStateName=EnumMessageCenterReadState[data];
      }
      else{
        messageCenterEntity.readStateName="已阅";
      }
    });
    detailPage.present();
  }

  refreshData(){
    this.apiService.sendApi(this.api).subscribe(res=>{
      if(res.success){
        this.dataList=res.data.messageCenterInfoList;
      }
      else{
        this.pageService.showErrorMessage(res.reason);
      }
    },error=>{ this.pageService.showErrorMessage(error);});
  }
}
