import Icon from '@/components/icon'
import NavBar from '@/components/navbar'
import { useFutureEnum } from '@/constants/future/future-const'
import { formatDate } from '@/helper/date'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import { TradeUnitTextEnum, EntrustTypeEnum } from '@/constants/trade'
import { useContractComputedPrice, getQuoteDisplayDigit } from '@/hooks/features/contract-computed-price'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getOrderValueEnumText, FutureDirectionDetail } from '@/helper/order/future'
import { t } from '@lingui/macro'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { getClearingTradeHistory, getPerpetualDetailList, getPerpetualTradePairList } from '@/apis/future/common'
import { Toast, Tabs, Loading } from '@nbit/vant'
import { IncreaseTag } from '@nbit/react'
import classNames from 'classnames'
import { useAssetsStore } from '@/store/assets/spot'
import { ReactNode, useState } from 'react'
import { useMount, useUpdateEffect } from 'ahooks'
import CommonList from '@/components/common-list/list'
import { useCopyToClipboard } from 'react-use'
import { useLoadMore } from '@/hooks/use-load-more'
import { YapiGetV1PerpetualClearingTradeHistoryListData } from '@/typings/yapi/PerpetualClearingTradeHistoryV1GetApi.d'
import { YapiGetV1PerpetualOrderDetailListData } from '@/typings/yapi/PerpetualOrderDetailListV1GetApi.d'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi.d'
import { decimalUtils } from '@nbit/utils'
import { useContractElements } from '../contract-elements/useContractElements'
import { PerpetualOrderDetail, IsAccept } from '../contract'
import styles from './index.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

function OrderStatus({ order, statusConfigs: configs, futureEntrustType }: any) {
  const [, copyToClipboard] = useCopyToClipboard()
  const enumsText = getOrderValueEnumText(order, undefined, configs, futureEntrustType)
  const statusText =
    parseFloat(order.completeness) > 0
      ? `${enumsText.showTypeText[order?.typeInd]}(${parseFloat(order.completeness)}%)`
      : enumsText.showTypeText[order?.typeInd]
  const statusConfigs = {
    deal_done: {
      icon: 'login_password_satisfy',
      textColor: 'text-success_color',
      text: t`features_orders_spot_open_order_item_510252`,
      hasTheme: false,
    },
    partially: {
      icon: 'prompt_close',
      textColor: 'text-brand_color',
      text: t`constants_future_future_const_jchz8c55dlr0fwtn2-lrv`,
      hasTheme: false,
    },
    unsold: {
      text: t`constants_order_736`,
      hasTheme: true,
      icon: 'login_password-dissatisfy',
      textColor: 'text-text_color_03',
    },
    partial_deal_canceled: {
      icon: 'prompt_close',
      textColor: 'text-brand_color',
      text: t`constants/assets/common-32`,
      hasTheme: false,
    },
    revoke_sys: {
      hasTheme: true,
      textColor: 'text-text_color_03',
      icon: 'login_password-dissatisfy',
      text: t`features_orders_spot_open_order_item_510253`,
    },
    revoke: {
      textColor: 'text-text_color_03',
      hasTheme: true,
      icon: 'login_password-dissatisfy',
      text: t`constants/assets/common-33`,
    },
  }

  const { getTypeIndName } = useContractElements()

  const { typeInd } = useTradeCurrentFutureCoin()

  const statusConfig = statusConfigs[order.statusCd!]

  const copy = () => {
    copyToClipboard(order.id!.toString())
    Toast(t`features_orders_order_detail_5101067`)
  }

  return (
    <div className={styles['order-status-wrapper']}>
      <div className="px-4 w-full mb-6">
        <div className="order-no">
          <div>
            <span>{t`features_orders_order_detail_5101068`}</span>
            <span>{order.id}</span>
          </div>
          <div onClick={copy}>
            <Icon className="copy-icon" name="copy" hasTheme />
          </div>
        </div>
      </div>
      <div className="text-xs text-text_color_03 mb-2">{t`assets.layout.tabs.contract`}</div>
      <div className="mb-1 font-medium text-xl">
        <span>{replaceEmpty(order.baseCoinShortName)}</span>
        <span>{replaceEmpty(order.quoteCoinShortName)}</span>
        <span> {typeInd && getTypeIndName[typeInd]}</span>
        <span className="ml-1.5 text-xl font-medium">
          {order?.lever}
          <span className="text-xl">x</span>
        </span>
      </div>
      {statusConfig && (
        <div className={classNames('flex items-center text-sm', statusConfig.textColor)}>
          <span className="mr-1">
            <Icon name={statusConfig.icon} hasTheme={statusConfig.hasTheme} />
          </span>
          <span>{statusConfig.text}</span>
          <span>({order?.completeness})</span>
          {/* (<span>{statusText}</span>) */}
        </div>
      )}
    </div>
  )
}

type IPropListProps = {
  list: {
    label: string | ReactNode
    id?: string
    value: string | ReactNode
  }[]
  className?: string
}

function PropList({ list, className = 'px-5 bg-bg_color' }: IPropListProps) {
  return (
    <div className={className}>
      {list?.map(item => {
        return (
          <div
            key={typeof item.label === 'string' ? item.label : item?.id}
            className={styles['prop-list-item-wrapper']}
          >
            <div className="text-text_color_03">{item?.label}</div>
            <div>{item?.value || replaceEmpty(item?.value as any)}</div>
          </div>
        )
      })}
    </div>
  )
}

// 成交明细
function TransactionLog({
  feeCoinName,
  log,
  sellCoinName,
  showUtilsValue,
  iSIncludeMandatory,
  coinName,
  getDivOrMulPrice,
  offset,
}: {
  log: YapiGetV1PerpetualClearingTradeHistoryListData
  sellCoinName: string
  feeCoinName: string
  showUtilsValue?: number
  iSIncludeMandatory: boolean
  coinName: string
  getDivOrMulPrice: any
  offset: number
}) {
  const props = [
    {
      label: t`future.funding-history.index-price.column.time`,
      value: log?.createdByTimeLong && formatDate(log?.createdByTimeLong),
    },
    {
      label: t`features/trade/spot/price-input-0`,
      value: `${replaceEmpty(
        getDivOrMulPrice === true ? showUtilsValue : getDivOrMulPrice(showUtilsValue, log.filledPrice!, coinName)
      )} ${replaceEmpty(feeCoinName)}`,
    },
    {
      label: t`future.funding-history.index.table-type.price`,
      value: replaceEmpty(log.filledPrice!),
    },
    {
      label: t`features_assets_financial_record_financial_record_592`,
      value: `${replaceEmpty(formatNumberDecimal(log.fees, offset))} ${replaceEmpty(sellCoinName)}`,
    },
  ]

  const list = iSIncludeMandatory
    ? props
    : [
        ...props,
        {
          label: t`features_trade_contract_contract_order_detail_index_h6e_kohr3glpf-d-gg3rm`,
          value: log?.takerMaker,
        },
      ]

  return (
    <div className="rv-hairline--bottom">
      <PropList list={list} />
    </div>
  )
}

type CoinRate = {
  coinId: string
  coinPrecision: number
  symbol: string
  usdtRate: string
}
// 资金明细
function FundLog({
  log,
  coinRate,
  tradePairList,
  offset,
}: {
  log: YapiGetV1PerpetualOrderDetailListData
  offset: number
  sellCoinName: string
  feeCoinName: string
  showUtilsValue?: number
  coinRate?: CoinRate[]
  tradePairList?: YapiGetV1PerpetualTradePairListData[]
}) {
  const { coinPrecision } = coinRate?.find(item => item?.symbol === log?.coinName?.toUpperCase()) || {}
  const { priceOffset } = tradePairList?.find(item => item?.baseSymbolName === log?.coinName?.toUpperCase()) || {}

  const props = [
    {
      label: t`future.funding-history.index-price.column.time`,
      value: formatDate(log.time!),
    },
    {
      label: t`features/trade/spot/price-input-0`,
      value: (
        <div>
          <IncreaseTag digits={coinPrecision} hasColor={false} value={log.amount!} />
          <span className="pl-1">{log?.coinName?.toUpperCase()}</span>
        </div>
      ),
    },
    {
      label: t`features_assets_financial_record_record_detail_transaction_details_index_5101476`,
      value: (
        <div>
          <span>1 {log?.coinName?.toUpperCase()}=</span>
          <span>
            <IncreaseTag hasPrefix={false} kSign digits={offset} delZero={false} hasColor={false} value={log.rate!} />
            <span className="pl-1">{log?.currencyName}</span>
          </span>
        </div>
      ),
    },
    {
      label: t`features/assets/financial-record/record-list/record-list-screen/index-1`,
      value: PerpetualOrderDetail[log.type!],
    },
  ]

  return (
    <div className="rv-hairline--bottom">
      <PropList list={props} />
    </div>
  )
}

function OrderDetailPageLayout({ order, futureEntrustType }: any) {
  const isBuy = order?.sideInd === 'open_long'

  const isMarketPrice = order?.entrustTypeInd === 'market'

  const tradeHistoryParams = {
    open_long: 'open',
    open_short: 'open',
    close_long: 'close',
    close_short: 'close',
  }

  const detailedRequest = {
    transactionDetails: {
      request: getClearingTradeHistory,
      params: { orderId: order?.id },
      getResponse: 'list',
    },
    fundDetails: { request: getPerpetualDetailList, params: { orderId: order?.id }, getResponse: 'list' },
    depositDetails: { request: getPerpetualDetailList, params: { orderId: order?.id }, getResponse: 'margin' },
  }

  const { statusConfigs } = useFutureEnum()

  const {
    futuresCurrencySettings: { offset = 2 },
  } = useAssetsFuturesStore()

  const enumsText = getOrderValueEnumText(order, undefined, statusConfigs, futureEntrustType)

  const [futureTab, setFutureTab] = useState<string>('transactionDetails')

  const [tradePairList, setTradePairList] = useState<YapiGetV1PerpetualTradePairListData[]>([])

  const { placeUnitType, getJudgeDivOrMulPriceChange } = useContractComputedPrice()

  const getDivOrMulPrice =
    getJudgeDivOrMulPriceChange &&
    getJudgeDivOrMulPriceChange(EntrustTypeEnum.stop === futureEntrustType ? TradeUnitTextEnum.BASE : order?.placeUnit)

  const coinName = placeUnitType === TradeUnitTextEnum.BASE ? order?.baseCoinShortName : order?.quoteCoinShortName

  const iSIncludeMandatory = ['forced_liquidation_order', 'forced_lighten_order'].includes(order?.typeInd)

  const { futureDirection } = FutureDirectionDetail()

  const { coinRate } = useAssetsStore().assetsModule

  const getPerpetualTradePairListChange = async () => {
    const { isOk, data } = await getPerpetualTradePairList({})
    if (isOk && data?.list) {
      setTradePairList(data?.list)
    }
  }

  const getTradeHistoryList = async params => {
    const { isOk: tradeHistorysOk, data: tradeHistoryData } = await detailedRequest[futureTab].request({
      ...params,
      ...detailedRequest[futureTab].params,
    })
    if (tradeHistorysOk) {
      return tradeHistoryData[detailedRequest[futureTab].getResponse]
    }
  }

  useMount(() => {
    getPerpetualTradePairListChange()
  })

  const contractDetailType = [
    {
      label: t`features/assets/financial-record/record-detail/record-details-info/index-9`,
      value: !order.id ? (
        replaceEmpty()
      ) : (
        <span
          className={classNames({
            'text-sell_down_color': !isBuy,
            'text-buy_up_color': isBuy,
          })}
        >
          {enumsText.showTypeText[order?.typeInd]} / {futureDirection[order?.sideInd]}
        </span>
      ),
    },
    {
      label: `${t`features/assets/financial-record/record-detail/record-details-info/index-11`}${
        iSIncludeMandatory ? '' : `/${t`features/assets/financial-record/record-detail/record-details-info/index-10`}`
      }(${replaceEmpty(coinName)})`,
      value: (
        <span>
          <span>
            {replaceEmpty(
              getDivOrMulPrice === true
                ? getQuoteDisplayDigit(order?.tradeSize, order?.quoteCoinShortName, placeUnitType)
                : getDivOrMulPrice(order?.tradeSize, order?.tradePrice, order?.baseCoinShortName)
            )}
          </span>
          {!iSIncludeMandatory && (
            <span className="text-text_color_02">
              /
              {replaceEmpty(
                getDivOrMulPrice === true
                  ? getQuoteDisplayDigit(order?.tradeSize, order?.quoteCoinShortName, placeUnitType)
                  : getDivOrMulPrice(
                      order?.size,
                      isMarketPrice ? order?.tradePrice : order?.price,
                      order?.baseCoinShortName
                    )
              )}
            </span>
          )}
        </span>
      ),
    },
    {
      label: `${t`features_assets_financial_record_record_detail_record_details_info_index_5101335`}${
        iSIncludeMandatory ? '' : `/${t`features/trade/future/price-input-1`}`
      }`,
      value: (
        <span>
          <span>{replaceEmpty(order.tradePrice)}</span>
          {!iSIncludeMandatory && (
            <span className="text-text_color_02">
              /{isMarketPrice ? t`features/trade/future/price-input-3` : formatCurrency(order.price || '')}
            </span>
          )}
        </span>
      ),
    },
  ]
  const contractDetailBons = [
    {
      label: t`features_assets_financial_record_financial_record_592`,
      value: `${replaceEmpty(formatNumberDecimal(order.fees, offset))} ${replaceEmpty(order.quoteCoinShortName)}`,
    },
  ]

  const feeDeduction = [] as Record<'label' | 'value', string>[]

  if (Number(order?.feeDeductionAmount)) {
    feeDeduction.push({
      label: t`features_orders_order_detail_azc1vnv0l0`,
      value: `${replaceEmpty(
        getQuoteDisplayDigit(order.feeDeductionAmount, order?.quoteCoinShortName, placeUnitType)
      )} ${replaceEmpty(order.quoteCoinShortName)}`,
    })
  }

  if (Number(order?.voucherRealAmount)) {
    feeDeduction.push({
      label: t`features_trade_contract_contract_order_detail_index_r2buwwyqji`,
      value: `${replaceEmpty(
        getQuoteDisplayDigit(order.voucherRealAmount, order?.quoteCoinShortName, placeUnitType)
      )} ${replaceEmpty(order.quoteCoinShortName)}`,
    })
  }

  if (Number(order?.voucherDeductionAmount)) {
    feeDeduction.push({
      label: t`features_trade_contract_contract_order_detail_index_klhety0dve`,
      value: `${replaceEmpty(
        getQuoteDisplayDigit(order.voucherDeductionAmount, order?.quoteCoinShortName, placeUnitType)
      )} ${replaceEmpty(order.quoteCoinShortName)}`,
    })
  }

  if (Number(order?.insuranceDeductionAmount)) {
    feeDeduction.push({
      label: t`features_trade_contract_contract_order_detail_index_myk0ahijb8`,
      value: `${replaceEmpty(
        getQuoteDisplayDigit(order.insuranceDeductionAmount, order?.quoteCoinShortName, placeUnitType)
      )} ${replaceEmpty(order.quoteCoinShortName)}`,
    })
  }

  if (Number(order?.voucherDeductionAmount) || Number(order?.insuranceDeductionAmount)) {
    feeDeduction.push({
      label: t`features_trade_contract_contract_order_detail_index_mwhe0z4wnx`,
      value: `${SafeCalcUtil.add(Number(order?.realizedProfit), Number(order?.voucherDeductionAmount)).add(
        Number(order?.insuranceDeductionAmount)
      )} ${replaceEmpty(order.quoteCoinShortName)}`,
    })
  }

  const contractDetailContinues = [
    ...contractDetailBons,
    ...feeDeduction,
    {
      label: t`assets.financial-record.creationTime`,
      value: formatDate(order.createdByTime!),
    },
    {
      label: t`features_orders_order_detail_510271`,
      value: formatDate(order.updatedByTime!),
    },
  ]

  const contractDetailAver = [
    ...contractDetailBons,
    {
      label: t`features_assets_futures_futures_details_position_details_list_5101358`,
      value: `${replaceEmpty(order.realizedProfit)}  ${replaceEmpty(order.quoteCoinShortName)}`,
    },
    ...feeDeduction,
    {
      label: t`assets.financial-record.creationTime`,
      value: formatDate(order.createdByTime!),
    },
    {
      label: t`features_orders_order_detail_510271`,
      value: formatDate(order.updatedByTime!),
    },
  ]

  const contractForcedDecrement = [
    ...contractDetailBons,
    {
      label: t`features_assets_futures_futures_details_position_details_list_5101358`,
      value: `${replaceEmpty(order.realizedProfit)}  ${replaceEmpty(order.quoteCoinShortName)}`,
    },
    ...feeDeduction,
    {
      label: t`features_trade_contract_contract_order_detail_index_nqauaterecbpcbvbhrxnh`,
      value: formatDate(order.createdByTime!),
    },
    {
      label: t`features_trade_contract_contract_order_detail_index_tcuhmwivo8a4bfvawra0k`,
      value: formatDate(order.updatedByTime!),
    },
  ]

  const contractForcedAverage = [
    ...contractDetailBons,
    {
      label: t`features_assets_futures_futures_details_position_details_list_5101358`,
      value: `${replaceEmpty(order.realizedProfit)}  ${replaceEmpty(order.quoteCoinShortName)}`,
    },
    ...feeDeduction,
    {
      label: t`features_trade_contract_contract_order_detail_index_iuz8xkmv8jz2vnvvjzqkp`,
      value: `${replaceEmpty(order?.liquidationFees)} ${replaceEmpty(order.quoteCoinShortName)}`,
    },
    // {
    //   label: t`constants/assets/common-10`,
    //   value: `${replaceEmpty(order?.liquidationRemainMargin)} ${replaceEmpty(order.quoteCoinShortName)}`,
    // },
    {
      label: t`features_trade_contract_contract_order_detail_index_gvjsdrfcqfbym4rh6m3rs`,
      value: formatDate(order.updatedByTime!),
    },
    {
      label: t`features_trade_contract_contract_order_detail_index_p-enc5iqd-kjhe1gntvkc`,
      value: formatDate(order.updatedByTime!),
    },
  ]

  const showPropList = {
    market_orderopen_long: contractDetailContinues,
    market_orderopen_short: contractDetailContinues,
    limit_orderopen_long: contractDetailContinues,
    limit_orderopen_short: contractDetailContinues,
    limit_orderclose_long: contractDetailAver,
    limit_orderclose_short: contractDetailAver,
    market_orderclose_long: contractDetailAver,
    market_orderclose_short: contractDetailAver,
    forced_lighten_orderclose_long: contractForcedDecrement,
    forced_lighten_orderclose_short: contractForcedDecrement,
    forced_liquidation_orderclose_long: contractForcedAverage,
    forced_liquidation_orderclose_short: contractForcedAverage,
  }

  const setFutureTabChange = e => {
    setFutureTab(e)
  }

  const [showLoading, setShowLoading] = useState<boolean>(false)

  const {
    list,
    loadMore,
    finished,
    refresh: refreshList,
  } = useLoadMore({
    async fetchData(page) {
      if (!order?.id) return
      setShowLoading(true)
      const res = await getTradeHistoryList({ pageNum: String(page) })
      setShowLoading(false)
      return res
    },
  })

  const refresh = async () => {
    return refreshList()
  }

  useUpdateEffect(() => {
    refresh()
  }, [futureTab, order?.id])

  const transactionComponents = () => {
    return (
      <>
        {showLoading ? (
          <div className="flex justify-center ">
            <Loading />
          </div>
        ) : (
          <CommonList
            refreshing
            emptyClassName="pt-8 pb-20"
            onLoadMore={loadMore}
            finished={finished}
            showEmpty={list?.length === 0}
            listChildren={undefined}
            emptyText={
              <span className="text-xs">{t`features_trade_contract_contract_order_detail_index_dseufgo9kp6zfkapuca5a`}</span>
            }
          >
            {(list as YapiGetV1PerpetualClearingTradeHistoryListData[])?.map((log, index) => {
              return (
                <TransactionLog
                  key={index}
                  log={log}
                  offset={offset}
                  showUtilsValue={order?.placeUnit === 'BASE' ? log?.filledSize : log?.filledAmount}
                  sellCoinName={order.quoteCoinShortName!}
                  feeCoinName={coinName!}
                  getDivOrMulPrice={getDivOrMulPrice}
                  coinName={coinName}
                  iSIncludeMandatory={iSIncludeMandatory}
                />
              )
            })}
          </CommonList>
        )}
      </>
    )
  }

  const fundComponents = () => {
    return (
      <div>
        {showLoading ? (
          <div className="flex justify-center ">
            <Loading />
          </div>
        ) : (
          <CommonList
            refreshing
            emptyClassName="pt-8 pb-20"
            onLoadMore={loadMore}
            finished={finished}
            showEmpty={list?.length === 0}
            listChildren={undefined}
            emptyText={t`features_trade_contract_contract_order_detail_index_dseufgo9kp6zfkapuca5a`}
          >
            {(list as YapiGetV1PerpetualOrderDetailListData[])?.map((log, index) => {
              return (
                <FundLog
                  key={index}
                  log={log}
                  offset={offset}
                  coinRate={coinRate.coinRate}
                  sellCoinName={order.quoteCoinShortName!}
                  feeCoinName={coinName!}
                  tradePairList={tradePairList}
                />
              )
            })}
          </CommonList>
        )}
      </div>
    )
  }

  const showTabsList = [
    {
      name: 'transactionDetails',
      key: 'transactionDetails',
      title: t`features_orders_order_detail_510272`,
      components: transactionComponents,
    },
    {
      name: 'fundDetails',
      key: 'fundDetails',
      title: t`features_assets_financial_record_record_detail_transaction_details_index_5101272`,
      components: fundComponents,
    },
  ]

  const getShowTabsList = () => {
    return showTabsList.filter(
      item =>
        item.key !== 'fundDetails' ||
        (tradeHistoryParams[order?.sideInd] === 'close' && order?.isAccept !== IsAccept.TakeoverOrder)
    )
  }

  return (
    <div className={styles['order-detail-page-layout-wrapper']}>
      <NavBar title={t`features_orders_order_detail_510265`} />
      <div>
        <OrderStatus order={order} futureEntrustType={futureEntrustType} statusConfigs={statusConfigs} />
        <div className="">
          <PropList list={contractDetailType} />
          <div className="px-5">
            <div className="rv-hairline--bottom"></div>
          </div>
          <PropList list={showPropList[order.typeInd + order.sideInd]} />
          <div className="mt-1 bg-bg_color">
            <Tabs
              align="start"
              className={classNames('px-2', { 'fund-tab': getShowTabsList()?.length <= 1 })}
              active={futureTab}
              onChange={setFutureTabChange}
            >
              {getShowTabsList().map(item => {
                return (
                  <Tabs.TabPane name={item.name} key={item.key} title={item.title}>
                    {item.components()}
                  </Tabs.TabPane>
                )
              })}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPageLayout
