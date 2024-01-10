import { EntrustTypeEnum } from '@/constants/trade'
import { t } from '@lingui/macro'

export const useTradeEntrust = whetherIsSpot => {
  const entrustTabList = [
    { title: t`constants/trade-1`, id: EntrustTypeEnum.market },
    { title: t`constants/trade-0`, id: EntrustTypeEnum.limit },
    { title: t`constants/trade-3`, id: EntrustTypeEnum.plan },
  ]

  whetherIsSpot && entrustTabList.push({ title: t`features_orders_future_holding_index_610`, id: EntrustTypeEnum.stop })

  return { entrustTabList }
}

export enum HandleMode {
  BUY = 'buy',
  SELL = 'sell',
}
