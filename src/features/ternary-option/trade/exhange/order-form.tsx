import { useTernaryOptionStore } from '@/store/ternary-option'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { requestWithLoading } from '@/helper/order'
import { useCountDown, useDebounceFn, useRequest, useUpdateEffect } from 'ahooks'
import {
  TernaryOptionTradeDirectionEnum,
  TernaryOptionTradeInputNameEnum,
  getTernaryOptionTradeDirectionEnumNameInAction,
} from '@/constants/ternary-option'
import UnderlineTip from '@/features/trade/common/underline-tip'
import { formatCurrency, formatNumberDecimalWhenExceed, getPercentDisplay } from '@/helper/decimal'
import PriceInput from '@/features/trade/common/price-input'
import { useEffect, useRef, useState } from 'react'
import { Checkbox, InputInstance, Toast } from '@nbit/vant'
import TradeButtonRadios, { TradeButtonRadiosPresetClassNames } from '@/features/trade-button-radios'
import { decimalUtils } from '@nbit/utils'
import { createRadioIconRender, optionRadioIconRender } from '@/components/radio/icon-render'
import Slider from '@/components/slider'
import { createOptionNormalOrder, createOptionPlanOrder, queryOptionProfitRateList } from '@/apis/ternary-option/trade'
import { ITernaryOptionTradeProfitRate } from '@/typings/api/ternary-option'
import { getOptionCreateOrderParams, validateOptionCreateOrderParams } from '@/helper/ternary-option/trade'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { ISubscribeParams } from '@/plugins/ws/types'
import { WsBizEnum, WsThrottleTimeEnum, WsTypesEnum } from '@/constants/ws'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import optionWs from '@/plugins/ws/option'
import { baseCommonStore, useCommonStore } from '@/store/common'
import { useUserStore } from '@/store/user'
import DomAutoScaleWrapper from '@/components/dom-auto-scale-wrapper'
import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { link } from '@/helper/link'
import { replaceEmpty } from '@/helper/filters'
import type { OptionYields } from '@/plugins/ws/protobuf/ts/proto/OptionYields'
import produce from 'immer'
import Icon from '@/components/icon'
import { getAssetsRechargePageRoutePath } from '@/helper/route'
import { envIsDev } from '@/helper/env'
import CouponSelect from '@/features/welfare-center/compontents/coupon-select'
import { ScenesBeUsedEnum } from '@/constants/welfare-center/common'
import { useReloadVisible } from '@/hooks/use-reload-visible'
import { sendRefreshCouponSelectApiNotify } from '@/helper/welfare-center/coupon-select'
import { OrderFormAdvance } from './order-form-advance'
import { useOptionExchangeContext } from './context'
import styles from './order-form-modal.module.css'
import { ProfitRateTable } from './profit-rate-table'
import { OptionTimes } from './time'
import { CommonAmountOptions } from './common-amount-options'
import QuickTradeCountDown from './quick-trade-count-down'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

function modifyFusionModeYield(item: ITernaryOptionTradeProfitRate) {
  const { isFusionMode } = baseCommonStore.getState()
  // 融合模式 + 1
  if (isFusionMode) {
    item.yield = SafeCalcUtil.add(item.yield, 1).toNumber()
  }
}

function useProfitRates() {
  const { isTutorialMode } = useOptionTradeStore()
  const { tradeInfo, isOver, isActive } = useOptionExchangeContext()
  const { currentCoin } = useTernaryOptionStore()
  // 后端数据已按从小到大排列好
  const [profitRates, setProfitRates] = useState<{
    up: ITernaryOptionTradeProfitRate[]
    down: ITernaryOptionTradeProfitRate[]
  }>(
    isTutorialMode
      ? {
          up: [
            {
              yield: 0.01,
              id: 1,
              amplitude: '21',
            },
            {
              yield: 0.04,
              id: 2,
              amplitude: '40',
            },
            {
              yield: 0.01,
              id: 3,
              amplitude: '60',
            },
          ],
          down: [],
        }
      : {
          up: [],
          down: [],
        }
  )
  const { isLogin } = useUserStore()
  const setup = async () => {
    if (isTutorialMode) {
      return
    }
    if (!isLogin || !tradeInfo.time?.id || !currentCoin.id || !isActive) {
      return
    }
    const promise = Promise.all([
      queryOptionProfitRateList({
        sideInd: isOver ? TernaryOptionTradeDirectionEnum.overCall : TernaryOptionTradeDirectionEnum.call,
        optionId: currentCoin.id,
        periodId: tradeInfo.time?.id as any,
      }),
      queryOptionProfitRateList({
        sideInd: isOver ? TernaryOptionTradeDirectionEnum.overPut : TernaryOptionTradeDirectionEnum.put,
        optionId: currentCoin.id,
        periodId: tradeInfo.time?.id as any,
      }),
    ])
    const allRes = await requestWithLoading(promise)
    const [upRes, downRes] = allRes
    if (!upRes.data || !downRes.data) return
    // 为统一计算，收益转成正数
    allRes.forEach(res => {
      if (!res.data) return
      res.data.forEach(item => {
        item.frontendIsUp = SafeCalcUtil.sub(item.amplitude, 0).gt(0)
        item.amplitude = Math.abs(Number(item.amplitude || 0)).toString()
        modifyFusionModeYield(item)
      })
      res.data.sort((a, b) => SafeCalcUtil.sub(a.amplitude, b.amplitude).toNumber())
    })
    setProfitRates({
      up: upRes.data,
      down: downRes.data,
    })
  }
  const setupRef = useRef(setup)
  setupRef.current = setup
  const coinRef = useRef(currentCoin)
  coinRef.current = currentCoin
  // 这两个都不用管币对 id，等 time 就行
  useEffect(() => {
    setup()
  }, [isLogin, isActive, tradeInfo.time])
  useEffect(() => {
    // 未激活就不订阅
    if (!isActive || !tradeInfo.time) {
      return
    }
    const onRateChange = (res: OptionYields[]) => {
      const data = res?.[0] || {}
      const { list } = data

      if (!list?.[0] || list[0].optionId.toString() !== coinRef.current.id.toString()) {
        return
      }
      setProfitRates(
        produce(draft => {
          const directions = isOver
            ? [TernaryOptionTradeDirectionEnum.overCall, TernaryOptionTradeDirectionEnum.overPut]
            : [TernaryOptionTradeDirectionEnum.call, TernaryOptionTradeDirectionEnum.put]
          directions.forEach((direction, index) => {
            const profits = list.filter(item => item.sideInd === direction)
            const isUp = index === 0
            const target = isUp ? draft.up : draft.down
            target.forEach(item => {
              const exitsProfit = profits.find(
                profit => Math.abs(Number(profit.amplitude)) === Math.abs(Number(item.amplitude))
              )
              if (exitsProfit) {
                item.yield = Number((exitsProfit as any).yield || exitsProfit.yieldRate)
                modifyFusionModeYield(item)
              }
            })
          })
        })
      )
    }
    const subscribeParams: ISubscribeParams[] = [
      {
        subs: {
          biz: WsBizEnum.option,
          type: WsTypesEnum.optionYields,
          contractCode: `${currentCoin.id}_${tradeInfo.time?.id}`,
        },
        throttleTime: WsThrottleTimeEnum.Market,
        throttleType: WSThrottleTypeEnum.cover,
        callback: onRateChange,
      },
    ]
    subscribeParams.forEach(({ callback, ...params }) => {
      optionWs.subscribe({
        ...params,
        callback,
      })
    })
    return () => {
      subscribeParams.forEach(params => {
        optionWs.unsubscribe(params)
      })
    }
  }, [isActive, tradeInfo.time])

  return profitRates
}

const multiplierIsMultiple = (value: number) => {
  return [2].includes(value)
}
function useOrderFormCountDown({
  enableCountDown,
  setEnableCountDown,
}: {
  enableCountDown: boolean
  setEnableCountDown: (value: boolean) => void
}) {
  const [targetDate, setTargetDate] = useState(Date.now())
  const { tradeInfo, currentCoin } = useOptionExchangeContext()
  const [, { seconds }] = useCountDown({
    targetDate,
    onEnd() {
      setEnableCountDown(false)
    },
  })
  useUpdateEffect(() => {
    setTargetDate(Date.now())
  }, [tradeInfo.time, currentCoin.id])
  useUpdateEffect(() => {
    if (!enableCountDown) {
      setTargetDate(Date.now())
      return
    }
    if (!tradeInfo.time || tradeInfo.time.limitRange === 0 || !tradeInfo.time.limitRange) {
      return
    }
    // 延后 1s
    setTargetDate(Date.now() + tradeInfo.time.limitRange! * 1000 + 1000)
  }, [enableCountDown])

  return seconds
}

export function OrderForm({ overModeIsTable, onFinish }) {
  const context = useOptionExchangeContext()
  const {
    tradeInfo,
    isUp: isBuy,
    isOver,
    onTargetProfitRateChange,
    onAdvancedEntrustCheckedChange,
    buyDigit,
    balance,
    isActive,
    upDirection,
    onAmountChange,
    onCouponChange,
    couponsRef,
  } = context
  const { currentCoin } = useTernaryOptionStore()
  const { isFusionMode } = useCommonStore()
  const {
    getSelectedProfitRateCache,
    cacheData,
    updateMyTradeActiveTabCounter,
    tradeEnums,
    isTutorialMode,
    updateTradeRestSecond,
    updateOptionBuyCallback,
    updateOptionSellCallback,
    updateCountDownComponent,
  } = useOptionTradeStore()
  // 接口保证正负价差一样
  const { up: profitRates, down: downProfitRates } = useProfitRates()
  const amountPlaceholder = t({
    id: `features_ternary_option_trade_exhange_order_form_rzbrykc_ko`,
    values: {
      0: formatCurrency(currentCoin.minAmount),
    },
  })
  // 不管是指数还是标记价格，反正用这个
  const targetPrice = SafeCalcUtil.add(currentCoin.last, isOver ? tradeInfo.targetProfitRate?.amplitude : 0).toString()
  const downTargetPrice = SafeCalcUtil.sub(
    currentCoin.last,
    isOver ? tradeInfo.targetProfitRate?.amplitude : 0
  ).toString()
  const inputRefs = useRef<Record<TernaryOptionTradeInputNameEnum, InputInstance | null>>({
    [TernaryOptionTradeInputNameEnum.amount]: null,
    [TernaryOptionTradeInputNameEnum.maxAmount]: null,
    [TernaryOptionTradeInputNameEnum.maxTriggerTimes]: null,
  })
  const { isLogin } = useUserStore()
  const { advancedEntrustChecked, targetProfitRate } = tradeInfo
  const downTargetProfitRate = downProfitRates.find(item => item.amplitude === targetProfitRate?.amplitude)
  // 收益率会实时更新
  const upTargetProfitRate = profitRates.find(item => item.amplitude === targetProfitRate?.amplitude)
  const [enableCountDown, setEnableCountDown] = useState(false)
  const countDownSeconds = useOrderFormCountDown({
    enableCountDown,
    setEnableCountDown,
  })
  useEffect(() => {
    updateTradeRestSecond(countDownSeconds)
    updateCountDownComponent(type => {
      return <QuickTradeCountDown restSecond={countDownSeconds} type={type} />
    })
  }, [countDownSeconds])
  const countDownSecondsText = t({
    id: `features_ternary_option_trade_exhange_order_form_wk75b5ezxn`,
    values: {
      0: countDownSeconds,
    },
  })
  const { run, loading } = useRequest(
    async (direction: TernaryOptionTradeDirectionEnum) => {
      if (!isLogin) {
        link(`/login?redirect=${encodeURIComponent(window.location.pathname.split('?')[0])}`)
        return
      }
      if (disabled) {
        return
      }
      if (!currentCoin.id || !tradeInfo.time) {
        Toast(t`features_ternary_option_trade_exhange_actions_uubxtotchs`)
        return
      }
      const paramsTradeInfo = {
        ...tradeInfo,
        targetProfitRate: [TernaryOptionTradeDirectionEnum.overPut, TernaryOptionTradeDirectionEnum.put].includes(
          direction
        )
          ? downTargetProfitRate
          : targetProfitRate,
        direction,
      }
      const validateResult = validateOptionCreateOrderParams(paramsTradeInfo, context)
      if (typeof validateResult !== 'boolean') {
        inputRefs.current[validateResult]?.focus()
        return
      }
      if (validateResult === false) return
      const params = getOptionCreateOrderParams(paramsTradeInfo, couponsRef)
      const promise = tradeInfo.advancedEntrustChecked
        ? createOptionPlanOrder(params.planParams)
        : createOptionNormalOrder(params.normalParams)
      const res = await requestWithLoading(promise)
      if (!res.isOk) return
      setEnableCountDown(true)
      context.resetData()
      updateMyTradeActiveTabCounter()
      sendRefreshCouponSelectApiNotify()
    },
    {
      manual: true,
      throttleWait: 1000,
      throttleTrailing: false,
    }
  )
  const disabled = countDownSeconds > 0 || (isLogin && !targetProfitRate) || loading
  useUpdateEffect(() => {
    // 清空收益率，避免选择时间后请求收益率没回来或者接口失败
    onTargetProfitRateChange(null)
  }, [tradeInfo.time])
  useEffect(() => {
    updateOptionBuyCallback(() => {
      run(isOver ? TernaryOptionTradeDirectionEnum.overCall : TernaryOptionTradeDirectionEnum.call)
    })
    updateOptionSellCallback(() => {
      run(isOver ? TernaryOptionTradeDirectionEnum.overPut : TernaryOptionTradeDirectionEnum.put)
    })
  }, [countDownSeconds, tradeInfo, currentCoin.id, isLogin])
  const amountList = tradeEnums.amountOptions.enums.map(item => item.value as number)
  // 加倍数组
  const multipliersOptions = [
    ...(cacheData.commonAmountOptions.length > 0 ? cacheData.commonAmountOptions : amountList.slice(0, 4)),
    2,
  ].map(item => {
    return {
      label: `${item}${multiplierIsMultiple(item) ? 'x' : ''}`,
      value: item,
    }
  })
  const [multiplier, setMultiplier] = useState(0)
  const onMultiplierChange = (value: number) => {
    let target = multiplierIsMultiple(value)
      ? decimalUtils.SafeCalcUtil.mul(tradeInfo.amount || currentCoin.minAmount, value).toString()
      : value.toString()
    if (SafeCalcUtil.sub(currentCoin.maxAmount, target).lt(0)) {
      target = currentCoin.maxAmount.toString()
    }
    onAmountChange(target)
    setMultiplier(value)
    setTimeout(() => {
      setMultiplier(0)
    }, 200)
  }
  const availableText = t`features_trade_future_settings_margin_auto_detail_coins_5101376`
  const low = profitRates[0]?.amplitude
  const hight = profitRates[profitRates.length - 1]?.amplitude
  const [diffPricePercent, setDiffPricePercent] = useState(0)

  function getTargetProfit(percent: number) {
    const percentPrice = SafeCalcUtil.add(
      low,
      SafeCalcUtil.mul(SafeCalcUtil.sub(hight, low), SafeCalcUtil.div(percent, 100))
    ).toString()
    const sortedProfitRates = [...profitRates].sort((a, b) => {
      const diff = SafeCalcUtil.sub(
        Math.abs(SafeCalcUtil.sub(a.amplitude, percentPrice).toNumber()),
        Math.abs(SafeCalcUtil.sub(b.amplitude, percentPrice).toNumber())
      ).toNumber()
      if (diff !== 0) {
        return diff
      }
      return SafeCalcUtil.sub(a.amplitude, b.amplitude).toNumber()
    })
    const targetProfit = sortedProfitRates[0]

    return targetProfit
  }
  function calcPercent(value: ITernaryOptionTradeProfitRate) {
    const percent = Number(
      SafeCalcUtil.div(SafeCalcUtil.sub(value?.amplitude, low), SafeCalcUtil.sub(hight, low)).mul(100).toFixed(2)
    )

    return percent
  }

  // dragEnd 在点击的时候无用
  const { run: onSliderEndDebounce } = useDebounceFn(
    () => {
      const targetProfit = getTargetProfit(diffPricePercent)
      if (targetProfit) {
        onTargetProfitRateChange(targetProfit)
        const percent = calcPercent(targetProfit)
        setDiffPricePercent(percent)
      }
    },
    {
      wait: 100,
    }
  )
  const onSliderChange = (percent: number) => {
    const targetProfit = getTargetProfit(percent)
    if (targetProfit) {
      onTargetProfitRateChange(targetProfit)
    }
    setDiffPricePercent(percent)
    // 暂时去掉，如果需要结束后吸附到最准确的位置，就加上
    // onSliderEndDebounce()
  }
  const onTableProfitChange = (value: ITernaryOptionTradeProfitRate) => {
    onTargetProfitRateChange(value)
    const percent = calcPercent(value)

    setDiffPricePercent(percent)
  }
  useUpdateEffect(() => {
    // 考虑收益率更新后寻找相同价差即可
    const cacheProfit = getSelectedProfitRateCache(currentCoin.symbol!, upDirection)
    // 暂定按价差
    const initProfit = profitRates.find(item => item.amplitude === cacheProfit?.amplitude) || profitRates[0]
    onTargetProfitRateChange(initProfit)
    if (getTargetProfit(diffPricePercent)?.amplitude !== initProfit?.amplitude) {
      const percent = calcPercent(initProfit)
      setDiffPricePercent(percent)
    }
  }, [profitRates])
  const profitSymbol = '±'
  const profitRateTextId = isFusionMode
    ? `features_ternary_option_trade_exhange_order_form_mark_1`
    : `features_ternary_option_trade_exhange_order_form_mark_2`
  const upProfitRateText = t({
    id: profitRateTextId,
    values: {
      0: isFusionMode ? upTargetProfitRate?.yield : getPercentDisplay(upTargetProfitRate?.yield || 0),
    },
  })
  const downProfitRateText = t({
    id: profitRateTextId,
    values: {
      0: isFusionMode ? downTargetProfitRate?.yield : getPercentDisplay(downTargetProfitRate?.yield || 0),
    },
  })
  const wrapperRef = useRef<HTMLDivElement>(null)
  // 每次都执行，因为里面的参数都存在了 context 里，所以变化时会触发
  useEffect(() => {
    if (!isActive) {
      return
    }
    // 开发环境下关闭，chrome 下有 bug 会导致 cpu 占用过高
    if (envIsDev) {
      return
    }
    document.body.style.setProperty('--tab-sticky-top', `${(wrapperRef.current?.clientHeight || 0) + 62.5}px`)
  })
  const clickRecharge = () => {
    link(getAssetsRechargePageRoutePath(currentCoin.coinId))
  }

  return (
    <>
      <div
        className={classNames(styles['exchange-order-modal-form'], 'text-sm text-leading-1-5 pt-3', {
          hidden: !isActive,
        })}
      >
        {!isOver && (
          <div className="mb-3  px-4">
            <div className="order-types-wrapper rv-hairline--surround">
              <div className="font-medium">{t`features_ternary_option_trade_exhange_order_form_9yido7d_db`}</div>
              <div className="flex items-center">
                <Checkbox
                  iconSize={14}
                  checked={!advancedEntrustChecked}
                  onChange={val => onAdvancedEntrustCheckedChange(!val)}
                  shape="square"
                  className="mr-4"
                  iconRender={optionRadioIconRender}
                >
                  <div
                    className={classNames({
                      'text-brand_color': !advancedEntrustChecked,
                    })}
                  >{t`features_trade_future_settings_order_confirm_634`}</div>
                </Checkbox>
                <div id={OPTION_GUIDE_ELEMENT_IDS_ENUM.advance}>
                  <Checkbox
                    iconSize={14}
                    checked={advancedEntrustChecked}
                    onChange={onAdvancedEntrustCheckedChange}
                    shape="square"
                    iconRender={optionRadioIconRender}
                  >
                    <div
                      className={classNames({
                        'text-brand_color': advancedEntrustChecked,
                      })}
                    >{t`features_ternary_option_trade_exhange_order_form_r_zmq8wj5k`}</div>
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
        )}
        {isOver && (
          <div className="pb-3">
            {overModeIsTable ? (
              profitRates.length > 0 &&
              targetProfitRate && (
                <ProfitRateTable profitRates={profitRates} value={targetProfitRate} onChange={onTableProfitChange} />
              )
            ) : (
              <div className="px-1 mx-3" id={isActive ? OPTION_GUIDE_ELEMENT_IDS_ENUM.amplitude : ''}>
                <div className="text-text_color_02 mb-4">{t`features_ternary_option_trade_exhange_order_form_tbcthunudb`}</div>
                <Slider
                  className="slider-wrapper"
                  showTooltip
                  min={0}
                  max={100}
                  alwaysShowTooltip={!!targetProfitRate}
                  customTooltipNode={`${profitSymbol}${targetProfitRate?.amplitude || '0'}`}
                  value={Number(diffPricePercent)}
                  onChange={onSliderChange}
                />
                <div className="font-medium mt-2">
                  <div className="flex justify-between">
                    <span>
                      {profitSymbol}
                      {low}
                    </span>
                    <span>
                      {profitSymbol}
                      {hight}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mx-3 px-1" id={isActive ? OPTION_GUIDE_ELEMENT_IDS_ENUM.priceInput : ''}>
          {(!overModeIsTable || !isOver) && false && (
            <>
              <div className="flex items-center justify-between">
                <UnderlineTip
                  className="text-text_color_02"
                  title={
                    isFusionMode
                      ? t`features_ternary_option_trade_exhange_order_form_e0gztgzxmq`
                      : t`features/assets/financial-record/record-detail/record-details-info/index-13`
                  }
                  popup={
                    isFusionMode
                      ? t`features_ternary_option_trade_exhange_order_form_79euqnrxdx`
                      : t`features_ternary_option_trade_exhange_order_form_8noqya5cbt`
                  }
                >
                  {isFusionMode
                    ? t`features_ternary_option_trade_exhange_order_form_e0gztgzxmq`
                    : t`features/assets/financial-record/record-detail/record-details-info/index-13`}
                </UnderlineTip>
                <span className={classNames('font-medium', isBuy ? 'text-buy_up_color' : 'text-sell_down_color')}>
                  {isFusionMode
                    ? formatNumberDecimalWhenExceed(targetProfitRate?.yield || 0, 4)
                    : getPercentDisplay(targetProfitRate?.yield || 0)}
                </span>
              </div>
              <div
                className={classNames('rv-hairline--bottom pt-3', {
                  'mb-3': isOver,
                  'mb-4': !isOver,
                })}
              ></div>
            </>
          )}

          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <div className="mr-2">
                <CommonAmountOptions />
              </div>
              <DomAutoScaleWrapper className="flex items-center text-right" dep={balance}>
                <span className="flex-1"></span>
                <span className="mr-0.5 text-text_color_02 whitespace-nowrap">{availableText} </span>
                <span className="break-all font-medium">{!isLogin ? replaceEmpty() : formatCurrency(balance)}</span>
              </DomAutoScaleWrapper>
              <span className="font-medium"> {currentCoin.coinSymbol}</span>
              {!isFusionMode && (
                <Icon hiddenMarginTop className="ml-0.5" name="recharge_brand" onClick={clickRecharge} />
              )}
            </div>

            <PriceInput
              onlyInput
              className="relative z-10"
              min={Number(currentCoin.minAmount)}
              digit={buyDigit}
              label={
                tradeInfo.amount
                  ? t({
                      id: 'features_ternary_option_trade_exhange_order_form__qqdsmwsdm',
                      values: { 0: currentCoin.coinSymbol },
                    })
                  : amountPlaceholder
              }
              placeholder={amountPlaceholder}
              value={tradeInfo.amount}
              inputProps={{
                clearable: true,
                focusBgClassName: '!bg-bg_color',
              }}
              max={Number(currentCoin.maxAmount)}
              ref={com => {
                inputRefs.current[TernaryOptionTradeInputNameEnum.amount] = com as any
              }}
              onChange={onAmountChange}
            />
            {
              <CouponSelect
                businessScene={ScenesBeUsedEnum.option}
                symbol={currentCoin.coinSymbol}
                onChange={e => onCouponChange(e?.coupons, e?.voucherAmount)}
                margin={tradeInfo.amount}
              />
            }
          </div>
          <div className={classNames(advancedEntrustChecked ? 'mb-3' : 'mb-4')}>
            <TradeButtonRadios
              hasGap
              bothClassName="text-xs font-medium rounded-sm px-4 border border-solid h-22"
              inactiveClassName="text-text_color_02 bg-card_bg_color_02 border-card_bg_color_02"
              activeClassName={TradeButtonRadiosPresetClassNames.active.brand}
              options={multipliersOptions}
              onChange={() => {}}
              onClickItem={onMultiplierChange}
              value={multiplier}
            />
          </div>
          {advancedEntrustChecked && <OrderFormAdvance inputRefs={inputRefs} />}
          <div
            className={classNames('-ml-4 rv-hairline--top', {
              hidden: !isTutorialMode,
            })}
          >
            <OptionTimes />
          </div>
        </div>
      </div>
      <div
        className={classNames('h-2 rv-hairline--top', {
          hidden: !isActive,
        })}
      ></div>
      {/* 拿出来是为了 sticky 效果 */}
      <div
        ref={wrapperRef}
        className={classNames(styles['sticky-wrapper'], 'bg-bg_color', {
          hidden: !isActive,
        })}
      >
        <div
          className={classNames({
            hidden: isTutorialMode,
          })}
        >
          <OptionTimes />
        </div>
        <div className="pb-2 px-3">
          <div
            className={classNames('flex px-1 pb-2', {
              'pt-1': isTutorialMode,
            })}
            id={isActive ? OPTION_GUIDE_ELEMENT_IDS_ENUM.actions : ''}
          >
            <div className="flex-1 mr-2">
              <div className="flex mb-2">
                <DomAutoScaleWrapper dep={targetProfitRate}>
                  <div className="flex">
                    <UnderlineTip
                      className="text-text_color_02"
                      title={t`features_ternary_option_position_position_cell_index_aiccjcqb7n`}
                      popup={t`features_ternary_option_trade_exhange_order_form_kjix2ed8xi`}
                    >{t`features_ternary_option_position_position_cell_index_aiccjcqb7n`}</UnderlineTip>
                    <span className="ml-1">
                      {'>'}
                      {formatCurrency(targetPrice)}
                    </span>
                  </div>
                </DomAutoScaleWrapper>
              </div>
              <div className="flex">
                {/* 不用 button 是因为内部嵌套复杂，无法使用缩放 */}
                <div
                  onClick={() => {
                    run(isOver ? TernaryOptionTradeDirectionEnum.overCall : TernaryOptionTradeDirectionEnum.call)
                  }}
                  className={classNames('sell-or-buy-button disable-shallow form-button', 'is-buy', {
                    'is-disabled': disabled,
                  })}
                >
                  {!isLogin ? (
                    <span>{t`user.field.reuse_07`}</span>
                  ) : (
                    <DomAutoScaleWrapper dep={targetProfitRate}>
                      {countDownSeconds > 0 ? (
                        <span>{countDownSecondsText}</span>
                      ) : (
                        <>
                          <span className="text-xs mr-1">{upProfitRateText}</span>
                          {getTernaryOptionTradeDirectionEnumNameInAction(
                            isOver ? TernaryOptionTradeDirectionEnum.overCall : TernaryOptionTradeDirectionEnum.call
                          )}
                        </>
                      )}
                    </DomAutoScaleWrapper>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex mb-2">
                <DomAutoScaleWrapper dep={targetProfitRate}>
                  <div className="flex">
                    <UnderlineTip
                      className="text-text_color_02"
                      title={t`features_ternary_option_position_position_cell_index_aiccjcqb7n`}
                      popup={t`features_ternary_option_trade_exhange_order_form_kjix2ed8xi`}
                    >{t`features_ternary_option_position_position_cell_index_aiccjcqb7n`}</UnderlineTip>
                    <span className="ml-1">
                      {'<'}
                      {formatCurrency(downTargetPrice)}
                    </span>
                  </div>
                </DomAutoScaleWrapper>
              </div>
              <div className="flex">
                <div
                  onClick={() => {
                    run(isOver ? TernaryOptionTradeDirectionEnum.overPut : TernaryOptionTradeDirectionEnum.put)
                  }}
                  className={classNames('sell-or-buy-button disable-shallow form-button', 'is-sell', {
                    'is-disabled': disabled,
                  })}
                >
                  {!isLogin ? (
                    <span>{t`user.field.reuse_07`}</span>
                  ) : (
                    <DomAutoScaleWrapper dep={targetProfitRate}>
                      {countDownSeconds > 0 ? (
                        <span>{countDownSecondsText}</span>
                      ) : (
                        <>
                          <span className="text-xs mr-1">{downProfitRateText}</span>
                          {getTernaryOptionTradeDirectionEnumNameInAction(
                            isOver ? TernaryOptionTradeDirectionEnum.overPut : TernaryOptionTradeDirectionEnum.put
                          )}
                        </>
                      )}
                    </DomAutoScaleWrapper>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-line_color_02 h-1"></div>
      </div>
    </>
  )
}
