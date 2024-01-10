/**
 * 合约 - 止盈止损弹窗组件
 */
import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import { Button, Popup, Toast } from '@nbit/vant'
import Icon from '@/components/icon'
import {
  FuturesDetailsPositionTypeEnum,
  FuturesOrderSideTypeEnum,
  getStopLimitEntrustTypeName,
  getStopLimitTriggerPriceTypeName,
  StopLimitEntrustTypeEnum,
  StopLimitStrategyTypeEnum,
  StopLimitTabEnum,
  StopLimitTriggerDirectionEnum,
  StopLimitTriggerPriceTypeEnum,
  StrategyOptionTypeEnum,
} from '@/constants/assets/futures'
import Slider from '@/components/slider'
import {
  getFuturesMarketDepthApi,
  onChangeInput,
  onChangeSlider,
  onGetExpectedProfit,
  onGetTradePairDetails,
  onSetPositionOffset,
} from '@/helper/assets/futures'
import { CommonDigital } from '@/components/common-digital'
import { IncreaseTag } from '@nbit/react'
import { ICoupons, PositionList, StrategyPlaceReq } from '@/typings/api/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useGetState, useUnmount, useUpdateEffect } from 'ahooks'
import {
  deletePerpetualStrategy,
  getPerpetualPositionStrategyDetails,
  postPerpetualStrategyPlace,
} from '@/apis/assets/futures/position'
import { decimalUtils } from '@nbit/utils'
import { WsBizEnum, WsTypesEnum } from '@/constants/ws'
import { YapiGetPerpetualMarketRestV1MarketDepthApiResponse } from '@/typings/yapi/PerpetualMarketRestMarketDepthV1GetApi'
import { requestWithLoading } from '@/helper/order'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import CouponSelect from '@/features/welfare-center/compontents/coupon-select'
import { calculatorFeeAmount, sendRefreshCouponSelectApiNotify } from '@/helper/welfare-center/coupon-select'
import TradePriceInput from '@/features/trade/common/price-input'
import { Dropdown } from '../dropdown'
import { PositionPrice } from '../position-price'
import { HintModal } from '../hint-modal'
import styles from './index.module.css'
import { PositionModalHeader } from '../position-modal-header'

type IForm = {
  /** 触发价格 */
  triggerPrice: string
  /** 触发方式 */
  triggerPriceTypeInd: string
  /** 委托价格 */
  price: string
  /** 委托类型 */
  entrustTypeInd: string
  /** 数量 */
  size: string
  /** 进度条 */
  percent: number
  /** 已选优惠券列表 */
  coupons: ICoupons[]
  /** 止盈止损下单金额 */
  amount: string
  /** 止盈止损手续费 */
  fee: string
}

type IPositionForm = {
  /** 止盈价格 */
  profitPrice: string
  profitType: string
  profitAmount: string
  profitFee: string
  /** 止损价格 */
  lossPrice: string
  lossType: string
  lossFee: string
  lossAmount: string
  /** 已选优惠券列表 */
  coupons: ICoupons[]
}
interface StopLimitModalProps {
  visible: boolean
  type: number
  positionData: PositionList
  onClose: () => void
  onCommit: () => void
}

function StopLimitModal(props: StopLimitModalProps) {
  const { visible, type, onClose, onCommit } = props || {}
  const {
    openPrice,
    markPrice,
    latestPrice,
    quoteSymbolName,
    baseSymbolName,
    size,
    symbol,
    sideInd,
    groupId,
    positionId,
    tradeId,
    amountOffset,
    symbolWassName,
    priceOffset,
    voucherAmount,
  } = props.positionData
  const {
    positionModule: { strategyInfo, updateStrategyInfo },
    wsDealSubscribe,
    wsDealUnSubscribe,
    positionDealPrice,
    wsMarkPriceSubscribe,
    wsMarkPriceUnSubscribe,
    positionMarkPrice,
    updatePositionDealPrice,
    updatePositionMarkPrice,
    updateSymbolWassName,
    futuresCurrencySettings: { offset = 2, currencySymbol },
  } = useAssetsFuturesStore()
  const [activeTab, setActiveTab] = useState<string | number>(type || StopLimitTabEnum.stopLimit)
  const [limitForm, setLimitForm, getLimitForm] = useGetState<IForm>({
    triggerPrice: '',
    triggerPriceTypeInd: strategyInfo.triggerPriceType,
    price: '',
    entrustTypeInd: strategyInfo.entrustType,
    size: '',
    percent: 0,
    fee: '',
    coupons: [],
    amount: '',
  })
  const [positionForm, setPositionForm] = useState<IPositionForm>({
    profitPrice: '', // 止盈触发价格
    profitType: strategyInfo.profitTriggerPriceType, // 止盈触发类型
    profitAmount: '', // 止盈下单金额
    profitFee: '', // 止盈手续费
    lossPrice: '', // 止损触发价格
    lossType: strategyInfo.lossTriggerPriceType, // 止损触发类型
    lossAmount: '', // 止损下单金额
    lossFee: '', // 止损手续费
    coupons: [],
  })

  const [hintVisible, setHintVisible] = useState(false)
  const [tradePairDetails, setTradePairDetails] = useState<YapiGetV1PerpetualTradePairDetailData>(
    {} as YapiGetV1PerpetualTradePairDetailData
  )
  const [positionStopDetails, setPositionStopDetails] = useState<any>(null)
  const [profitInfo, setProfitInfo] = useState({
    profit: '',
    positionProfit: '',
    positionLoss: '',
  }) // 仓位预计止盈止损

  const triggerPriceTypeList = [
    { label: t`future.funding-history.index-price.column.mark-price`, value: StopLimitTriggerPriceTypeEnum.mark },
    { label: t`constants_trade_752`, value: StopLimitTriggerPriceTypeEnum.new },
  ]

  const entrustTypeList = [
    { label: t`features/trade/future/price-input-3`, value: StopLimitEntrustTypeEnum.market },
    { label: t`features_orders_future_holding_close_680`, value: StopLimitEntrustTypeEnum.limit },
  ]

  /**
   * 获取币对详情
   */
  const onloadTradeDetails = async () => {
    setTradePairDetails(await onGetTradePairDetails(symbol))
  }

  /**
   * 获取仓位止盈止损详情
   */
  const onLoadPositionDetails = async () => {
    const res = await getPerpetualPositionStrategyDetails({ id: positionId })
    const { isOk, data, message = '' } = res || {}

    if (!isOk) {
      Toast.info(message)
      return
    }

    if (data && (data?.stopLoss || data?.stopProfit)) {
      setPositionStopDetails(data)
      setPositionForm({
        ...positionForm,
        profitPrice: data?.stopProfit?.triggerPrice,
        profitType: data?.stopProfit?.triggerPriceTypeInd || positionForm.profitType,
        lossPrice: data?.stopLoss?.triggerPrice,
        lossType: data?.stopLoss?.triggerPriceTypeInd || positionForm.lossType,
      })
    }
  }

  /**
   * 计算触发方向
   * 平多 触发价格大于最新价格，标记价格 = 向上
   * 平多 触发价格小于最新价格，标记价格 = 向下
   * 平空 触发价格小于最新价格，标记价格 = 向下
   * 平空 触发价格大于最新价格，标记价格 = 向上
   * @param sideInd 仓位类型 多/空
   * @param triggerPrice 触发价格
   * @param positionDealPrice 最新价格
   * @param positionMarkPrice 标记价格
   * @returns 触发方向 triggerDirectionInd
   */
  const onSetTriggerDirection = param => {
    const { triggerPrice, triggerPriceTypeInd } = param

    let comparePrices =
      triggerPriceTypeInd === StopLimitTriggerPriceTypeEnum.new ? positionDealPrice : positionMarkPrice
    let triggerDirectionInd = ''

    switch (sideInd) {
      case FuturesDetailsPositionTypeEnum.long:
        if (Number(triggerPrice) > Number(comparePrices)) {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.up
        } else {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.down
        }
        break
      case FuturesDetailsPositionTypeEnum.short:
        if (Number(triggerPrice) < Number(comparePrices)) {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.down
        } else {
          triggerDirectionInd = StopLimitTriggerDirectionEnum.up
        }
        break
      default:
        break
    }
    return triggerDirectionInd
  }

  /**
   * 计算止盈止损策略类型 (分批)
   * 当方向为多时，委托价格（限价）/触发价格（市价）>开仓均价 订单记为止盈；委托价格（限价）/触发价格（市价）=<开仓均价 订单记为止损
   * 当方向为空时，委托价格（限价）/触发价格（市价）<开仓均价 订单记为止盈；委托价格（限价）/触发价格（市价）>=开仓均价 订单记为止损
   */
  const onGetTriggerDirection = (newPrice: string) => {
    let strategyTypeInd = ''

    // 计算当前为止盈还是止损
    const difference = Number(decimalUtils.SafeCalcUtil.sub(newPrice, openPrice))

    switch (sideInd) {
      case FuturesDetailsPositionTypeEnum.long:
        strategyTypeInd = difference > 0 ? StopLimitStrategyTypeEnum.stopProfit : StopLimitStrategyTypeEnum.stopLoss
        break
      case FuturesDetailsPositionTypeEnum.short:
        strategyTypeInd = difference > 0 ? StopLimitStrategyTypeEnum.stopLoss : StopLimitStrategyTypeEnum.stopProfit
        break
      default:
        break
    }

    return strategyTypeInd
  }

  /**
   * 获取仓位方向
   */
  const onSetTriggerSide = () => {
    return {
      [FuturesDetailsPositionTypeEnum.long]: FuturesOrderSideTypeEnum.closeLong,
      [FuturesDetailsPositionTypeEnum.short]: FuturesOrderSideTypeEnum.closeShort,
    }[sideInd]
  }

  /**
   * 新增止盈止损
   */
  const onStrategyPlace = async (req, hint: string) => {
    const res = await postPerpetualStrategyPlace(req)
    const { isOk, message = '' } = res || {}
    if (!isOk) {
      Toast.info(message)
      return
    }

    Toast.info(hint)
    onCommit()
    sendRefreshCouponSelectApiNotify()
  }

  /** 确定 */
  const onCommitForm = async () => {
    const triggerSideInd = onSetTriggerSide()

    switch (activeTab) {
      case StopLimitTabEnum.stopLimit: // 止盈止损
        if (+voucherAmount > 0 && +limitForm.size < +size) {
          Toast.info(t`features_assets_futures_common_close_position_modal_index_7hz7pajy9t`)
          return
        }
        if (Number(limitForm.size) > Number(size)) {
          Toast(t`features_assets_futures_common_stop_limit_modal_index_5101445`)
          return
        }

        // 计算当前为止盈还是止损
        const newPrice =
          limitForm.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? limitForm.price : limitForm.triggerPrice
        let strategyTypeInd = onGetTriggerDirection(newPrice)
        const params = {
          groupId,
          positionId,
          tradeId: `${tradeId}`,
          strategyOperationType: StrategyOptionTypeEnum.part,
          strategyTypeInd,
          triggerSideInd: triggerSideInd || '',
          triggerDirectionInd: onSetTriggerDirection({
            triggerPrice: newPrice,
            triggerPriceTypeInd: limitForm.triggerPriceTypeInd,
          }),
          ...limitForm,
        }

        const req: StrategyPlaceReq = {
          stopProfit: params,
          stopLoss: params,
          coupons: limitForm?.coupons,
        }

        if (strategyTypeInd === StopLimitStrategyTypeEnum.stopProfit) {
          delete req.stopLoss
        } else {
          delete req.stopProfit
        }

        requestWithLoading(onStrategyPlace(req, t`features_assets_futures_common_stop_limit_modal_index_5101444`), 0)
        sendRefreshCouponSelectApiNotify()
        break
      case StopLimitTabEnum.positionStopLimit: // 仓位止盈止损
        // 判断止盈价格/类型是否改变
        const isStopProfitChanged = positionForm.profitPrice
          ? positionForm.profitPrice !== positionStopDetails?.stopProfit?.triggerPrice ||
            positionForm.profitType !== positionStopDetails?.stopProfit?.triggerPriceTypeInd
          : !!positionStopDetails?.stopProfit
        // 判断止损价格/类型是否改变
        const isStopLossChanged = positionForm.lossPrice
          ? positionForm.lossPrice !== positionStopDetails?.stopLoss?.triggerPrice ||
            positionForm.lossType !== positionStopDetails?.stopLoss?.triggerPriceTypeInd
          : !!positionStopDetails?.stopLoss
        // 如果修改前后一致就关闭弹窗
        if (!isStopProfitChanged && !isStopLossChanged) {
          onClose()
          return
        }
        // 校验止盈止损输入价格
        const marketDepth: YapiGetPerpetualMarketRestV1MarketDepthApiResponse['data'] =
          (await getFuturesMarketDepthApi(symbol)) || {}
        const maxBids = marketDepth?.bids?.[0]?.[0] || '' // 买 1 价
        const maxAsks = marketDepth?.asks?.[0]?.[0] || '' // 卖 1 价

        // 无对手盘情况处理
        if (
          (sideInd === FuturesDetailsPositionTypeEnum.long &&
            (positionForm.lossPrice || positionForm.profitPrice) &&
            !maxAsks) ||
          (sideInd === FuturesDetailsPositionTypeEnum.short &&
            (positionForm.lossPrice || positionForm.profitPrice) &&
            !maxBids)
        ) {
          Toast.info(t`features_assets_futures_common_stop_limit_modal_index_w6z3vov-_a7rsfnlz-oim`)
          return
        }

        // 多仓位：止盈 > 卖 1 价; 空仓位：止盈 < 买 1 价
        const isProfitPriceWrong =
          sideInd === FuturesDetailsPositionTypeEnum.long
            ? positionForm.profitPrice && Number(positionForm.profitPrice) <= Number(maxAsks)
            : positionForm.profitPrice && Number(positionForm.profitPrice) >= Number(maxBids)

        // 多仓位：止损 < 卖 1 价; 空仓位：止损 > 买 1 价
        const isLossPriceWrong =
          sideInd === FuturesDetailsPositionTypeEnum.long
            ? positionForm.lossPrice && Number(positionForm.lossPrice) >= Number(maxAsks)
            : positionForm.lossPrice && Number(positionForm.lossPrice) <= Number(maxBids)

        if (isProfitPriceWrong && isLossPriceWrong) {
          Toast.info(t`features_assets_futures_common_stop_limit_modal_index_oqgsgxirsn`)
          setPositionForm({ ...positionForm, profitPrice: '', lossPrice: '' })
          return
        } else if (isProfitPriceWrong) {
          Toast.info(t`features_assets_futures_common_stop_limit_modal_index_5101447`)
          setPositionForm({ ...positionForm, profitPrice: '' })
          return
        } else if (isLossPriceWrong) {
          Toast.info(t`features_assets_futures_common_stop_limit_modal_index_5101448`)
          setPositionForm({ ...positionForm, lossPrice: '' })
          return
        }

        const positionParams = {
          groupId,
          positionId,
          size,
          tradeId: `${tradeId}`,
          strategyOperationType: StrategyOptionTypeEnum.position,
          entrustTypeInd: StopLimitEntrustTypeEnum.market,
        }

        let positionReq: StrategyPlaceReq = {
          coupons: positionForm.coupons,
        } as StrategyPlaceReq

        if (isStopProfitChanged) {
          // 撤销当前仓位止盈订单
          if (positionStopDetails?.stopProfit) {
            const res = await deletePerpetualStrategy({ id: positionStopDetails?.stopProfit?.id })
            const { isOk, message = '' } = res || {}
            if (!isOk) {
              Toast.info(message)
              return
            }
          }

          if (positionForm.profitPrice) {
            positionReq.stopProfit = {
              strategyTypeInd: StopLimitStrategyTypeEnum.stopProfit,
              triggerSideInd: triggerSideInd || '',
              triggerPrice: positionForm.profitPrice,
              triggerPriceTypeInd: positionForm.profitType,
              triggerDirectionInd: onSetTriggerDirection({
                strategyTypeInd: StopLimitStrategyTypeEnum.stopProfit,
                triggerPrice: positionForm.profitPrice,
                triggerPriceTypeInd: positionForm.profitType,
              }),
              ...positionParams,
            }
          }
        }

        if (isStopLossChanged) {
          // 撤销当前仓位止损订单
          if (positionStopDetails?.stopLoss) {
            const res = await deletePerpetualStrategy({ id: positionStopDetails?.stopLoss?.id })
            const { isOk, message = '' } = res || {}
            if (!isOk) {
              Toast.info(message)
              return
            }
          }

          if (positionForm.lossPrice) {
            positionReq.stopLoss = {
              strategyTypeInd: StopLimitStrategyTypeEnum.stopLoss,
              triggerSideInd: triggerSideInd || '',
              triggerPrice: positionForm.lossPrice,
              triggerPriceTypeInd: positionForm.lossType,
              triggerDirectionInd: onSetTriggerDirection({
                strategyTypeInd: StopLimitStrategyTypeEnum.stopLoss,
                triggerPrice: positionForm.lossPrice,
                triggerPriceTypeInd: positionForm.lossType,
              }),
              ...positionParams,
            }
          }
        }

        positionReq.stopProfit || positionReq.stopLoss
          ? requestWithLoading(
              onStrategyPlace(positionReq, t`features_orders_future_holding_position_stop_limit_720`),
              0
            )
          : onCommit()
        break
      default:
        break
    }
  }

  const dealSubs = {
    biz: WsBizEnum.perpetual,
    type: WsTypesEnum.perpetualDeal,
    base: baseSymbolName,
    quote: quoteSymbolName,
    contractCode: symbolWassName,
  }

  const markSubs = { biz: WsBizEnum.perpetual, type: WsTypesEnum.perpetualIndex, contractCode: symbolWassName }

  useEffect(() => {
    updateSymbolWassName(symbolWassName)
    updatePositionDealPrice(latestPrice)
    updatePositionMarkPrice(markPrice)
    onloadTradeDetails()
    activeTab === StopLimitTabEnum.positionStopLimit && onLoadPositionDetails()
    wsDealSubscribe(dealSubs)
    wsMarkPriceSubscribe(markSubs)
  }, [])

  useUnmount(() => {
    wsDealUnSubscribe(dealSubs)
    wsMarkPriceUnSubscribe(markSubs)
  })

  useUpdateEffect(() => {
    activeTab === StopLimitTabEnum.positionStopLimit && onLoadPositionDetails()
  }, [activeTab])

  useUpdateEffect(() => {
    // 计算预计盈亏
    // 限价：(委托价格 - 开仓均价) * 平仓数量 - 委托价格 * 平仓数量 * taker 费率
    // 市价：(触发价格 - 开仓均价) * 平仓数量 - 触发价格 * 平仓数量 * taker 费率
    const price = limitForm.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? limitForm.price : limitForm.triggerPrice
    setProfitInfo({
      ...profitInfo,
      profit: onGetExpectedProfit({
        price,
        closeSize: limitForm.size,
        openPrice,
        takerFeeRate: tradePairDetails?.takerFeeRate || '',
        sideInd,
      }),
    })
  }, [limitForm])

  useUpdateEffect(() => {
    // 计算止盈止损下单金额（折算成 USD）
    const price = limitForm.entrustTypeInd === StopLimitEntrustTypeEnum.limit ? limitForm.price : limitForm.triggerPrice
    setLimitForm({
      ...limitForm,
      amount: `${decimalUtils.SafeCalcUtil.mul(limitForm?.size, price)}`,
      fee: calculatorFeeAmount({
        price,
        amount: limitForm?.size,
        feeRate: tradePairDetails?.takerFeeRate || '',
      }),
    })
  }, [limitForm?.price, limitForm?.size, limitForm?.triggerPrice, limitForm?.entrustTypeInd])

  useUpdateEffect(() => {
    // 计算仓位止盈止损预计盈亏
    // 市价：(触发价格 - 开仓均价) * 平仓数量 - 触发价格 * 平仓数量 * taker 费率
    setProfitInfo({
      ...profitInfo,
      positionProfit: onGetExpectedProfit({
        price: positionForm.profitPrice,
        closeSize: size,
        openPrice,
        takerFeeRate: tradePairDetails?.takerFeeRate || '',
        sideInd,
      }),
      positionLoss: onGetExpectedProfit({
        price: positionForm.lossPrice,
        closeSize: size,
        openPrice,
        takerFeeRate: tradePairDetails?.takerFeeRate || '',
        sideInd,
      }),
    })
  }, [positionForm])

  useUpdateEffect(() => {
    // 计算仓位止盈下单金额
    setPositionForm({
      ...positionForm,
      profitAmount: `${decimalUtils.SafeCalcUtil.mul(positionForm.profitPrice, size)}`,
      profitFee: calculatorFeeAmount({
        price: positionForm.profitPrice,
        amount: size,
        feeRate: tradePairDetails?.takerFeeRate || '',
      }),
    })
  }, [positionForm?.profitPrice])

  useUpdateEffect(() => {
    // 计算仓位止损下单金额
    setPositionForm({
      ...positionForm,
      lossAmount: `${decimalUtils.SafeCalcUtil.mul(positionForm.lossPrice, size)}`,
      lossFee: calculatorFeeAmount({
        price: positionForm.lossPrice,
        amount: size,
        feeRate: tradePairDetails?.takerFeeRate || '',
      }),
    })
  }, [positionForm?.lossPrice])

  /**
   * 止盈止损
   */
  const onRenderContent = () => {
    return (
      <>
        <div className="price-content">
          <TradePriceInput
            onlyInput
            className="form-input flex-1"
            value={limitForm.triggerPrice}
            label={t({
              id: 'features_assets_futures_common_stop_limit_modal_index_dja66cxyjo',
              values: { 0: quoteSymbolName },
            })}
            onChange={(val: string) =>
              setLimitForm({ ...limitForm, triggerPrice: onSetPositionOffset(val, priceOffset) })
            }
          />

          <div className="price-select-item">
            <Dropdown
              label={getStopLimitTriggerPriceTypeName(limitForm.triggerPriceTypeInd) || ''}
              value={limitForm.triggerPriceTypeInd}
              actionList={triggerPriceTypeList}
              onCommit={(val: string) => {
                setLimitForm({ ...limitForm, triggerPriceTypeInd: val })
                updateStrategyInfo({ ...strategyInfo, triggerPriceType: val })
              }}
            />
          </div>
        </div>

        <div className="price-content">
          <TradePriceInput
            onlyInput
            className="form-input flex-1"
            value={limitForm.price}
            label={
              limitForm.entrustTypeInd === StopLimitEntrustTypeEnum.market
                ? t({
                    id: 'features_assets_futures_common_stop_limit_modal_index_5101375',
                    values: { 0: quoteSymbolName },
                  })
                : t({
                    id: 'features_assets_futures_common_stop_limit_modal_index_6yizdqop_y',
                    values: { 0: quoteSymbolName },
                  })
            }
            inputProps={{ disabled: limitForm.entrustTypeInd === StopLimitEntrustTypeEnum.market }}
            onChange={(val: string) => setLimitForm({ ...limitForm, price: onSetPositionOffset(val, priceOffset) })}
          />

          <div className="price-select-item">
            <Dropdown
              label={getStopLimitEntrustTypeName(limitForm.entrustTypeInd) || ''}
              value={limitForm.entrustTypeInd}
              actionList={entrustTypeList}
              onCommit={(val: string) => {
                setLimitForm({
                  ...limitForm,
                  entrustTypeInd: val,
                  price: val === StopLimitEntrustTypeEnum.market ? '' : limitForm.price,
                })
                updateStrategyInfo({ ...strategyInfo, entrustType: val })
              }}
            />
          </div>
        </div>

        <div className="form-item z-1">
          <TradePriceInput
            onlyInput
            className="form-input"
            value={limitForm.size}
            label={t({
              id: 'features_assets_futures_common_stop_limit_modal_index_19pqr55csr',
              values: { 0: baseSymbolName },
            })}
            onChange={(val: string) => {
              setLimitForm({
                ...limitForm,
                size: onSetPositionOffset(val, amountOffset),
                percent: onChangeSlider(val, size) || 0,
              })
            }}
          />
        </div>
        <CouponSelect
          fee={limitForm?.fee}
          amount={limitForm?.amount}
          loss={+profitInfo.profit >= 0 ? '' : profitInfo.profit}
          symbol={quoteSymbolName}
          onChange={e => setLimitForm({ ...limitForm, coupons: e?.coupons })}
        />

        <div className="form-slider">
          <Slider
            activeColor="var(--brand_color)"
            points={[0, 25, 50, 75, 100]}
            showTooltip
            onChange={(val: number) =>
              setLimitForm({
                ...getLimitForm(),
                percent: val,
                size: onChangeInput(val, size, true, Number(amountOffset)) || '',
              })
            }
            value={limitForm.percent}
          />
        </div>

        <div className="form-info">
          <span>{t`features_orders_future_holding_close_695`}</span>
          <CommonDigital className="info-value" content={`${size} ${baseSymbolName}`} />
        </div>

        <div className="form-info">
          <span>
            {t`features_orders_future_holding_close_696`}{' '}
            <Icon name="msg" className="msg-icon" onClick={() => setHintVisible(true)} />
          </span>
          <IncreaseTag value={profitInfo.profit} hasPrefix right={` ${currencySymbol}`} digits={offset} />
        </div>
      </>
    )
  }

  /**
   * 仓位止盈止损
   */
  const onRenderPositionContent = () => {
    const positionContent = [
      {
        title: t`features_orders_future_holding_close_683`,
        id: 'stopProfit',
        value: positionForm.profitPrice,
        dropdownLabel: getStopLimitTriggerPriceTypeName(positionForm.profitType),
        dropdownValue: positionForm.profitType,
        dropdownCommit: (val: string) => {
          setPositionForm({ ...positionForm, profitType: val })
          updateStrategyInfo({ ...strategyInfo, profitTriggerPriceType: val })
        },
        onChangePrice: (val: string) =>
          setPositionForm({ ...positionForm, profitPrice: onSetPositionOffset(val, priceOffset) }),
        hint: (
          <div className="price-hint">
            <span
              dangerouslySetInnerHTML={{
                __html: t({
                  id: 'features_assets_futures_common_stop_limit_modal_index_5101378',
                  values: {
                    0: getStopLimitTriggerPriceTypeName(positionForm.profitType),
                    1: positionForm.profitPrice || '--',
                  },
                }),
              }}
            ></span>{' '}
            <IncreaseTag value={profitInfo?.positionProfit || '--'} hasPrefix right={currencySymbol} digits={offset} />
          </div>
        ),
      },
      {
        title: t`features_orders_future_holding_close_684`,
        id: 'stopLoss',
        value: positionForm.lossPrice,
        dropdownLabel: getStopLimitTriggerPriceTypeName(positionForm.lossType),
        dropdownValue: positionForm.lossType,
        dropdownCommit: (val: string) => {
          setPositionForm({ ...positionForm, lossType: val })
          updateStrategyInfo({ ...strategyInfo, lossTriggerPriceType: val })
        },
        onChangePrice: (val: string) =>
          setPositionForm({ ...positionForm, lossPrice: onSetPositionOffset(val, priceOffset) }),
        hint: (
          <div className="price-hint">
            <span
              dangerouslySetInnerHTML={{
                __html: t({
                  id: 'features_assets_futures_common_stop_limit_modal_index_5101383',
                  values: {
                    0: getStopLimitTriggerPriceTypeName(positionForm.lossType),
                    1: positionForm.lossPrice || '--',
                  },
                }),
              }}
            ></span>{' '}
            <IncreaseTag
              value={profitInfo?.positionLoss || '--'}
              hasPrefix
              right={` ${currencySymbol}`}
              digits={offset}
            />
          </div>
        ),
      },
    ]
    return (
      <>
        {positionContent.map((contentItem, index: number) => {
          return (
            <div key={index}>
              <div className="price-content">
                <TradePriceInput
                  onlyInput
                  className="form-input flex-1"
                  value={contentItem.value}
                  label={t({
                    id: 'features_assets_futures_common_stop_limit_modal_index_5101381',
                    values: { 0: contentItem.title, 1: quoteSymbolName },
                  })}
                  onChange={(val: string) => contentItem.onChangePrice(val)}
                />

                <div className="price-select-item">
                  <Dropdown
                    label={contentItem.dropdownLabel || ''}
                    value={contentItem.dropdownValue}
                    actionList={triggerPriceTypeList}
                    onCommit={(val: string) => contentItem.dropdownCommit(val)}
                  />
                </div>
              </div>
              {contentItem.hint}
            </div>
          )
        })}

        <CouponSelect
          className="position-coupon-select"
          fee={
            positionForm?.profitFee && positionForm?.lossFee
              ? `${Math.min(+positionForm?.profitFee, +positionForm?.lossFee)}`
              : positionForm?.profitFee || positionForm?.lossFee
          }
          amount={
            positionForm?.profitAmount && positionForm?.lossAmount
              ? `${Math.min(+positionForm?.profitAmount, +positionForm?.lossAmount)}`
              : positionForm?.profitAmount || positionForm?.lossAmount
          }
          loss={+profitInfo?.positionLoss >= 0 ? '' : profitInfo?.positionLoss}
          symbol={quoteSymbolName}
          onChange={e => setPositionForm({ ...positionForm, coupons: e.coupons })}
        />
      </>
    )
  }

  // '确认'按钮是否 disable
  const confirmBtnDisable =
    activeTab === StopLimitTabEnum.stopLimit &&
    ((limitForm.entrustTypeInd === StopLimitEntrustTypeEnum.limit && !(Number(limitForm.price) > 0)) ||
      !(Number(limitForm.triggerPrice) > 0) ||
      !(Number(limitForm.size) > 0))
  return (
    <>
      <Popup
        className={styles['stop-limit-modal-root']}
        position="bottom"
        visible={visible}
        round
        closeOnPopstate
        safeAreaInsetBottom
        destroyOnClose
        onClose={onClose}
      >
        <PositionModalHeader
          fixed
          title={t`features_trade_contract_contract_filters_index_5101498`}
          data={props.positionData}
          onClose={onClose}
        />
        <div className="modal-tabs">
          <div className="tabs-cell">
            <div
              className={`tab-cell ${activeTab === StopLimitTabEnum.stopLimit && 'active-tab-cell'}`}
              onClick={() => setActiveTab(StopLimitTabEnum.stopLimit)}
            >
              {t`features_orders_future_holding_close_683`}/{t`features_orders_future_holding_close_684`}
            </div>
            <div
              className={`tab-cell ${activeTab === StopLimitTabEnum.positionStopLimit && 'active-tab-cell'}`}
              onClick={() => setActiveTab(StopLimitTabEnum.positionStopLimit)}
            >{t`features_orders_future_holding_close_687`}</div>
          </div>
        </div>
        <div className="modal-content">
          <PositionPrice
            positionData={{
              ...props.positionData,
              latestPrice: positionDealPrice,
              markPrice: positionMarkPrice,
            }}
          />
          {activeTab === StopLimitTabEnum.stopLimit && onRenderContent()}
          {activeTab === StopLimitTabEnum.positionStopLimit && onRenderPositionContent()}
        </div>

        <div className="modal-bottom">
          <Button
            type="primary"
            className="modal-btn w-full"
            disabled={confirmBtnDisable}
            onClick={() => requestWithLoading(onCommitForm(), 0)}
          >
            {t`common.confirm`}
          </Button>
        </div>
      </Popup>

      <HintModal
        visible={hintVisible}
        title={t`features_orders_future_holding_close_696`}
        content={
          <>
            <div>{t`features_orders_future_holding_close_697`}</div>
            <div>{t`features_orders_future_holding_close_698`}</div>
          </>
        }
        onCommit={() => setHintVisible(false)}
      />
    </>
  )
}

export { StopLimitModal }
