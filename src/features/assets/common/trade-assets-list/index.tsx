/**
 * 现货 - 下单页资产列表组件
 */
import { t } from '@lingui/macro'
import { useState } from 'react'
import { formatCoinAmount, rateFilter } from '@/helper/assets/spot'
import {
  CoinListResp,
  TradeListPerpetualResp,
  TradeListSpotResp,
  AssetsTradeListResp,
} from '@/typings/api/assets/assets'
import DomAutoScaleWrapper from '@/components/dom-auto-scale-wrapper'
import { Popup, Toast } from '@nbit/vant'
import { MainTypeDepositTypeEnum } from '@/constants/assets'
import { getAssetTradeList, getTradeList } from '@/apis/assets/coin'
import { formatNumberDecimal } from '@/helper/decimal'
import LazyImage from '@/components/lazy-image'
import CommonList from '@/components/common-list/list'
import { useMarketStore } from '@/store/market/index'
import { useUpdateEffect } from 'ahooks'
import { useGetWsAssets } from '@/hooks/features/assets/spot'
import { useAssetsStore } from '@/store/assets/spot'
import Icon from '@/components/icon'
// import { CommonDigital } from '@/components/common-digital'
import { useOnPageRefresh } from '@/hooks/use-on-page-refresh'
import { AuthModuleEnum, getAuthModuleStatusByKey } from '@/helper/modal-dynamic'
import {
  useWsFuturesMarketTradePairRealTime,
  useWsSpotMarketTradePairRealTime,
} from '@/hooks/features/market/common/market-ws/use-ws-market-trade-pair'
import { getTradeCoinTypeEnumName } from '@/constants/assets/trade'
import { IncreaseTag } from '@nbit/react'
import { getQuerySubCoinList } from '@/apis/assets/common'
import { getV1C2cAreaCheckCoinHasAreaApiRequest } from '@/apis/c2c/trade'
import { getAssetsRechargePageRoutePath, getFutureTradePagePath, getTradePagePath } from '@/helper/route'
import { TradeAssetsHandeItem } from '@/features/assets/common/trade-assets-hande-item'
import { link } from '@/helper/link'
import { basePersonalCenterStore } from '@/store/user/personal-center'
import { useContractMarketStore } from '@/store/market/contract'
import styles from '../common.module.css'

// 交易列表类型
export enum TradeListTypeEnum {
  // 现货
  spot = 'spot',
  // 永续合约
  perpetual = 'perpetual',
}

function TradeAssetsList() {
  useGetWsAssets({ isUpdateOverview: false })

  const { currentCoin: currentFutureCoin, defaultCoin } = useContractMarketStore()
  const { assetsModule } = useAssetsStore()

  const { currencySymbol } = basePersonalCenterStore.getState().fiatCurrencyData

  const [finished, setFinished] = useState<boolean>(false)
  const [sellCoin, setSellCoin] = useState<CoinListResp>({ coinId: '' } as CoinListResp)
  const [buyCoin, setBuyCoin] = useState<CoinListResp>({ coinId: '' } as CoinListResp)

  const [otherList, setOtherList] = useState<CoinListResp[]>([])
  const { currentCoin } = useMarketStore()
  const [tardeData, setTardeData] = useState<AssetsTradeListResp>({})

  const isShowSpot = getAuthModuleStatusByKey(AuthModuleEnum.spot)
  const isShowContract = getAuthModuleStatusByKey(AuthModuleEnum.contract)

  const [openTradeCoin, setOpenTradeCoin] = useState<CoinListResp>()

  const [isNotLetGoC2C, setIsNotLetGoC2C] = useState<boolean>(false)

  const spotData = useWsSpotMarketTradePairRealTime({
    apiData: isShowSpot ? tardeData?.spot : undefined,
    isDeleteMapKey: true,
  })

  const [tradeHandleVisible, setTradeHandleVisible] = useState<boolean>(false)

  const perpetualWsData = useWsFuturesMarketTradePairRealTime({
    apiData: isShowContract ? tardeData?.perpetual : undefined,
    isDeleteMapKey: true,
  })

  const tardeList = [
    ...(spotData || []).map((item: TradeListSpotResp) => ({ ...item, type: TradeListTypeEnum.spot })),
    ...(perpetualWsData || []).map((item: TradeListPerpetualResp) => ({ ...item, type: TradeListTypeEnum.perpetual })),
  ]

  const sortFn = (a: CoinListResp, b: CoinListResp) => {
    return (b.usdBalance as unknown as number) - (a.usdBalance as unknown as number)
  }

  const computedRate = item => {
    return Number(rateFilter({ amount: Number(item.totalAmount), showUnit: false, symbol: item.symbol }))
  }

  const otherListsortFn = (a: CoinListResp, b: CoinListResp) => {
    return computedRate(b) - computedRate(a)
  }

  /**
   * 获取币种列表
   */
  const onLoadList = async (isRefresh?: boolean) => {
    const res = await getAssetTradeList({ tradeId: currentCoin.id })

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      setFinished(true)
      return
    }

    if (data && data.length > 0) {
      const oList = data
        .filter((item: CoinListResp) => {
          return (
            // Number(item.totalAmount) > 0 &&
            item.symbol !== currentCoin?.sellSymbol && item.symbol !== currentCoin?.buySymbol
          )
        })
        .sort(sortFn)

      setSellCoin(
        data.find((item: CoinListResp) => item.symbol === currentCoin?.sellSymbol) || ({ coinId: '' } as CoinListResp)
      )
      setBuyCoin(
        data.find((item: CoinListResp) => item.symbol === currentCoin?.buySymbol) || ({ coinId: '' } as CoinListResp)
      )
      const isRefreshOtherList = isRefresh ? oList : [...otherList, ...oList]

      setOtherList(isRefreshOtherList.sort(otherListsortFn))
    }

    setFinished(true)
  }

  const onLoadTradeList = async sellCoinId => {
    const res = await getTradeList({
      sellCoinId,
    })

    const { isOk, data } = res || {}
    if (!isOk || !data) return

    setTardeData(data)
  }

  const setOpenTradeHandle = params => {
    onLoadTradeList(params?.coinId)
    setOpenTradeCoin(params)
    setTradeHandleVisible(true)
  }

  const setCloseTradeHandle = () => {
    setTradeHandleVisible(false)
    setTardeData({})
  }

  // useMount(() => {
  //   onLoadTradeList()
  // })

  useOnPageRefresh(() => {
    onLoadList(true)
  })

  // 监听推送数据更新，根据更新数据重新请求数据
  useUpdateEffect(() => {
    onLoadList(true)
  }, [currentCoin.sellSymbol, currentCoin.buySymbol, assetsModule.coinAssetsList])

  const isNotSellCoin = coinName => {
    // if (Number(totalAmount) === 0) {
    //   return false
    // }

    return currentCoin.buySymbol !== coinName
  }

  const toRechargeHandle = async () => {
    const { isOk, data } = await getQuerySubCoinList({ coinId: openTradeCoin?.coinId as string })
    if (isOk) {
      const isNotDeposit = data?.subCoinList?.find(item => item?.isDeposit === MainTypeDepositTypeEnum.yes)
      isNotDeposit
        ? link(getAssetsRechargePageRoutePath(openTradeCoin?.coinId))
        : Toast.info(t`features_orders_spot_spot_not_asset_ipomakf6mw`)
    }
  }

  const setOpenPopup = async () => {
    const { isOk, data } = await getV1C2cAreaCheckCoinHasAreaApiRequest({ coinId: openTradeCoin?.coinId as string })
    if (isOk) {
      setIsNotLetGoC2C(data as boolean)
    }
  }

  const getCurrencySymbolAssets = newAssets => {
    return `${currencySymbol}${newAssets}`
  }

  /**
   * 币种信息 item
   */
  const onLoadCoinItem = (params: CoinListResp) => {
    const {
      appLogo = '',
      coinName = '--',
      totalAmount = '',
      availableAmount = '',
      symbol = '',
      lockAmount = '',
    } = params

    return (
      <div className="current-item" key={symbol}>
        <div className="current-info">
          <div className="info-left">
            <LazyImage src={appLogo} width={20} height={20} round className="coin-icon" />
            <span>{coinName}</span>
          </div>
          {isNotSellCoin(symbol) && <Icon name="contract_more" hasTheme onClick={() => setOpenTradeHandle(params)} />}
          {/* <CommonDigital content={`${formatCoinAmount(symbol, totalAmount)}`} /> */}
        </div>
        <div className="flex">
          <DomAutoScaleWrapper dep={totalAmount + lockAmount + availableAmount}>
            <div className="expand-info-detail w-[400px]">
              <div className="info-detail-item">
                <div className="mt-2 text-text_color_02 text-xs">{t`features_home_components_header_login_info_index_510102`}</div>
                <div className="flex">
                  <DomAutoScaleWrapper dep={totalAmount}>
                    <div className="text-text_color_01 text-base font-medium">
                      {formatCoinAmount(symbol, totalAmount)}
                    </div>
                  </DomAutoScaleWrapper>
                </div>
                {Number(totalAmount) !== 0 && (
                  <div className="text-text_color_02 text-xs">
                    {!isNotSellCoin(symbol)
                      ? getCurrencySymbolAssets(formatCoinAmount(symbol, totalAmount))
                      : rateFilter({ amount: totalAmount, symbol })}
                  </div>
                )}
              </div>
              <div className="info-detail-item px-1.5">
                <div className="mt-2 text-text_color_02 text-xs">{t`features_assets_common_trade_assets_list_index_ymf1i60dfg`}</div>
                <div className="flex">
                  <DomAutoScaleWrapper dep={lockAmount}>
                    <div className="text-text_color_01 text-base font-medium">
                      {formatCoinAmount(symbol, lockAmount)}
                    </div>
                  </DomAutoScaleWrapper>
                </div>
                {Number(totalAmount) !== 0 && (
                  <div className="text-text_color_02 text-xs">
                    {!isNotSellCoin(symbol)
                      ? getCurrencySymbolAssets(formatCoinAmount(symbol, lockAmount))
                      : rateFilter({ amount: lockAmount, symbol })}
                  </div>
                )}
              </div>
              <div className="info-detail-item">
                <div className="mt-2 text-text_color_02 text-xs">{t`features_trade_future_settings_margin_auto_detail_coins_5101376`}</div>
                <div className="flex">
                  <DomAutoScaleWrapper dep={availableAmount}>
                    <div className="text-text_color_01 text-base font-medium">
                      {formatCoinAmount(symbol, availableAmount)}
                    </div>
                  </DomAutoScaleWrapper>
                </div>
                {Number(totalAmount) !== 0 && (
                  <div className="text-text_color_02 text-xs">
                    {!isNotSellCoin(symbol)
                      ? getCurrencySymbolAssets(formatCoinAmount(symbol, availableAmount))
                      : rateFilter({ amount: availableAmount, symbol })}
                  </div>
                )}
              </div>
            </div>
          </DomAutoScaleWrapper>
        </div>
      </div>
    )
  }

  return (
    <div className={styles['trade-assets-list']}>
      <div className="current-content">
        <span className="current-title">{t`features_assets_common_trade_assets_list_index_510249`}</span>
        {sellCoin.coinId && onLoadCoinItem(sellCoin)}
        {buyCoin.coinId && onLoadCoinItem(buyCoin)}
      </div>

      <div className="current-content !border-0 pt-6">
        <span className="current-title">{t`features_assets_common_trade_assets_list_index_510250`}</span>

        <CommonList
          finished={finished}
          className="current-content-list"
          onLoadMore={onLoadList}
          listChildren={otherList.map((coin: CoinListResp) => {
            return onLoadCoinItem(coin)
          })}
          showEmpty={otherList.length === 0}
          emptyClassName="pt-16"
        />
      </div>

      <Popup
        className={styles['asset-goto-trade']}
        visible={tradeHandleVisible}
        overlay
        destroyOnClose
        onOpened={setOpenPopup}
        closeOnPopstate
        safeAreaInsetBottom
        position="bottom"
      >
        <div className="asset-popup-container">
          <div className="asset-popup-title">
            <div className="text-base text-text_color_01 font-medium">{openTradeCoin?.symbol}</div>
            <div>
              <Icon name="close" hasTheme onClick={() => setCloseTradeHandle()} />
            </div>
          </div>
          <div className="mt-4 text-base text-text_color_01 px-4">{t`assets.coin.trade.go_to_trade`}</div>

          <div className="flex justify-between flex-wrap px-4">
            {tardeList?.map((info: any) => {
              return (
                <div
                  className="trade-item"
                  key={`${info.type}${info.id}`}
                  onClick={() => {
                    link(
                      info.type === TradeListTypeEnum.spot
                        ? getTradePagePath(info)
                        : getFutureTradePagePath({
                            symbolName: currentFutureCoin.symbolName || defaultCoin.symbolName || 'BTCUSD',
                          })
                    )
                    setTradeHandleVisible(false)
                  }}
                >
                  <div className="name text-sm">
                    <span>{info.baseSymbolName || '--'}</span>
                    <span className="text-text_color_02">
                      {info.type === TradeListTypeEnum.spot && '/'}
                      {info.quoteSymbolName || '--'}
                    </span>
                    <span className="ml-1">{getTradeCoinTypeEnumName(info.typeInd as any)}</span>
                  </div>
                  <div className="price-container">
                    <span className="price w-3/5 overflow-hidden overflow-ellipsis inline-block text-xs">
                      {Number(formatNumberDecimal(info.last, info.priceOffset || 2))}
                    </span>
                    <IncreaseTag value={`${info.chg || '--'}`} needPercentCalc right={'%'} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 border-line_color_02 border-t mb-10">
            <TradeAssetsHandeItem isNotLetGoC2C={isNotLetGoC2C} toRechargeHandle={toRechargeHandle} />
          </div>
        </div>
      </Popup>
    </div>
  )
}

export { TradeAssetsList }
