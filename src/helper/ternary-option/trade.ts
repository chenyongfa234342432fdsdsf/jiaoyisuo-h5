import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { TernaryOptionTradeInputNameEnum } from '@/constants/ternary-option'
import { IOptionExchangeBaseContext, useOptionExchangeInTop } from '@/features/ternary-option/trade/exhange/context'
import { baseTernaryOptionStore } from '@/store/ternary-option'
import { ITernaryOptionCreateOrderParams, ITernaryOptionCreatePlanOrderParams } from '@/typings/api/ternary-option'
import { t } from '@lingui/macro'
import { Toast } from '@nbit/vant'
import introStyles from '@/components/intro-js/intro-steps/index.module.css'
import { Step } from 'intro.js-react'
import classNames from 'classnames'

/** 获取期权交易参数 */
export function getOptionCreateOrderParams(tradeInfo: IOptionExchangeBaseContext, couponsRef: any) {
  const currentCoin = baseTernaryOptionStore.getState().currentCoin
  const normalParams: ITernaryOptionCreateOrderParams = {
    optionId: currentCoin.id as any,
    periodId: tradeInfo.time?.id || 0,
    yieldId: tradeInfo.targetProfitRate?.id || 0,
    sideInd: tradeInfo.direction!,
    amount: Number(tradeInfo.amount),
    coupons: couponsRef.current.coupons,
    voucherAmount: couponsRef.current.amount,
  }

  const planParams: ITernaryOptionCreatePlanOrderParams = {
    ...normalParams,
    cycles: Number(tradeInfo.maxTriggerTimes),
    maxAmount: Number(tradeInfo.maxAmount),
    isSmart: tradeInfo.isSmartDouble ? 1 : 2,
    // 这里 coupons 不兼容会报错，所以使用 any
  } as any

  return {
    normalParams,
    planParams,
  }
}
/** 校验三元期权下单参数 */
export function validateOptionCreateOrderParams(
  tradeInfo: IOptionExchangeBaseContext,
  context: ReturnType<typeof useOptionExchangeInTop>
) {
  const { advancedEntrustChecked, maxAmount, maxTriggerTimes, amount } = tradeInfo
  const currentCoin = baseTernaryOptionStore.getState().currentCoin
  const { balance } = context
  if (!amount) {
    Toast(t`helper_ternary_option_trade_8ztcb1sfwr`)
    return TernaryOptionTradeInputNameEnum.amount
  }
  if (Number(amount) > balance) {
    Toast(t`helper_ternary_option_trade_p5fs8qzkll`)
    return false
  }
  if (Number(amount) > Number(currentCoin.maxAmount)) {
    Toast(
      t({
        id: `helper_ternary_option_trade_24qbvziqsa`,
        values: {
          0: currentCoin.maxAmount,
        },
      })
    )
    return false
  }
  if (Number(amount) < Number(currentCoin.minAmount)) {
    Toast(
      t({
        id: `helper_ternary_option_trade_c9rrurifh4`,
        values: {
          0: currentCoin.minAmount,
        },
      })
    )
    return false
  }
  if (advancedEntrustChecked) {
    if (!maxTriggerTimes) {
      Toast(t`helper_ternary_option_trade_i3sgtlooe8`)
      return TernaryOptionTradeInputNameEnum.maxTriggerTimes
    }
    if (!maxAmount) {
      Toast(t`helper_ternary_option_trade_skfjxe98ia`)
      return TernaryOptionTradeInputNameEnum.maxAmount
    }
    if (Number(maxAmount) < Number(amount)) {
      Toast(t`helper_ternary_option_trade_hpp5naijci`)
      return false
    }
  }
  return true
}
type IGetGuideStepsParams = {
  isTutorialMode?: boolean
  isOverMode?: boolean
  withAdvanceSteps?: boolean
  onlyAdvanceSteps?: boolean
  onRenderIntro: (title: string, content: string, className?: string, width?: number) => JSX.Element
  styles: { [key: string]: string }
}
export function getGuideSteps({
  onRenderIntro,
  isTutorialMode,
  isOverMode,
  withAdvanceSteps,
  onlyAdvanceSteps,
  styles,
}: IGetGuideStepsParams) {
  const leftCommonStyles = classNames(introStyles['intro-tooltip'], styles['intro-tooltip-left-align'])
  const advanceSteps: Step[] = [
    {
      element: `#${OPTION_GUIDE_ELEMENT_IDS_ENUM.advance}`,
      intro: onRenderIntro(
        t`features_ternary_option_trade_exhange_order_form_r_zmq8wj5k`,
        t`helper_ternary_option_trade_hjsuop9alc`,
        '',
        204
      ),
      position: 'bottom',
      tooltipClass: introStyles['intro-tooltip'],
    },
    {
      element: `#${OPTION_GUIDE_ELEMENT_IDS_ENUM.maxTriggerTimes}`,
      intro: onRenderIntro(
        t`features_ternary_option_option_order_ternary_order_item_index_0zxr95sizg`,
        t`features_ternary_option_trade_exhange_order_form_advance_yilqebh9ri`,
        '',
        262
      ),
      position: 'top',
      tooltipClass: leftCommonStyles,
    },
    {
      element: `#${OPTION_GUIDE_ELEMENT_IDS_ENUM.maxAmount}`,
      intro: onRenderIntro(
        t`features_ternary_option_option_order_ternary_order_item_index_xilxi3n1bc`,
        t`features_ternary_option_trade_exhange_order_form_advance_xreygvjqdc`,
        '',
        262
      ),
      position: 'top',
      tooltipClass: leftCommonStyles,
    },
    {
      element: `#${OPTION_GUIDE_ELEMENT_IDS_ENUM.smartDouble}`,
      intro: onRenderIntro(
        t`features_ternary_option_option_order_ternary_order_item_index_mc2tmv6njx`,
        t`features_ternary_option_trade_exhange_order_form_advance_rbucogg2e8`,
        '',
        262
      ),
      position: 'top',
      tooltipClass: leftCommonStyles,
    },
  ]
  const commonSteps: Step[] = [
    {
      element: `#${OPTION_GUIDE_ELEMENT_IDS_ENUM.priceInput}`,
      intro: onRenderIntro(
        t`helper_ternary_option_trade_4mylpbhc6m`,
        t`helper_ternary_option_trade_pwalcobnk8`,
        '',
        200
      ),
      position: 'top-left-aligned',
      tooltipClass: leftCommonStyles,
    },
    {
      element: `#${OPTION_GUIDE_ELEMENT_IDS_ENUM.actions}`,
      intro: onRenderIntro(t`helper_ternary_option_trade_5v9tbhzydi`, t`helper_ternary_option_trade_q9yltkgke8`),
      position: 'top',
      tooltipClass: classNames(introStyles['intro-tooltip'], styles['intro-tooltip-actions']),
    },
  ]
  const normalSteps: Step[] = [
    {
      element: `.${OPTION_GUIDE_ELEMENT_IDS_ENUM.binaryTab}`,
      intro: onRenderIntro(t`features_trade_future_c2c_22222225101605`, t`helper_ternary_option_trade_b9kujroiug`),
      position: 'bottom',
      tooltipClass: leftCommonStyles,
    },
    ...commonSteps,
  ]
  const ternarySteps: Step[] = [
    {
      element: `.${OPTION_GUIDE_ELEMENT_IDS_ENUM.ternaryTab}`,
      intro: onRenderIntro(t`features_trade_future_c2c_22222225101605`, t`helper_ternary_option_trade_7ybk5lys1b`),
      position: 'bottom',
      tooltipClass: leftCommonStyles,
    },
    {
      element: `#${OPTION_GUIDE_ELEMENT_IDS_ENUM.amplitude}`,
      intro: onRenderIntro(t`helper_ternary_option_trade_27n7niuczi`, t`helper_ternary_option_trade_4wrvn8a2fk`),
      position: 'bottom',
      tooltipClass: leftCommonStyles,
    },
    ...commonSteps,
  ]
  if (onlyAdvanceSteps && withAdvanceSteps) {
    return advanceSteps
  }
  const steps: Step[] = (isOverMode ? ternarySteps : isTutorialMode ? normalSteps : []).filter(a => a)
  if (!isOverMode && withAdvanceSteps) {
    steps.push(...advanceSteps)
  }

  return steps
}
