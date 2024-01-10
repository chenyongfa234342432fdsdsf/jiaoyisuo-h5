import { Depth, Depth_Data } from '@/plugins/ws/protobuf/ts/proto/Depth'
import { formatNumberDecimal, formatCurrency } from '@/helper/decimal'
import { TradeModeEnum } from '@/constants/trade'
import { baseOrderBookStore } from '@/store/order-book'

export enum OrderBookDepthTypeDefaultEnum {
  default = '0.01',
}

export enum OrderBookLimitTypeEnum {
  default = 1,
  double = 2,
}

export enum OrderBookListLimitEnum {
  ten = 10, // 10 条
  twenty = 20, // 20 条
}

export enum ContainerHeightTypeEnum {
  spotHeaderAndTickHeight = 129, // 现货买卖盘容器高度
  contractHeaderAndTickHeight = 149, // 合约买卖盘容器高度
  cellHeight = 20,
}

export enum OrderBookBizEnum {
  spot = 'spot',
  perpetual = 'perpetual',
  option = 'option',
}

export enum OrderBookTypeEnum {
  depth = 'depth', // 现货深度数据
  deal = 'deal', // 现货实时成交
  market = 'market', // 现货最新价
  perpetualDepth = 'perpetual_depth', // 合约深度数据
  perpetualMarket = 'perpetual_market', // 合约最新价
  perpetualIndex = 'perpetual_index', // 标记价格/指数价格
  kline = 'kline',
  kline1s = 'kline_1s',
}

export enum OrderBookButtonTypeEnum {
  buy = 1, // 买盘
  sell, // 卖盘
  primary, // 买卖盘
}

/** 盘口数据传入方式 */
export enum OrderBookDataTypeEnum {
  base = 'base', // 基础
  specialized = 'specialized', // 专业
  lever = 'lever', // 杠杆
}

export enum MergeDepthValueEnum {
  noDecimalPoint = 0,
  singleDigit = 1,
  doubleDigits = 2,
  ten = 10,
  twenty = 20,
  thirty = 30,
  forty = 40,
  fifty = 50,
  oneHundred = 100,
}

export interface EntrustType {
  buyEntrustPrice: Array<number>
  sellEntrustPrice: Array<number>
}

export interface OrderBookDepthDataType extends Depth_Data {
  turnover: string
  volumeInitialValue: string
  totalInitialValue: string
  grandTotal: string
  bodyWidth?: number
  turnoverInitialValue: string
  isEntrust?: boolean
  tagPrice: string
  formatPrice: string
}

/** 现货 subs 配置 */
export const OrderBookSpotDepthSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.spot,
    type: OrderBookTypeEnum.depth,
    granularity: '',
    contractCode: code,
  }
}

export const OrderBookSpotMarketSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.spot,
    type: OrderBookTypeEnum.market,
    granularity: '',
    contractCode: code,
  }
}

/** 合约 subs 配置 */
export const OrderBookContractDepthSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.perpetual,
    type: OrderBookTypeEnum.perpetualDepth,
    granularity: '',
    contractCode: code,
  }
}

export const OrderBookContractMarketSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.perpetual,
    type: OrderBookTypeEnum.perpetualMarket,
    granularity: '',
    contractCode: code,
  }
}

export const OrderBookContractMarkPriceSubs = (code: string) => {
  return {
    biz: OrderBookBizEnum.perpetual,
    type: OrderBookTypeEnum.perpetualIndex,
    granularity: '',
    contractCode: code,
  }
}

// 深度盘口
export const DeepHandicapOptions = [15, 30, 50, 70] // 数字为展示的条数
const repeatString = '0'

// 盘口精度映射 最多 10 位
export const HandicapAccuracy = {
  '0.0000000001': 10,
  '0.000000001': 9,
  '0.00000001': 8,
  '0.0000001': 7,
  '0.000001': 6,
  '0.00001': 5,
  '0.0001': 4,
  '0.001': 3,
  '0.01': 2,
  '0.1': 1,
}

export function getGearNumbers(height: number, mode: number, tradeMode: string, hasIndexPrice: boolean): number {
  const headerAndTickHeight =
    tradeMode === TradeModeEnum.spot
      ? ContainerHeightTypeEnum.spotHeaderAndTickHeight
      : tradeMode === TradeModeEnum.futures && hasIndexPrice
      ? ContainerHeightTypeEnum.contractHeaderAndTickHeight
      : ContainerHeightTypeEnum.spotHeaderAndTickHeight
  const cellContainerHeight = (height as number) - headerAndTickHeight

  const num =
    mode !== OrderBookButtonTypeEnum.primary
      ? cellContainerHeight / ContainerHeightTypeEnum.cellHeight
      : cellContainerHeight / OrderBookLimitTypeEnum.double / ContainerHeightTypeEnum.cellHeight

  return Math.floor(num)
}

export function formatNumberUnit(num: string, mergeDepth: number) {
  if (Number(num) < 1e3) return num
  if (mergeDepth < 0) mergeDepth = 0
  const abbrev = ['', 'K', 'M', 'B', 'T']
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(Number(num))) / 3)
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1))
  const suffix = abbrev[order]

  return formatNumberDecimal(Number(num) / 10 ** (order * 3), mergeDepth) + suffix
}

/**
 * @description: 获取不同 mergeDepth 的刻度值
 * @param {*} price
 * @param {*} mergeDepth
 */
function formatNumber(price, mergeDepth) {
  price = String(Math.floor(price))
  if (mergeDepth === '1') {
    return price
  }
  const num = price.length - Math.ceil(Math.log10(mergeDepth)) - 1
  const startNum = price.slice(0, num)
  const endNum = price.slice(num, price.length)
  const resultEndNum = mergeDepth * Math.floor(endNum / mergeDepth) || repeatString.repeat(mergeDepth.length)
  return `${startNum}${resultEndNum}`
}
/**
 * @description: 根据合并精度获取向下约的价格<<刻度值>>
 */
function getTagPriceByMergeDepth(price, mergeDepth, buyOrSell) {
  if (mergeDepth in HandicapAccuracy) {
    return formatNumberDecimal(price, HandicapAccuracy[mergeDepth], buyOrSell === OrderBookButtonTypeEnum.sell)
  }
  return formatNumber(price, mergeDepth)
}

export const HandlingEmptyData = (num: number) => {
  return new Array(num).fill({
    price: '--',
    tagPrice: '--',
    formtPrice: '--',
    volume: '--',
    volumeInitialValue: '--',
    turnoverInitialValue: '--',
    turnover: '--',
    grandTotal: '--',
    bodyWidth: 0,
  })
}

class OrderBookDepthData {
  /** 价格 */
  public price: string

  /** 精度价格 */
  public tagPrice: string

  /** 数量 */
  public volume: string

  /** 合计 */
  public turnover: string

  /** 乘积缓存 价格乘以数量 */
  public productCache: number

  /** 成交额初始值 */
  public turnoverInitialValue: string

  /** 累计 */
  public grandTotal: number

  /** 弹窗宽度 */
  public bodyWidth: number

  public popVolume: string

  /** 是否有委托订单 */
  public isEntrust: boolean

  /** 合并精度 */
  public priceMergeDepth: number

  public dataList: OrderBookDepthDataType[]

  public accumulate: number

  public grandTotalDecimal: string

  /** 未格式化的数量 */
  public volumeInitialValue: string

  /** 合计原始值 */
  public totalInitialValue: string

  /** 价格映射 */
  public listMap: { [key: string]: any }

  public volumeTemporary: number

  public cacheData: any

  public resultVal: any

  public popVolumeTemporary: number

  constructor() {
    this.price = ''
    this.tagPrice = ''
    this.volume = ''
    this.productCache = 0
    this.turnover = ''
    this.popVolume = ''
    this.turnoverInitialValue = ''
    this.grandTotal = 0
    this.bodyWidth = 0
    this.isEntrust = false
    this.dataList = []
    this.priceMergeDepth = 0
    this.accumulate = 0
    this.grandTotalDecimal = ''
    this.volumeInitialValue = ''
    this.totalInitialValue = ''
    this.listMap = {}
    this.popVolumeTemporary = 0
    this.volumeTemporary = 0
    this.cacheData = {}
  }
}

/** 单例对象 */
export const DepthDataObject = (() => {
  let instance: OrderBookDepthData | null = null

  const createInstance = () => {
    return new OrderBookDepthData()
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    },
    destroyInstance: () => {
      instance = null
    },
  }
})()

const DepthData = DepthDataObject.getInstance()

export const HandleDecimalPoint = (
  list: Depth_Data[],
  mergeDepth: string,
  entrust: Array<number>,
  isSell?: boolean
) => {
  let { dataList, listMap, tagPrice, isEntrust, price, volume, cacheData, resultVal } = DepthData

  dataList = []
  listMap = {}

  list.forEach((v: Depth_Data) => {
    resultVal = { ...v }
    tagPrice = getTagPriceByMergeDepth(resultVal.price || '0', mergeDepth, isSell)
    isEntrust = entrust?.includes(Number(resultVal.price)) || false
    price = resultVal.price
    volume = resultVal.volume
    // 根据精度换算出的相同价格处理
    cacheData = listMap[tagPrice]
    if (cacheData) {
      listMap[tagPrice] = {
        price,
        tagPrice,
        volume: Number(cacheData.volume) + Number(volume),
        isEntrust,
      }
    } else {
      listMap[tagPrice] = {
        price,
        tagPrice,
        volume,
        isEntrust,
      }
    }
  })

  Object.keys(listMap).forEach(key => {
    dataList.push({ ...listMap[key] })
  })

  return dataList
}

export const HandleDepthData = (data: Depth, entrust: EntrustType) => {
  let bidsList: OrderBookDepthDataType[] = []
  let asksList: OrderBookDepthDataType[] = []

  const { wsDepthConfig } = baseOrderBookStore.getState()

  if (data.bids?.length > 0) {
    const mirrorList = [...data.bids]

    bidsList = HandleDecimalPoint(mirrorList, wsDepthConfig.mergeDepth, entrust?.buyEntrustPrice, false)

    bidsList.sort((a, b) => Number(b?.tagPrice) - Number(a?.tagPrice))
  }

  if (!data.bids || data.bids?.length < 1) {
    bidsList = HandlingEmptyData(OrderBookListLimitEnum.twenty)
  }

  if (data.asks?.length > 0) {
    const mirrorList = [...data.asks]
    asksList = HandleDecimalPoint(mirrorList, wsDepthConfig.mergeDepth, entrust?.sellEntrustPrice, true)

    asksList.sort((a, b) => Number(a?.tagPrice) - Number(b?.tagPrice))
  }

  if (!data.asks || data.asks?.length < 1) {
    asksList = HandlingEmptyData(OrderBookListLimitEnum.twenty)
  }

  return { bidsList, asksList }
}

export const HandleCurrencyPair = (currencyPair: string) => {
  let targetCoin = ''
  let denominatedCurrency = ''

  if (currencyPair && currencyPair.includes('_')) {
    const currencyList = currencyPair.toLocaleUpperCase().split('_')
    targetCoin = currencyList[0]
    denominatedCurrency = currencyList[1]
  }
  return { targetCoin, denominatedCurrency }
}

/** 处理盘口当前档位统计数值 */
export const handleOrderBookPopUpValue = (data: OrderBookDepthDataType[]) => {
  if (!data || data[0]?.price === '--') return data

  const { wsDepthConfig } = baseOrderBookStore.getState()

  const list = [...data]
  let dataList: OrderBookDepthDataType[] = []

  let {
    priceMergeDepth,
    price,
    volume,
    turnover,
    popVolume,
    popVolumeTemporary,
    turnoverInitialValue,
    volumeInitialValue,
    totalInitialValue,
    grandTotal,
    grandTotalDecimal,
    accumulate,
    tagPrice,
    productCache,
  } = DepthData

  accumulate = 0
  popVolumeTemporary = 0

  // 价格精度
  priceMergeDepth =
    wsDepthConfig.mergeDepth && HandicapAccuracy[wsDepthConfig.mergeDepth]
      ? HandicapAccuracy[wsDepthConfig.mergeDepth]
      : wsDepthConfig.mergeDepth && Number(wsDepthConfig.mergeDepth) >= MergeDepthValueEnum.noDecimalPoint
      ? MergeDepthValueEnum.noDecimalPoint
      : MergeDepthValueEnum.doubleDigits

  list.forEach(v => {
    tagPrice = formatNumberDecimal(v.tagPrice, priceMergeDepth)
    price = formatNumberDecimal(v.price, priceMergeDepth)
    volume = formatNumberDecimal(v.volume, wsDepthConfig.amountOffset)
    productCache = Number(tagPrice) * Number(volume)
    volumeInitialValue = formatNumberDecimal(v.volume, wsDepthConfig.amountOffset)
    totalInitialValue = formatNumberDecimal(Number(v.volume) + popVolumeTemporary, wsDepthConfig.amountOffset)
    turnoverInitialValue = formatNumberDecimal(productCache, wsDepthConfig.fiatOffest)
    turnover = formatNumberDecimal(productCache, wsDepthConfig.priceOffset)
    grandTotal = accumulate + Number(v.volume)
    grandTotalDecimal = formatNumberDecimal(grandTotal, wsDepthConfig.amountOffset)
    popVolume = formatNumberDecimal(Number(v.volume) + popVolumeTemporary, wsDepthConfig.amountOffset)

    accumulate = grandTotal
    popVolumeTemporary = Number(popVolume)
    turnoverInitialValue = formatNumberUnit(
      turnoverInitialValue,
      wsDepthConfig.fiatOffest ? wsDepthConfig.fiatOffest - 1 : wsDepthConfig.fiatOffest
    )
    turnover = formatNumberUnit(
      turnover,
      wsDepthConfig.priceOffset ? wsDepthConfig.priceOffset - 1 : wsDepthConfig.priceOffset
    )

    dataList.push({
      ...v,
      price,
      tagPrice,
      formatPrice: formatCurrency(v.tagPrice, priceMergeDepth),
      volume,
      grandTotal: grandTotalDecimal,
      turnover,
      turnoverInitialValue,
      volumeInitialValue,
      totalInitialValue,
    })
  })

  return dataList
}
