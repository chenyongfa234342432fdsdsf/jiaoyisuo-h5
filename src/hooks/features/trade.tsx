import { getCurrencySettings } from '@/apis/assets/futures/common'
import { getUserAutoMarginGroup } from '@/apis/trade'
import { MarginModeSettingEnum, UserContractVersionEnum, UserFuturesTradeStatus } from '@/constants/trade'
import { getIsLogin } from '@/helper/auth'
import { link } from '@/helper/link'
import { getFutureTradePagePath } from '@/helper/route'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useMarketStore } from '@/store/market'
import { useContractMarketStore } from '@/store/market/contract'
import { useOrderBookStore } from '@/store/order-book'
import { useFutureTradeStore } from '@/store/trade/future'
import { useUserStore } from '@/store/user'
import { AssetsCurrencySettingsResp } from '@/typings/api/assets/futures'
import { AdjustCoinGroupType, IFutureCoinDetail } from '@/typings/api/trade'
import { YapiGetV1TradePairDetailData as ISpotCoin } from '@/typings/yapi/TradePairDetailV1GetApi'
import { useRequest, useMount } from 'ahooks'
import { useState } from 'react'

/** 获取现货交易当前币种 */
export function useTradeCurrentSpotCoin() {
  const marketState = useMarketStore()
  const currentSpotCoin = marketState.currentCoinExcludePrice

  return currentSpotCoin as any as ISpotCoin & {
    buyFee: number
    sellFee: number
  }
}
/** 获取现货交易当前币种 */
export function useTradeCurrentSpotCoinWithPrice() {
  const marketState = useMarketStore()
  const currentSpotCoin = marketState.currentCoin

  return currentSpotCoin as any as ISpotCoin
}
/** 获取合约当前币种 */
export function useTradeCurrentFutureCoin() {
  const marketState = useContractMarketStore()
  const currentFutureCoin = marketState.currentCoinExcludePrice
  return currentFutureCoin as IFutureCoinDetail
}
/** 获取合约当前币种带标记价格（更新更频繁） */
export function useTradeCurrentFutureCoinWithMarkPrice() {
  const marketState = useContractMarketStore()
  const currentFutureCoin = marketState.currentCoin
  const { contractMarkPriceInitialValue } = useOrderBookStore()
  return {
    ...currentFutureCoin,
    markPrice: contractMarkPriceInitialValue || currentFutureCoin.markPrice,
  } as any as IFutureCoinDetail
}

export function useLinkToFutureTradePage() {
  const { currentCoin: currentFutureCoin, defaultCoin } = useContractMarketStore()
  return () => {
    link(
      getFutureTradePagePath({
        symbolName: currentFutureCoin.symbolName || defaultCoin.symbolName || 'BTCUSD',
      })
    )
  }
}

export function useFutureTradeIsOpened() {
  const userState = useUserStore()
  const available = userState.personalCenterSettings.isOpenContractStatus === UserFuturesTradeStatus.open

  return available
}

export function useFutureVersionIsPro() {
  const userState = useUserStore()
  const isPro = userState.personalCenterSettings.perpetualVersion === UserContractVersionEnum.professional

  return isPro
}

/** 获取已设置自动追加保证金的合约组  */
export function useAutoAddMarginGroups() {
  const [groups, setGroups] = useState<Array<AdjustCoinGroupType>>([])
  const opened = useFutureTradeIsOpened()
  const { run, loading } = useRequest(
    async () => {
      if (!getIsLogin() || !opened) {
        return
      }
      const res = await getUserAutoMarginGroup({})
      if (!res.isOk || !res.data) return
      setGroups(res.data)
    },
    {
      manual: true,
    }
  )

  useMount(run)

  return {
    groups,
    loading,
    setGroups,
  }
}
/** 获取商户法币配置 */
export function useFutureCurrencySettings() {
  const { futureCurrencySettings, updateFutureCurrencySettings } = useFutureTradeStore()
  useMount(async () => {
    if (futureCurrencySettings.currencySymbol) {
      return
    }
    const res = await getCurrencySettings({})
    const { isOk, data } = res || {}

    if (!isOk || !data) {
      return
    }
    updateFutureCurrencySettings(data)
  })

  return futureCurrencySettings
}
