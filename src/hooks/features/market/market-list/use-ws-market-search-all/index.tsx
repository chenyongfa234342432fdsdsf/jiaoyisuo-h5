import { getTradePairListBySearch } from '@/apis/market/market-list'
import { toMarketListGlobalSearchWithAllType } from '@/helper/market/market-list'
import {
  useWsFuturesMarketTradePairFullAmount,
  useWsSpotMarketTradePairFullAmount,
} from '@/hooks/features/market/common/market-ws/use-ws-market-trade-pair-full-amount'
import useReqeustMarketHelper from '@/hooks/features/market/common/use-request-market'
import { useCommonStore } from '@/store/common'
import {
  YapiGetV1TradePairSearchApiRequest,
  YapiGetV1TradePairSearchData,
} from '@/typings/yapi/TradePairSearchV1GetApi'
import { AuthModuleEnum, getAuthModuleStatusByKey } from '@/helper/modal-dynamic'
import { useSafeState, useUpdateEffect } from 'ahooks'

export default function ({ apiParams }: { apiParams: YapiGetV1TradePairSearchApiRequest }) {
  const [apiData, setApiData] = useSafeState<Partial<YapiGetV1TradePairSearchData> | null>({ spot: [] })
  const [resolvedData, setResolvedData] = useSafeState<Partial<YapiGetV1TradePairSearchData>>({ spot: [] })
  const wsSpotData = useWsSpotMarketTradePairFullAmount({ apiData: apiData?.spot })
  const wsFuturesData = useWsFuturesMarketTradePairFullAmount({ apiData: apiData?.perpetual })
  const { isFusionMode } = useCommonStore()

  const { refreshCallback, apiStatus } = useReqeustMarketHelper({
    setApiData: _data => {
      setApiData(_prev => {
        const isShowSpot = getAuthModuleStatusByKey(AuthModuleEnum.spot)
        const isShowContract = getAuthModuleStatusByKey(AuthModuleEnum.contract)
        const spotData = _data?.spot || _prev?.spot
        const perpetualData = _data?.perpetual || _prev?.perpetual
        return {
          spot: isShowSpot ? spotData || [] : [],
          perpetual: isShowContract ? perpetualData || [] : [],
        }
      })
    },
    apiRequest: (resolve, reject) => {
      getTradePairListBySearch(apiParams).then(res => {
        if (res.isOk) {
          if (isFusionMode) {
            // 融合模式只展示合约
            return resolve({ perpetual: res.data?.perpetual || [] })
          }
          return resolve(res.data || {})
        }
        reject()
      })
    },
    deps: [apiParams.symbolName],
    apiPreValidation: () => {
      if (!apiParams.symbolName) return false
      return true
    },
  })

  useUpdateEffect(() => {
    setResolvedData({
      spot: wsSpotData,
      perpetual: wsFuturesData,
    })
  }, [wsSpotData, wsFuturesData])

  return {
    resolvedAllData: toMarketListGlobalSearchWithAllType(resolvedData) || {},
    refreshCallback,
    apiStatus,
    setApiData,
  }
}
