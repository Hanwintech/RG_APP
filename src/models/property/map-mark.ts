export interface MapMark {
    id: string;
    name: string;
    location:string;
    //人员坐标点
    personLocateX: any;
    personLocateY: any;
    //文物坐标点
    culturalRelicX: any;
    culturalRelicY: any;
    //文物级别
    culturalRelicLevel:number;
    //两线信息
    twolineInfo:any;
}