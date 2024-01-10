import { TernaryOptionTradeDirectionEnum } from '@/constants/ternary-option'
import { WsBizEnum, WsTypesEnum } from '@/constants/ws'
import { baseOptionPositionStore } from '@/store/ternary-option/position'
import { IOptionPositionList } from '@/typings/api/ternary-option/position'
import { t } from '@lingui/macro'
import { SwitchTimeType, TimeSharingType } from '@nbit/chart-utils'
import { OrderBookBizEnum, OrderBookTypeEnum } from '@/store/order-book/common'
import { getBusinessId } from './common'

/** 格式化期权时间展示 */
export function formatTimeLabel(seconds: number) {
  return seconds >= 60
    ? t({
        id: `helper_ternary_option_rv73pbzgr2`,
        values: {
          // 假定为整数
          0: seconds / 60,
        },
      })
    : t({
        id: `helper_ternary_option_0qz3qx1jwv`,
        values: {
          0: seconds,
        },
      })
}
/** 三元期权是否为涨 */
export function isUpOptionDirection(direction: TernaryOptionTradeDirectionEnum) {
  return [TernaryOptionTradeDirectionEnum.call, TernaryOptionTradeDirectionEnum.overCall].includes(direction)
}
/** 三元期权是否为涨超、跌超 */
export function isOverOptionDirection(direction: TernaryOptionTradeDirectionEnum) {
  return [TernaryOptionTradeDirectionEnum.overCall, TernaryOptionTradeDirectionEnum.overPut].includes(direction)
}

/**
 * 根据持仓列表过滤 symbol
 * @param positionList 当前持仓列表
 */
export const onFilterSymbol = (positionList: IOptionPositionList[]) => {
  const optionPositionStore = baseOptionPositionStore.getState()
  let newList: string[] = []
  for (let i = 0; i < positionList.length; i += 1) {
    if (newList.indexOf(positionList[i].symbol) === -1) {
      newList.push(positionList[i].symbol)
    }
  }

  optionPositionStore.updatePositionSymbolList(newList)
}

export function getOptionWsContractCode(code: string) {
  return `${getBusinessId()}_${code}`
}

export const OrderBookOptionKlineSubs = (code: string, time: SwitchTimeType) => {
  return {
    biz: OrderBookBizEnum.option,
    type: time.unit === TimeSharingType.Second ? OrderBookTypeEnum.kline1s : OrderBookTypeEnum.kline,
    contractCode: getOptionWsContractCode(code),
  }
}

/**
 * 根据 symbol 生成指数价格/标记价格推送 subs
 * @param type 订阅类型
 */
export const onGetMarkPriceSubs = () => {
  const { positionSymbolList = [] } = baseOptionPositionStore.getState()

  if (positionSymbolList && positionSymbolList.length > 0) {
    const newList = positionSymbolList.map((contractCode: string) => {
      return {
        biz: WsBizEnum.option,
        type: WsTypesEnum.optionMarket,
        contractCode: getOptionWsContractCode(contractCode),
      }
    })

    return newList
  }
}
