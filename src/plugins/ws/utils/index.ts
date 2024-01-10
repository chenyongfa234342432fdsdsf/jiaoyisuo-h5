/* eslint-disable @typescript-eslint/no-use-before-define */
import { WsBizEnum, WsTypesEnum } from '@/constants/ws'
import { Any } from '@/plugins/ws/protobuf/ts/google/protobuf/any'
import { Response, CommonRsp } from '@/plugins/ws/protobuf/ts/proto/Response'
import { Market } from '@/plugins/ws/protobuf/ts/proto/Market'
import { Notice } from '@/plugins/ws/protobuf/ts/proto/Notice'
import { Deal } from '@/plugins/ws/protobuf/ts/proto/Deal'
import { OptionKLine } from '@/plugins/ws/protobuf/ts/proto/OptionKLine'
import { Depth } from '@/plugins/ws/protobuf/ts/proto/Depth'
import { KLine } from '@/plugins/ws/protobuf/ts/proto/KLine'
import { Asset } from '@/plugins/ws/protobuf/ts/proto/Asset'
import { MarketActivities } from '@/plugins/ws/protobuf/ts/proto/MarketActivities'
import { PerpetualIndexPrice } from '@/plugins/ws/protobuf/ts/proto/PerpetualIndexPrice'
import { Order } from '@/plugins/ws/protobuf/ts/proto/Order'
import { ConceptPrice } from '@/plugins/ws/protobuf/ts/proto/ConceptPrice'
import { TradePairs, TradePairs_TradePair } from '@/plugins/ws/protobuf/ts/proto/TradePairs'
import { getBothSpotAndContractTypes } from '@/helper/ws'
import { PerpetualOrder } from '@/plugins/ws/protobuf/ts/proto/PerpetualOrder'
import { PerpetualGroupDetail } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupDetail'
import { PerpetualPlanOrder } from '@/plugins/ws/protobuf/ts/proto/PerpetualPlanOrder'
import { PerpetualProfitLoss } from '@/plugins/ws/protobuf/ts/proto/PerpetualProfitLoss'
import { PerpetualGroupRefresh } from '@/plugins/ws/protobuf/ts/proto/PerpetualGroupRefresh'
import { SpotAssetsChange } from '@/plugins/ws/protobuf/ts/proto/SpotAssetsChange'
import { OrderStatus } from '@/plugins/ws/protobuf/ts/proto/OrderStatus'
import { Rate } from '@/plugins/ws/protobuf/ts/proto/Rate'
import { C2cAccountChanged } from '@/plugins/ws/protobuf/ts/proto/C2cAccountChanged'
import { OptionMarket } from '@/plugins/ws/protobuf/ts/proto/OptionMarket'
import { Options } from '@/plugins/ws/protobuf/ts/proto/Options'
import { ClosePositionHistory } from '@/plugins/ws/protobuf/ts/proto/ClosePositionHistory'
import { OptionPlanOrder } from '@/plugins/ws/protobuf/ts/proto/OptionPlanOrder'
import { OptionOrder } from '@/plugins/ws/protobuf/ts/proto/OptionOrder'
import { OptionYieldChanged } from '@/plugins/ws/protobuf/ts/proto/OptionYieldChanged'
import { OptionYields } from '@/plugins/ws/protobuf/ts/proto/OptionYields'
import { SpotProfitLoss } from '@/plugins/ws/protobuf/ts/proto/SpotProfitLoss'

import { checkIsInBlackList } from '@/helper/common'
import { subscribeReqKeys, WSSendTypeEnum } from '../constants'
// https://cd.admin-devops.com/zentao/doc-objectLibs-custom-0-79-665.html#app=doc

/** pb 解码 */
export const PBDecode = (msg: Uint8Array): any => {
  const msgVal = Response.fromBinary(new Uint8Array(msg))

  if (checkIsInBlackList()) {
    return getPureMsgvalData(PBDecodeFeatures(msgVal))
  }

  return PBDecodeFeatures(msgVal)
}

function PBDecodeFeatures(msgVal) {
  const { type, data, biz } = msgVal || { type: undefined, data: undefined, biz: undefined }

  if (biz === WsBizEnum.option) {
    if (type === WsTypesEnum.market) {
      const val = Any.unpack(data, OptionMarket) as OptionMarket
      return { topic: getTopicKey(msgVal), data: val }
    }

    if (type === WsTypesEnum.ternaryOptionFullAmount) {
      const val = (Any.unpack(data, Options) as Options).list
      return { topic: getTopicKey(msgVal), data: val }
    }

    if (type === WsTypesEnum.kline || type === WsTypesEnum.kline_1s) {
      const val = Any.unpack(data, OptionKLine) as OptionKLine
      return { topic: getTopicKey(msgVal), data: val }
    }
    if (type === WsTypesEnum.optionYieldChanged) {
      const val = Any.unpack(data, OptionYieldChanged) as OptionYieldChanged
      return { topic: getTopicKey(msgVal), data: val }
    }
    if (type === WsTypesEnum.optionYields) {
      const val = Any.unpack(data, OptionYields) as OptionYields
      return { topic: getTopicKey(msgVal), data: val }
    }
  }

  if ([WsTypesEnum.market, WsTypesEnum.perpetualMarket].includes(type)) {
    const val = (Any.unpack(data, Market) as Market).market

    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.minedeal].includes(type)) {
    const val = (Any.unpack(data, Deal) as Deal).deal
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.deal, WsTypesEnum.perpetualDeal].includes(type)) {
    const val = (Any.unpack(data, Deal) as Deal).deal
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.depth, WsTypesEnum.perpetualDepth].includes(type)) {
    const val = Any.unpack(data, Depth) as Depth
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.kline, WsTypesEnum.perpetualKline].includes(type)) {
    const val = (Any.unpack(data, KLine) as KLine).kLine
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.asset].includes(type)) {
    const val = (Any.unpack(data, Asset) as Asset).asset
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.order].includes(type)) {
    const val = (Any.unpack(data, Order) as unknown as Order).order
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WSSendTypeEnum.login].includes(type)) {
    const val = Any.unpack(data as Any, CommonRsp) as unknown as CommonRsp
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.planOrder].includes(type)) {
    const val = (Any.unpack(data, Order) as unknown as Order).order
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.concept].includes(type)) {
    const val: any = Any.unpack(data as Any, ConceptPrice).list
    return { topic: getTopicKey(msgVal), data: val }
  }
  if (getBothSpotAndContractTypes(WsTypesEnum.marketFullAmount).includes(type)) {
    const val: any = Any.unpack(data as Any, TradePairs).list
    return { topic: getTopicKey(msgVal), data: val }
  }
  if (getBothSpotAndContractTypes(WsTypesEnum.marketSlow).includes(type)) {
    const val: any = Any.unpack(data as Any, Market).market
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.notice].includes(type)) {
    const val: any = Any.unpack(data as Any, Notice)
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.marketActivities].includes(type)) {
    const val: any = Any.unpack(data as Any, MarketActivities)
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.perpetualIndex].includes(type)) {
    const val = Any.unpack(data, PerpetualIndexPrice) as PerpetualIndexPrice
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.perpetualOrder].includes(type)) {
    const val = Any.unpack(data, PerpetualOrder) as PerpetualOrder
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.perpetualGroupDetail].includes(type)) {
    const val = Any.unpack(data, PerpetualGroupDetail) as PerpetualGroupDetail
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.PerpetualPlanOrder].includes(type)) {
    const val = Any.unpack(data, PerpetualPlanOrder) as PerpetualPlanOrder
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.PerpetualProfitLoss].includes(type)) {
    const val = Any.unpack(data, PerpetualProfitLoss) as PerpetualProfitLoss
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.perpetualGroupRefresh].includes(type)) {
    const val = Any.unpack(data, PerpetualGroupRefresh) as PerpetualGroupRefresh
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.spotAssetsChange].includes(type)) {
    const val = Any.unpack(data, SpotAssetsChange) as SpotAssetsChange
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.c2cOrder].includes(type)) {
    const val = Any.unpack(data, OrderStatus) as OrderStatus
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.rate].includes(type)) {
    const val = Any.unpack(data, Rate) as Rate
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.c2cAccount].includes(type)) {
    const val = Any.unpack(data, C2cAccountChanged) as C2cAccountChanged
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.closePositionHistory].includes(type)) {
    const val = Any.unpack(data, ClosePositionHistory) as ClosePositionHistory
    return { topic: getTopicKey(msgVal), data: val }
  }

  if ([WsTypesEnum.optionPlanOrder].includes(type)) {
    const val = Any.unpack(data, OptionPlanOrder) as OptionPlanOrder
    return { topic: getTopicKey(msgVal), data: val }
  }
  if ([WsTypesEnum.optionOrder].includes(type)) {
    const val = Any.unpack(data, OptionOrder) as OptionOrder
    return { topic: getTopicKey(msgVal), data: val }
  }

  if ([WsTypesEnum.spotProfitLoss].includes(type)) {
    const val = Any.unpack(data, SpotProfitLoss) as SpotProfitLoss
    return { topic: getTopicKey(msgVal), data: val }
  }

  return { topic: null, data: null }
}

/** json 字符串转对象 */
export const stringToJson = (message: string): any => {
  if (!message) {
    return null
  }
  try {
    message = JSON.parse(message)
  } catch (e) {
    console.warn(e)
  }
  return message
}

/** 是否为空 */
export const isEmpty = (data: any[]): boolean => !Array.isArray(data) || (Array.isArray(data) && data.length === 0)

export function alphabeticalSort(a, b) {
  return a.localeCompare(b)
}

/**
 * 按照顺序、排除某 Key 返回某对象
 * 需指定关键的 key
 */
function getSortKeyObject(val) {
  const sortKeys = Object.keys(val).sort()
  const obj = {}
  sortKeys.forEach(key => {
    if (subscribeReqKeys.includes(key) && val[key]) {
      obj[key] = val[key]
    }
  })
  return obj
}

// ios12.4 下包含特殊字符，需要去掉
// 如果有发现订阅不成功，可以在此查看是否有正则之外的字符，如果有，可以在此添加
function keepNormalChar(val: string) {
  // eslint-disable-next-line no-useless-escape
  const regex = /[^\u4e00-\u9fa5a-zA-Z0-9!@#$%^&*()"'_+{}\[\]:;<>,.?~\\-]/g
  return val.replace(regex, '')
}

// ios12 13 下包含特殊字符黑名单
function removeDataSpecialChar(val: string) {
  // eslint-disable-next-line no-useless-escape
  const regex = /\uFEFF/g
  return val.replace(regex, '')
}

/**
 * 解析纯字符串 topic 或者 json topic
 */
export function getTopicKey(val) {
  if (!val) {
    return ''
  }
  if (typeof val === 'string') {
    return keepNormalChar(JSON.stringify(val))
  }
  return keepNormalChar(JSON.stringify(getSortKeyObject(val)))
}

/**
 * 解析data
 */
export function getPureMsgvalData(val) {
  if (!val || typeof val === 'number') {
    return val
  }
  if (typeof val === 'string') {
    return removeDataSpecialChar(JSON.stringify(val))
  }

  return JSON.parse(removeDataSpecialChar(JSON.stringify(val)))
}
