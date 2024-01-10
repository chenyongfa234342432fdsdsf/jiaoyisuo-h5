import { EntrustTypeEnum, SpotStopLimitTypeEnum } from '@/constants/trade'
import { useSpotTradeStore } from '@/store/trade/spot'
import { IUseInSubParams } from './common'

export function useSpotStopLimitContextInSub({
  useOnChange,
  resetData,
  fillEntrustPrice,
  latestPrice,
  allHandlers,
}: IUseInSubParams) {
  const { settings: spotSettings } = useSpotTradeStore()

  const onStopLossTriggerPriceChange = useOnChange((value: string, tempTradeInfo) => {
    tempTradeInfo.stopLossTriggerPrice = value
    // 对于市价单，同步更新触发价格和委托价格
    if (tempTradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market) {
      allHandlers.onStopLossPriceChange(value, tempTradeInfo)
    }
  })
  const onStopProfitTriggerPriceChange = useOnChange((value: string, tempTradeInfo) => {
    tempTradeInfo.stopProfitTriggerPrice = value
    // 对于市价单，同步更新触发价格和委托价格
    if (tempTradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market) {
      allHandlers.onStopProfitPriceChange(value, tempTradeInfo)
    }
  })
  const onSpotStopLimitTypeChange = useOnChange((value: SpotStopLimitTypeEnum, tempTradeInfo) => {
    resetData(tempTradeInfo, {
      keepStopLimit: false,
    })
    tempTradeInfo.spotStopLimitType = value
    tempTradeInfo.stopProfitPrice = fillEntrustPrice
    tempTradeInfo.stopLossPrice = fillEntrustPrice
    spotSettings.updateStopLimitType(value)
  })
  const onStopProfitEntrustPriceTypeChange = useOnChange((value: EntrustTypeEnum, tempTradeInfo) => {
    tempTradeInfo.stopProfitEntrustPriceType = value
    spotSettings.updateStopProfitEntrustPriceType(value)
    // 对于市价单，同步更新触发价格和委托价格
    if (tempTradeInfo.stopProfitEntrustPriceType === EntrustTypeEnum.market) {
      allHandlers.onStopProfitPriceChange(tempTradeInfo.stopProfitTriggerPrice, tempTradeInfo)
    } else {
      allHandlers.onStopProfitPriceChange(latestPrice, tempTradeInfo)
    }
  })
  const onStopLossEntrustPriceTypeChange = useOnChange((value: EntrustTypeEnum, tempTradeInfo) => {
    tempTradeInfo.stopLossEntrustPriceType = value
    spotSettings.updateStopLossEntrustPriceType(value)
    // 对于市价单，同步更新触发价格和委托价格
    if (tempTradeInfo.stopLossEntrustPriceType === EntrustTypeEnum.market) {
      allHandlers.onStopLossPriceChange(tempTradeInfo.stopLossTriggerPrice, tempTradeInfo)
    } else {
      allHandlers.onStopLossPriceChange(latestPrice, tempTradeInfo)
    }
  })

  return {
    onStopLossTriggerPriceChange,
    onStopProfitTriggerPriceChange,
    onSpotStopLimitTypeChange,
    onStopProfitEntrustPriceTypeChange,
    onStopLossEntrustPriceTypeChange,
  }
}
