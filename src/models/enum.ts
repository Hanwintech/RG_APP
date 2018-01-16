export enum EnumAreaCode {
    江苏省 = 1,
    南京市 = 2,
    无锡市 = 3,
    徐州市 = 4,
    常州市 = 5,
    苏州市 = 6,
    南通市 = 7,
    连云港市 = 8,
    淮安市 = 9,
    盐城市 = 10,
    扬州市 = 11,
    镇江市 = 12,
    泰州市 = 13,
    宿迁市 = 14,
    昆山市 = 15,
    泰兴市 = 16,
    沭阳县 = 17,
    大丰 = 18,
}

export enum EnumAppRole {
    Patrol = 1,
    Law = 2,
    SearchPatrol = 3,
    SearchLaw = 4,
    Volunteer = 5
}

export enum EnumCulturalRelicLevel {
    全国重点文物保护单位 = 1,
    省级文物保护单位 = 2,
    市级文物保护单位 = 3,
    县区级文物保护单位 = 4,
    其他不可移动文物 = 5,
    博物馆 = 6,
    文物市场 = 7,
    工地 = 8
}

export enum EnumCoordinateObjectType {
    文物 = 1,
    博物馆 = 2,
}

export enum EnumSearchType {
    All = 1,
    FuzzySearch = 2,
    PreciseSearch = 3
}

export enum EnumCulturalRelicSearchType {
    全部 = 1,
    不可移动文物 = 2,
    博物馆 = 3,
    工地 = 4
}

export enum EnumMessageShowType {
    待办事宜 = 1,
    消息中心 = 2,
    督察通知 = 3,
    通知公告 = 4,
    全部消息 = 5
}

export enum EnumPublicOpinionShowType {
    全国文物舆情信息 = 1,
    省内文物舆情信息 = 2,
    省内文博大事 = 3
}

export enum EnumDistrictType {
    文物点 = 100,
    省 = 1,
    市 = 2,
    县区 = 3,
}

export enum EnumInspectorNoticeState {
    草稿 = 1,
    未回复 = 2,
    已回复 = 3
}

export enum EnumPatrolStatus {
    巡查正常 = 1,
    存在问题未处理 = 2,
    存在问题已处理 = 3,
    误判 = 4
}

/**
 * 巡查处理结果
 */
export enum EnumProcessResult {
    巡查问题提交 = 1,
    转送处理 = 2,
    提交执法队 = 3,
    存在问题已处理 = 4,
    误判 = 5,
    转为案件 = 6,
    无需立案 = 7,
    转他人处理 = 8,
}

/**
 * 巡查处理运行状态
 */
export enum EnumRunState {
    未阅 = 1,
    未处理 = 2,
    已处理 = 3,
    已撤销 = 4,
    他人已处理 = 5,
}


export enum EnumAttachmentType {
    不可移动文物附件 = 30,
    督查通知管理附件 = 31,
    巡查记录附件 = 32,
    法律法规附件 = 33,
    案件录入附件 = 34,
    立案阶段附件 = 35,
    调查取证阶段附件 = 36,
    案件审批阶段附件 = 37,
    处罚告知阶段附件 = 38,
    陈述申辩听证情况附件 = 39,
    处罚决定阶段附件 = 40,
    执行处罚阶段附件 = 41,
    整改阶段附件 = 42,
    结案阶段附件 = 43,
    归档阶段附件 = 44,
    简单流程执行处罚阶段附件 = 45,
    简单流程整改阶段附件 = 46,
    简流程归档阶段附件 = 47,
    文物保护单位抽查附件 = 50,
    不可移动文物缩略图 = 51,
    不可移动文物两线附件 = 52,
    不可移动文物两线缩略图 = 53,
    文物借方信息明细附件 = 54,
    巡查处理附件 = 55,
    通知公告附件 = 56
}

/**
 * 消息类型
 */
export enum EnumMessageCenterType {
    上报通知 = 1,
    指导意见 = 2,
    督察令通知 = 3,
    督察令回复 = 4,
    巡查自动预警 = 5,
    人员进出两线范围提醒 = 6,
    通知公告 = 7,
    巡查处理 = 8,
    立案逾期预警 = 9,
}