import NavBar from '@/components/navbar'
import cn from 'classnames'
import { useState } from 'react'
import { useMount, useUpdateEffect } from 'ahooks'
import Icon from '@/components/icon'
import { Input, Picker, Dialog, Toast } from '@nbit/vant'
import { replaceEmpty } from '@/helper/filters'
import { formatDate } from '@/helper/date'
import { FutureDirectionDetail } from '@/helper/order/future'
import {
  getPerpetualTradePairList,
  getPerpetualStrategyDetails,
  getPerpetualPlanStrategyDetails,
  setStrategyUpdate,
  setPlanStrategyUpdate,
} from '@/apis/future/common'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { usePageContext } from '@/hooks/use-page-context'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { EntrustTypeEnum, TradeUnitTextEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import { getQuoteDisplayDigit, useContractComputedPrice } from '@/hooks/features/contract-computed-price'
import { useOrderFutureStore } from '@/store/order/future'
import { getKycDefaultSeoMeta } from '@/helper/kyc'
import { useFutureQuoteDisplayDigit } from '@/hooks/features/assets'
import styles from './index.module.css'

export function Page() {
  const pageContext = usePageContext()

  const futureoffset = useFutureQuoteDisplayDigit()

  const { typeInd } = useTradeCurrentFutureCoin()

  const { tradePairDefaultQuote } = useOrderFutureStore()

  const { futureDirection } = FutureDirectionDetail()

  const [profitTriggerType, setProfitTriggerType] = useState<string>()

  const [lossTriggerType, setLossTriggerType] = useState<string>()

  const [lossTriggerInput, setLossTriggerInput] = useState<string>()

  const [profitTriggerInput, setProfitTriggerInput] = useState<string>()

  const [commissionPrice, setCommissionPrice] = useState<number>(0)

  const [priceOffset, setPriceOffset] = useState<number>(0)

  const [stopProfitloss, setStopProfitloss] = useState<any>({})

  const {
    id: futureId,
    futureEntrustType,
    orderTab,
    showProfitOrLossStatus,
    divOrMulPrice,
  } = pageContext?.urlParsed?.search || {}

  const { stopLoss, stopProfit } = stopProfitloss?.strategy || {}

  const columns = [
    { text: t`future.funding-history.index-price.column.mark-price`, value: 'mark' },
    { text: t`constants_trade_752`, value: 'new' },
  ]

  const entrustTypeIndList = {
    limit: t`features_orders_future_holding_close_680`,
    market: t`features/trade/future/price-input-3`,
  }

  const profitlossStatusDisplay = {
    not_triggered: { text: t`modules_future_stop_profitloss_index_page_5101508`, className: 'text-brand_color' },
    already_triggered: { text: t`modules_future_stop_profitloss_index_page_5101509`, className: 'text-buy_up_color' },
    expired: { text: t`modules_future_stop_profitloss_index_page_5101510`, className: 'text-text_color_04' },
  }

  const orderDisplay = {
    dealt: t`constants_order_740`,
    to_deal: t`modules_future_stop_profitloss_index_page_5101511`,
    canceled: t`constants/assets/common-33`,
  }

  const setProfitTriggerTypePicker = e => {
    setProfitTriggerType(e)
  }

  const setLostTriggerTypePicker = e => {
    setLossTriggerType(e)
  }

  const setPickerActions = actions => {
    actions.open()
  }

  const getPerpetualDetails = async () => {
    const requestDetail = {
      strategy: getPerpetualStrategyDetails,
      planstrategy: getPerpetualPlanStrategyDetails,
    }

    const { isOk, data } = await requestDetail[orderTab]({ id: futureId })

    if (isOk) {
      setStopProfitloss(data)
      const { stopProfit, stopLoss } = data?.strategy || {}
      setProfitTriggerType(stopProfit?.triggerPriceTypeInd)
      setLossTriggerType(stopLoss?.triggerPriceTypeInd)
      setProfitTriggerInput(stopProfit?.triggerPrice)
      setLossTriggerInput(stopLoss?.triggerPrice)
      setCommissionPrice(data?.price || data?.triggerPrice)
    }
  }

  useMount(() => {
    getPerpetualDetails()
  })

  const setpriceOffsetChange = e => {
    return e.split('.')[1] === '' ? e : String(Number(formatNumberDecimal(e, priceOffset)))
  }

  const setProfitTriggerInputChange = e => {
    const triggerInputNum = setpriceOffsetChange(e)
    setProfitTriggerInput(e ? triggerInputNum : '')
  }

  const setLossTriggerInputChange = e => {
    const triggerInputNum = setpriceOffsetChange(e)
    setLossTriggerInput(e ? triggerInputNum : '')
  }

  const setPriceIsorNotChangeModal = async (priceIsorNotChange, stopLossPrice, stopProfitPrice) => {
    if (priceIsorNotChange) {
      if (stopProfitloss.sideInd === 'open_long') {
        if (
          (stopProfitPrice > commissionPrice || !stopProfitPrice) &&
          (stopLossPrice < commissionPrice || !stopLossPrice)
        ) {
          return true
        }
      }

      if (stopProfitloss.sideInd === 'open_short') {
        if (
          (stopProfitPrice < commissionPrice || !stopProfitPrice) &&
          (stopLossPrice > commissionPrice || !stopLossPrice)
        ) {
          return true
        }
      }
      await Dialog.alert({
        title: '',
        closeable: false,
        message: (
          <div>
            <Icon className="text-6xl mt-1" name="tips_icon" />
            <div className="text-center text-text_color_01 mt-5">{t`features_trade_future_exchange_order_616`}</div>
          </div>
        ),
      })

      return false
    }
  }

  const setProfitStatusDisplay = () => {
    return stopProfit?.statusDisplay === 'not_triggered' && showProfitOrLossStatus !== 'false'
  }

  const setLossStatusDisplay = () => {
    return stopLoss?.statusDisplay === 'not_triggered' && showProfitOrLossStatus !== 'false'
  }

  const setSubmitProfitloss = async () => {
    if (!setProfitStatusDisplay() && !setLossStatusDisplay()) {
      history.back()
      return
    }

    const stopProfitPrice = stopProfit?.triggerPrice

    const stopLossPrice = stopLoss?.triggerPrice

    const priceIsorNotChange = lossTriggerInput !== stopProfitPrice || stopLossPrice !== profitTriggerInput

    const judge = await setPriceIsorNotChangeModal(priceIsorNotChange, lossTriggerInput, profitTriggerInput)

    const request = {
      [EntrustTypeEnum.normal]: setStrategyUpdate,
      [EntrustTypeEnum.plan]: setPlanStrategyUpdate,
    }

    if (priceIsorNotChange && judge) {
      const { isOk } = await request[futureEntrustType]({
        id: futureId,
        strategy: {
          stopProfit: stopProfit
            ? {
                triggerPrice: profitTriggerInput,
                triggerPriceTypeInd: profitTriggerType,
              }
            : null,
          stopLoss: lossTriggerInput
            ? {
                triggerPrice: lossTriggerInput,
                triggerPriceTypeInd: lossTriggerType,
              }
            : null,
        },
      })
      if (isOk) {
        Toast.info(t`modules_future_stop_profitloss_index_page_5101512`)
        history.back()
      }
    }
  }

  const getPerpetualTradePairRequest = async params => {
    const { isOk, data } = await getPerpetualTradePairList(params)
    if (isOk && data?.list) {
      const offset = data?.list?.find(item => item?.baseSymbolName === stopProfitloss.baseCoinShortName)
      setPriceOffset(offset?.priceOffset as number)
    }
  }

  useUpdateEffect(() => {
    getPerpetualTradePairRequest({ buyCoin: tradePairDefaultQuote, typeInd })
  }, [typeInd, tradePairDefaultQuote, stopProfitloss.baseCoinShortName])

  const { getJudgeDivOrMulPriceChange, placeUnitType } = useContractComputedPrice()

  const coinName =
    placeUnitType === TradeUnitTextEnum.BASE ? stopProfitloss?.baseCoinShortName : stopProfitloss?.quoteCoinShortName

  const getDivOrMulPrice = getJudgeDivOrMulPriceChange && getJudgeDivOrMulPriceChange(stopProfitloss?.placeUnit)

  const stopProfitlossPrice =
    getDivOrMulPrice === true
      ? formatCurrency(getQuoteDisplayDigit(stopProfitloss.size, stopProfitloss?.quoteCoinShortName, placeUnitType))
      : getDivOrMulPrice(stopProfitloss.size, divOrMulPrice, stopProfitloss?.baseCoinShortName)

  return (
    <div className={styles.scoped}>
      <NavBar title={t`features/trade/future/exchange-0`} />
      <div className="stop-profitloss-container">
        <div className="stop-profitloss-title">
          <div>
            <span>
              {stopProfitloss.baseCoinShortName}
              {stopProfitloss.quoteCoinShortName} {t`assets.enum.tradeCoinType.perpetual`}
            </span>
            <span>{stopProfitloss.groupName || 'New'}</span>
          </div>
          <div>{formatDate(Number(stopProfitloss.createdByTime!))}</div>
        </div>
        <div className="stop-profitloss-explain">
          <div className="stop-profitloss-detail">
            <span
              className={cn({
                'text-buy_up_color': stopProfitloss?.sideInd === 'open_long',
                'text-sell_down_color': stopProfitloss?.sideInd === 'open_long',
              })}
            >
              {entrustTypeIndList[stopProfitloss.entrustTypeInd]}
            </span>
            <span>{replaceEmpty(orderDisplay[stopProfitloss?.orderDisplayStatus])}</span>
          </div>
          <div className="stop-profitloss-detail">
            <span>{t`features_orders_spot_spot_filters_modal_510258`}</span>
            <span
              className={cn({
                'text-buy_up_color': stopProfitloss?.sideInd === 'open_long',
                'text-sell_down_color': stopProfitloss?.sideInd !== 'open_long',
              })}
            >
              {futureDirection[stopProfitloss.sideInd]}
            </span>
          </div>
          <div className="stop-profitloss-detail">
            <span>{t`features/trade/spot/price-input-0`}</span>
            <span>
              {replaceEmpty(stopProfitlossPrice)} {coinName}
            </span>
          </div>
          <div className="stop-profitloss-detail">
            <span>{t`future.funding-history.index.table-type.price`}</span>
            <span>
              {stopProfitloss.price
                ? `${replaceEmpty(formatCurrency(stopProfitloss.price))} ${stopProfitloss.quoteCoinShortName}`
                : t`features/trade/future/price-input-3`}
            </span>
          </div>
        </div>
        {stopProfitloss?.strategy?.stopProfit && (
          <div className="stop-profitloss-content">
            <div className="stop-profitloss-item">
              <span>{t`constants/assets/common-25`}</span>
              <span className={cn({ ...profitlossStatusDisplay[stopProfit?.statusDisplay]?.className })}>
                {profitlossStatusDisplay[stopProfit?.statusDisplay]?.text}
              </span>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features_orders_spot_spot_filters_modal_510258`}</span>
              <span
                className={cn({
                  'text-buy_up_color': stopProfit?.triggerSideInd === 'open_long',
                  'text-sell_down_color': stopProfit?.triggerSideInd !== 'open_long',
                })}
              >
                {futureDirection[stopProfit?.triggerSideInd]}
              </span>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features/trade/spot/price-input-0`}</span>
              <span>
                {replaceEmpty(stopProfitlossPrice)} {coinName}
              </span>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features/trade/future/price-input-2`}</span>
              <div className="stop-profitloss-item-input">
                <Input
                  className={cn({
                    'stop-profitloss-item-trigger': setProfitStatusDisplay(),
                    'stop-profitloss-item-trigger-disable': !setProfitStatusDisplay(),
                  })}
                  disabled={!setProfitStatusDisplay()}
                  value={profitTriggerInput}
                  onChange={setProfitTriggerInputChange}
                />
                <span className="stop-profitloss-item-trigger-type">{stopProfitloss?.quoteCoinShortName}</span>
              </div>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features_orders_future_holding_close_692`}</span>
              <Picker
                popup={{
                  round: true,
                }}
                placeholder=""
                value={profitTriggerType as string}
                columns={columns}
                onConfirm={setProfitTriggerTypePicker}
              >
                {(_val, _, actions) => {
                  const showTrigerType = columns.find(item => item.value === profitTriggerType)
                  return (
                    <div className="stop-profitloss-item-container">
                      <div
                        className={cn({
                          'stop-profitloss-item-picker': setProfitStatusDisplay(),
                          'stop-profitloss-item-picker-disable': !setProfitStatusDisplay(),
                        })}
                        onClick={() => setProfitStatusDisplay() && setPickerActions(actions)}
                      >
                        {showTrigerType?.text}
                        <Icon className="stop-profitloss-icon" name="regsiter_icon_drop_white" />
                      </div>
                    </div>
                  )
                }}
              </Picker>
            </div>
          </div>
        )}

        {stopProfitloss?.strategy?.stopLoss && (
          <div className="stop-profitloss-content">
            <div className="stop-profitloss-item">
              <span>{t`constants/assets/common-27`}</span>
              <span className={cn({ ...profitlossStatusDisplay[stopLoss?.statusDisplay]?.className })}>
                {profitlossStatusDisplay[stopLoss?.statusDisplay]?.text}
              </span>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features_orders_spot_spot_filters_modal_510258`}</span>
              <span
                className={cn({
                  'text-buy_up_color': stopLoss?.triggerSideInd === 'open_long',
                  'text-sell_down_color': stopLoss?.triggerSideInd !== 'open_long',
                })}
              >
                {futureDirection[stopLoss?.triggerSideInd]}
              </span>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features/trade/spot/price-input-0`}</span>
              <span>
                {replaceEmpty(stopProfitlossPrice)} {coinName}
              </span>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features/trade/future/price-input-2`}</span>
              <div className="stop-profitloss-item-input">
                <Input
                  className={cn({
                    'stop-profitloss-item-trigger': setLossStatusDisplay(),
                    'stop-profitloss-item-trigger-disable': !setLossStatusDisplay(),
                  })}
                  onChange={setLossTriggerInputChange}
                  value={lossTriggerInput}
                  disabled={!setLossStatusDisplay()}
                />
                <span className="stop-profitloss-item-trigger-type">{stopProfitloss?.quoteCoinShortName}</span>
              </div>
            </div>
            <div className="stop-profitloss-item">
              <span>{t`features_orders_future_holding_close_692`}</span>
              <Picker
                popup={{
                  round: true,
                }}
                placeholder=""
                value={lossTriggerType as string}
                columns={columns}
                onConfirm={setLostTriggerTypePicker}
              >
                {(_val, _, actions) => {
                  const showTrigerType = columns.find(item => item.value === lossTriggerType)
                  return (
                    <div className="stop-profitloss-item-container">
                      <div
                        className={cn({
                          'stop-profitloss-item-picker': setLossStatusDisplay(),
                          'stop-profitloss-item-picker-disable': !setLossStatusDisplay(),
                        })}
                        onClick={() => setLossStatusDisplay() && setPickerActions(actions)}
                      >
                        {showTrigerType?.text}
                        <Icon className="stop-profitloss-icon" name="regsiter_icon_drop_white" />
                      </div>
                    </div>
                  )
                }}
              </Picker>
            </div>
          </div>
        )}

        <div className="stop-profitloss-agreement">
          <span></span>
          <span>{t`modules_future_stop_profitloss_index_page_5101513`}</span>
        </div>
      </div>
      <div className="stop-profitloss-button-container">
        <div className="stop-profitloss-button" onClick={setSubmitProfitloss}>
          {t`user.field.reuse_17`}
        </div>
      </div>
    </div>
  )
}

export async function onBeforeRender(pageContext) {
  return {
    pageContext: {
      documentProps: await getKycDefaultSeoMeta(t`features/trade/future/exchange-0`),
    },
  }
}
