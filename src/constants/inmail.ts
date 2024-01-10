export enum InmailMessageEnum {
  market = 'marketFluctuation', // 行情异动
  price = 'priceSubscribe', // 价格订阅
  contract = 'contractWarning', // 合约预警
  information = 'systemNotice', // 系统通知
  announcement = 'announcement', // 公告消息
  currency = 'latestActivity', // 新币早知道
  activity = 'knowNewCurrency', // 最新活动
  email = 'email', // 营销类邮件
}

export const InmailMessageArray = [
  InmailMessageEnum.information,
  InmailMessageEnum.announcement,
  InmailMessageEnum.currency,
  InmailMessageEnum.activity,
  InmailMessageEnum.email,
]
