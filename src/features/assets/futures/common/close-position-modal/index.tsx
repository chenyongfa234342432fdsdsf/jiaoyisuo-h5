/**
 * 合约 - 平仓弹窗组件
 */
import { t } from '@lingui/macro'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Button, Popup, Toast } from '@nbit/vant'
import Decimal from 'decimal.js'
import {
  FuturesDetailsPositionTypeEnum,
  FuturesMarketUnitTypeEnum,
  FuturesOrderSideTypeEnum,
  FuturesOrderTypeEnum,
  FuturesPlaceUnitTypeEnum,
  getStopLimitEntrustTypeName,
  StopLimitEntrustTypeEnum,
} from '@/constants/assets/futures'
import {
  getFuturesMarketDepthApi,
  onChangeInput,
  onChangeSlider,
  onGetExpectedProfit,
  onGetGroupPurchasingPower,
  onGetTradePairDetails,
  onSetPositionOffset,
} from '@/helper/assets/futures'
import Slider from '@/components/slider'
import { CommonDigital } from '@/components/common-digital'
import Icon from '@/components/icon'
import { IncreaseTag } from '@nbit/react'
import { ICoupons, OrdersPlaceReq, PositionList } from '@/typings/api/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useGetState, useMemoizedFn, useUnmount, useUpdateEffect } from 'ahooks'
import { SpotStopStatusEnum } from '@/constants/trade'
import { postPerpetualOrdersPlace, postPerpetualPositionCheckExist } from '@/apis/assets/futures/position'
import { decimalUtils } from '@nbit/utils'
import { WsBizEnum, WsTypesEnum } from '@/constants/ws'
import { YapiGetPerpetualMarketRestV1MarketDepthApiResponse } from '@/typings/yapi/PerpetualMarketRestMarketDepthV1GetApi'
import { requestWithLoading } from '@/helper/order'
import { removeDecimalZero } from '@/helper/decimal'
import CouponSelect, { ICouponResult } from '@/features/welfare-center/compontents/coupon-select'
import { calculatorFeeAmount, sendRefreshCouponSelectApiNotify } from '@/helper/welfare-center/coupon-select'
import TradePriceInput from '@/features/trade/common/price-input'
import { Dropdown } from '../dropdown'
import { PositionPrice } from '../position-price'
import styles from './index.module.css'
import { HintModal } from '../hint-modal'
import { PositionModalHeader } from '../position-modal-header'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

type IForm = {
  price: string
  entrustTypeInd: string
  size: string
  percent: number
}

interface ClosePositionModalProps {
  positionData: PositionList
  visible: boolean
  onClose: () => void
  onCommit: () => void
}

function ClosePositionModal(props: ClosePositionModalProps) {
  const {
    positionModule: { strategyInfo, updateStrategyInfo },
    wsDealSubscribe,
    wsDealUnSubscribe,
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    positionDealPrice,
    updatePositionDealPrice,
    positionMarkPrice,
    updatePositionMarkPrice,
    updateSymbolWassName,
    futuresCurrencySettings: { offset = 2, currencySymbol },
    wsDepthSubscribe,
    wsDepthUnSubscribe,
    positionDepthPrice,
    updatePositionDepthPrice,
  } = useAssetsFuturesStore()

  const { visible, onClose, onCommit } = props || {}
  const {
    size,
    baseSymbolName,
    quoteSymbolName,
    symbol,
    openPrice,
    latestPrice,
    markPrice,
    groupId,
    positionId,
    tradeId,
    sideInd,
    amountOffset,
    entrustFrozenSize,
    symbolWassName,
    lever,
    priceOffset,
    voucherAmount,
  } = props.positionData
  const priceRef: MutableRefObject<any> = useRef(null) // 委托价格输入框
  const [hintVisible, setHintVisible] = useState(false) // 是否展示预计盈亏提示弹窗
  const [marginVisible, setMarginVisible] = useState(false) // 是否展示保证金不足提示弹窗
  const [tradePairDetail, setTradePairDetail] = useState<any>({}) // 币对详情
  const [estimatedProfit, setEstimatedProfit] = useState('') // 预计盈亏
  const [form, setForm, getForm] = useGetState<IForm>({
    entrustTypeInd: strategyInfo.closeEntrustType,
    price: '',
    size: '',
    percent: 0,
  })
  // 预估手续费
  const [fee, setFee] = useState('')
  // 预估下单金额
  const [amount, setAmount] = useState('')
  // 已选优惠券列表
  const [couponData, setCouponData] = useState<ICouponResult>({
    coupons: [] as ICoupons[],
    isManual: false,
  })
  // 是否需要自动匹配最优券
  const [isMatch, setIsMatch] = useState(true)

  const availableSize =
    form.entrustTypeInd === StopLimitEntrustTypeEnum.market ? size : `${SafeCalcUtil.sub(size, entrustFrozenSize)}`

  const entrustTypeList = [
    { label: t`features/trade/future/price-input-3`, value: StopLimitEntrustTypeEnum.market },
    { label: t`features_orders_future_holding_close_680`, value: StopLimitEntrustTypeEnum.limit },
  ]

  /**
   * 根据委托价格类型获取订单类型
   */
  const getFuturesOrderType = (type: string) => {
    return {
      [StopLimitEntrustTypeEnum.limit]: FuturesOrderTypeEnum.limitOrder,
      [StopLimitEntrustTypeEnum.market]: FuturesOrderTypeEnum.marketOrder,
    }[type]
  }

  /**
   * 根据仓位方向类型获取订单方向类型
   */
  const getFuturesOrderSideType = (type: string) => {
    return {
      [FuturesDetailsPositionTypeEnum.long]: FuturesOrderSideTypeEnum.closeLong,
      [FuturesDetailsPositionTypeEnum.short]: FuturesOrderSideTypeEnum.closeShort,
    }[type]
  }

  /**
   * 获取币对详情
   */
  const onloadTradeDetails = async () => {
    setTradePairDetail(await onGetTradePairDetails(symbol))
  }

  /**
   * 检测仓位是否存在
   */
  const onCheckPosition = async () => {
    const res = await postPerpetualPositionCheckExist({ groupId, positionId })
    const { isOk, data } = res || {}

    if (!isOk) {
      return false
    }

    return data?.exist
  }

  /**
   * 确定
   */
  const onCommitForm = async () => {
    if (tradePairDetail.marketStatus !== SpotStopStatusEnum.trading) {
      Toast.info(t`features_assets_futures_common_close_position_modal_index_5101449`)
      return
    }

    if (+voucherAmount > 0 && +form?.size < +size) {
      Toast.info(t`features_assets_futures_common_close_position_modal_index_7hz7pajy9t`)
      return
    }

    // 计算仓位预计亏损
    const marketDepth: YapiGetPerpetualMarketRestV1MarketDepthApiResponse['data'] =
      (await getFuturesMarketDepthApi(symbol, 5)) || {}
    const maxBids = marketDepth?.bids?.[marketDepth?.bids.length - 1]?.[0] || '' // 最大买 5 价
    const maxAsks = marketDepth?.asks?.[marketDepth?.asks.length - 1]?.[0] || '' // 最大卖 5 价
    const max = sideInd === FuturesDetailsPositionTypeEnum.long ? maxBids : maxAsks
    const positionEstimatedProfit = onGetExpectedProfit({
      price: form.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? form.price : max,
      closeSize: form.size,
      openPrice,
      takerFeeRate: tradePairDetail.takerFeeRate,
      sideInd,
    })

    // 仓位预计亏损（仅负数且取绝对值）>= 仓位初始保证金 + 合约组可用
    // 仓位初始保证金 = 开仓均价 * 平仓数量 / 杠杆倍数
    const groupAvailableMargin = await onGetGroupPurchasingPower(groupId)
    const closeInitMargin = SafeCalcUtil.div(SafeCalcUtil.mul(openPrice, form.size), lever)
    if (
      +positionEstimatedProfit < 0 &&
      +Decimal.abs(positionEstimatedProfit) >= +SafeCalcUtil.add(closeInitMargin, groupAvailableMargin)
    ) {
      setMarginVisible(true)
      return
    }

    if (Number(form.size) > Number(availableSize)) {
      Toast.info(t`features_assets_futures_common_close_position_modal_index_5101474`)
      return
    }

    if (Number(form.size) > tradePairDetail.maxCount) {
      Toast.info(
        t({
          id: 'features_assets_futures_common_close_position_modal_index_5101453',
          values: { 0: tradePairDetail.maxCount, 1: baseSymbolName },
        })
      )
      return
    }

    if (!(await onCheckPosition())) {
      Toast.info(t`features_assets_futures_common_close_position_modal_index_5101454`)
      onClose()
      return
    }

    const params: OrdersPlaceReq = {
      groupId,
      positionId,
      tradeId,
      typeInd: getFuturesOrderType(form.entrustTypeInd) || '',
      entrustTypeInd: form.entrustTypeInd,
      sideInd: getFuturesOrderSideType(sideInd) || '',
      price: Number(form.price),
      size: form.size,
      placeUnit: FuturesPlaceUnitTypeEnum.base,
      marketUnit: FuturesMarketUnitTypeEnum.quantity,
      coupons: couponData?.coupons,
    }

    if (form.entrustTypeInd === StopLimitEntrustTypeEnum.market) delete params.price
    if (params.coupons?.length === 0) delete params.coupons

    const res = await postPerpetualOrdersPlace(params)
    const { isOk, message = '' } = res || {}
    if (!isOk) {
      Toast.info(message)
      return
    }

    Toast.info(t`features_assets_futures_common_close_position_modal_index_5101384`)
    onCommit()
    sendRefreshCouponSelectApiNotify()
  }

  const subs = {
    biz: WsBizEnum.perpetual,
    type: WsTypesEnum.perpetualDeal,
    base: baseSymbolName,
    quote: quoteSymbolName,
    contractCode: symbolWassName,
  }

  const markSubs = { biz: WsBizEnum.perpetual, type: WsTypesEnum.perpetualIndex, contractCode: symbolWassName }

  /** 打开弹框时默认填入 100% 持仓数量 */
  const setDefaultAmount = () => {
    setForm({
      ...form,
      size: onSetPositionOffset(availableSize, amountOffset),
      percent: +availableSize === 0 ? 100 : onChangeSlider(availableSize, availableSize) || 0,
    })
  }

  /**
   * 最新价格推送回调
   */
  const onDepthWsCallBack = useMemoizedFn(data => {
    if (!data || data.length === 0) return
    const depthData = data[0]
    if (symbolWassName !== depthData?.symbolWassName) return

    const maxBids = depthData?.bids?.[0]?.price || '' // 买 1 价
    const maxAsks = depthData?.asks?.[0]?.price || '' // 卖 1 价
    const newDepthPrice = sideInd === FuturesDetailsPositionTypeEnum.long ? maxAsks : maxBids

    updatePositionDepthPrice(newDepthPrice)
  })

  useEffect(() => {
    updateSymbolWassName(symbolWassName)
    onloadTradeDetails()
    wsDealSubscribe(subs)
    wsMarkPriceSubscribe(markSubs)
    wsDepthSubscribe(symbolWassName, onDepthWsCallBack)
    updatePositionDealPrice(latestPrice)
    updatePositionMarkPrice(markPrice)

    setDefaultAmount()
  }, [])

  useUnmount(() => {
    wsDealUnSubscribe(subs)
    wsMarkPriceUnSubscribe(markSubs)
    wsDepthUnSubscribe(symbolWassName, onDepthWsCallBack)
  })

  useUpdateEffect(() => {
    // 限价：（委托价格 - 开仓均价）*平仓数量 - 委托价格*平仓数量*taker 费率
    // 市价：（最新价格 - 开仓均价）*平仓数量 - 最新价格*平仓数量*taker 费率
    const newEstimatedProfit = onGetExpectedProfit({
      price: form.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? form.price : positionDealPrice,
      closeSize: form.size,
      openPrice,
      takerFeeRate: tradePairDetail.takerFeeRate,
      sideInd,
    })
    setEstimatedProfit(newEstimatedProfit)
  }, [form, positionDealPrice, couponData.isManual])

  useUpdateEffect(() => {
    const percent = onChangeSlider(form.size, availableSize)
    setForm({
      ...form,
      percent,
    })
    updateStrategyInfo({ ...strategyInfo, closeEntrustType: form.entrustTypeInd })
  }, [form.entrustTypeInd])

  useUpdateEffect(() => {
    setFee(
      calculatorFeeAmount({
        price: form.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? form.price : positionDealPrice,
        amount: form.size,
        feeRate: tradePairDetail.takerFeeRate,
      })
    )
    setAmount(
      `${SafeCalcUtil.mul(
        form.size,
        form.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? form.price : positionDealPrice
      )}`
    )
  }, [form.size, form.entrustTypeInd, form.price, positionDealPrice, tradePairDetail.takerFeeRate])

  useUpdateEffect(() => {
    setIsMatch(true)
  }, [form.size])

  useUpdateEffect(() => {
    if (form.entrustTypeInd === StopLimitEntrustTypeEnum.market && couponData.isManual) {
      setIsMatch(false)
      return
    }

    setIsMatch(true)
  }, [form.price, form.entrustTypeInd, couponData.isManual])

  return (
    <>
      <Popup
        position="bottom"
        visible={visible}
        round
        closeOnPopstate
        safeAreaInsetBottom
        destroyOnClose
        className={styles['close-position-modal-root']}
        onClose={onClose}
      >
        <PositionModalHeader title={t`constants/assets/common-1`} data={props.positionData} onClose={onClose} />
        <div className="modal-content">
          <PositionPrice
            positionData={{ ...props.positionData, latestPrice: positionDealPrice, markPrice: positionMarkPrice }}
            onSelectLatestPrice={() => {
              setForm({
                ...form,
                percent: form.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? form.percent : 0,
                entrustTypeInd: StopLimitEntrustTypeEnum.limit,
                price: removeDecimalZero(onSetPositionOffset(positionDealPrice, priceOffset)),
              })
              updateStrategyInfo({ ...strategyInfo, closeEntrustType: StopLimitEntrustTypeEnum.limit })

              setTimeout(() => {
                priceRef.current?.focus()
              }, 10)
            }}
          />

          <div className="price-content">
            <div className="price-cell">
              <TradePriceInput
                ref={priceRef}
                onlyInput
                className="form-input"
                value={form.price}
                label={
                  form.entrustTypeInd === StopLimitEntrustTypeEnum.market
                    ? t`features_assets_futures_common_close_position_modal_index_5101385`
                    : t({
                        id: 'features_assets_futures_common_close_position_modal_index_45earj2ewq',
                        values: { 0: quoteSymbolName },
                      })
                }
                inputProps={{ disabled: form.entrustTypeInd === StopLimitEntrustTypeEnum.market }}
                onChange={(val: string) => setForm({ ...form, price: onSetPositionOffset(val, priceOffset) })}
              />
              {form.entrustTypeInd === StopLimitEntrustTypeEnum.market && (
                <div
                  className="form-input price-input-focus"
                  onClick={() => {
                    setForm({
                      ...form,
                      entrustTypeInd: StopLimitEntrustTypeEnum.limit,
                      price: '',
                    })
                    updateStrategyInfo({ ...strategyInfo, closeEntrustType: StopLimitEntrustTypeEnum.limit })

                    setTimeout(() => {
                      priceRef.current?.focus()
                    }, 10)
                  }}
                />
              )}
            </div>

            <div className="price-select-item">
              <Dropdown
                label={getStopLimitEntrustTypeName(form.entrustTypeInd) || ''}
                value={form.entrustTypeInd}
                actionList={entrustTypeList}
                onCommit={(val: string) => {
                  setForm({
                    ...form,
                    entrustTypeInd: val,
                    price: val === StopLimitEntrustTypeEnum.limit ? getForm().price : '',
                  })
                  updateStrategyInfo({ ...strategyInfo, closeEntrustType: val })
                }}
              />
            </div>
          </div>

          <div className="form-item">
            <TradePriceInput
              onlyInput
              className="form-input"
              value={form.size}
              label={t({
                id: 'features_assets_futures_common_close_position_modal_index_gkjlnbgbnl',
                values: { 0: baseSymbolName },
              })}
              onChange={(val: string) =>
                setForm({
                  ...form,
                  size: onSetPositionOffset(val, amountOffset),
                  percent: onChangeSlider(val, availableSize) || 0,
                })
              }
            />
          </div>
          <CouponSelect
            fee={fee}
            amount={amount}
            loss={+estimatedProfit > 0 ? '' : estimatedProfit}
            isMatch={isMatch}
            symbol={quoteSymbolName}
            onChange={setCouponData}
          />

          <div className="form-slider">
            <Slider
              activeColor="var(--brand_color)"
              points={[0, 25, 50, 75, 100]}
              showTooltip
              onChange={(val: number) =>
                setForm({
                  ...getForm(),
                  percent: val,
                  size: onChangeInput(val, availableSize, true, amountOffset) || '',
                })
              }
              value={form.percent}
            />
          </div>

          <div className="form-info">
            <span>{t`features_assets_futures_common_close_position_modal_index_5101475`}</span>
            <CommonDigital className="info-value" content={`${availableSize} ${baseSymbolName}`} />
          </div>

          <div className="form-info">
            <span>
              {t`features_orders_future_holding_close_696`}{' '}
              <Icon name="msg" hasTheme className="msg-icon" onClick={() => setHintVisible(true)} />
            </span>
            <div className="info-value">
              <IncreaseTag value={estimatedProfit} digits={offset} hasPrefix right={` ${currencySymbol}`} />
            </div>
          </div>

          <Button
            type="primary"
            className="modal-btn"
            disabled={
              (form.entrustTypeInd === StopLimitEntrustTypeEnum.limit && !form.price) ||
              (form.entrustTypeInd === StopLimitEntrustTypeEnum.limit && Number(form.price) <= 0) ||
              !form.size ||
              Number(form.size) <= 0
            }
            onClick={() => requestWithLoading(onCommitForm(), 0)}
          >
            {t`common.confirm`}
          </Button>
        </div>
      </Popup>

      {hintVisible && (
        <HintModal
          visible={hintVisible}
          title={t`features_orders_future_holding_close_696`}
          content={
            <>
              <div>{t`features_orders_future_holding_close_697`}</div>
              <div>{t`features_assets_futures_common_close_position_modal_index_syqm_tu54p`}</div>
            </>
          }
          onCommit={() => setHintVisible(false)}
        />
      )}

      {marginVisible && (
        <HintModal
          visible={marginVisible}
          showIcon
          content={
            <>
              <div>{t`features_assets_futures_common_close_position_modal_index_5101537`}</div>
            </>
          }
          onCommit={() => setMarginVisible(false)}
        />
      )}
    </>
  )
}

export { ClosePositionModal }
