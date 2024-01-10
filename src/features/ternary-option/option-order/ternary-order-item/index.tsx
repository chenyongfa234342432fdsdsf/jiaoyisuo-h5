import Icon from '@/components/icon'
import { formatDate } from '@/helper/date'
// import { formatCurrency } from '@/helper/decimal'
// import { envIsServer } from '@/helper/env'
import { replaceEmpty } from '@/helper/filters'
// import { requestWithLoading } from '@/helper/order'
// import { getOrderValueEnumText } from '@/helper/order/future'
// import { useScaleDom } from '@/hooks/use-scale-dom'
import { getFuturesGroupTypeName } from '@/constants/assets/futures'
import { t } from '@lingui/macro'
import { Switch, Toast, Dialog } from '@nbit/vant'
import { setOptionOrdersPlanOperate } from '@/apis/ternary-option/order'
import classNames from 'classnames'
import React, { useState } from 'react'
import { useUpdateEffect } from 'ahooks'
// import { useContractComputedPrice, getCoinPrecisionChangePrice } from '@/hooks/features/contract-computed-price'
import { decimalUtils } from '@nbit/utils'
import { YapiGetV1OptionOrdersHistoryListData } from '@/typings/yapi/OptionOrdersHistoryV1GetApi'
import { YapiGetV1OptionPlanOrdersCurrentListData } from '@/typings/yapi/OptionPlanOrdersCurrentV1GetApi'
import { getOptionProductPeriodUnit } from '@/constants/ternary-option'
import { useCommonStore } from '@/store/common'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { isUpOptionDirection } from '@/helper/ternary-option'
import { useSideInd, getJudgeShowColor, Intelligent, getTimesUnit } from '../ternaryorder'
import styles from './index.module.css'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

type PlanOpenOrderItem = {
  order: YapiGetV1OptionPlanOrdersCurrentListData
  sideInd: { [key: string]: string }
  sideIndColor: { [key: string]: string }
}

export function TernaryPlanOrderItem({ order, sideInd, sideIndColor }: PlanOpenOrderItem) {
  const [orderSwitch, setOrderSwitch] = useState<boolean>(order?.statusCd === 'activated')

  const [orderSwitchLoding, setOrderSwitchLoding] = useState<boolean>(false)

  const setDeleteOrderChange = async () => {
    const { isOk } = await setOptionOrdersPlanOperate({ action: 'cancel', id: order?.id })
    if (isOk) {
      Toast.info(t`features_agent_agent_manage_index_5101554`)
    }
  }

  const setOrderSwitchChange = async e => {
    setOrderSwitchLoding(true)
    const { isOk } = await setOptionOrdersPlanOperate({ action: e ? 'start' : 'close', id: order?.id })
    if (isOk) {
      setOrderSwitch(e)
      Toast.info(t`features_user_personal_center_account_security_google_verification_index_510233`)
    }
    setOrderSwitchLoding(false)
  }

  useUpdateEffect(() => {
    setOrderSwitch(order?.statusCd === 'activated')
  }, [order?.statusCd])

  return (
    <div className={classNames(styles['open-order-item-wrapper'], 'border-b-4 border-line_color_02')}>
      <div className="flex justify-between mt-3">
        <div className="text-text_color_01 text-base">
          <span className="font-medium">
            {order?.symbol} {replaceEmpty(getFuturesGroupTypeName(order?.typeInd))}
          </span>
          {/* <span className="text-text_color_02 bg-card_bg_color_02 px-1 py-0.5 text-xs ml-2 rounded-sm">
            {replaceEmpty(order?.periodDisplay)}
            {replaceEmpty(timeUnit[order?.periodUnit])}
          </span> */}
          <span
            className={classNames('px-1 py-0.5 text-xs ml-2 rounded-sm', {
              'text-buy_up_color bg-buy_up_color_special_02': sideIndColor[order?.sideInd] === 'up',
              'text-sell_down_color bg-sell_down_color_special_02': sideIndColor[order?.sideInd] === 'down',
            })}
          >
            {replaceEmpty(sideInd[order?.sideInd])}
            {order?.amplitude !== 0 ? order?.amplitude : ''}
          </span>
          {order?.isSmart === Intelligent.IntelligentDoubling && (
            <span className="px-1 py-0.5 text-xs ml-2 rounded-sm text-brand_color bg-brand_color_special_02">
              {t`features_ternary_option_option_order_ternary_order_item_index_mc2tmv6njx`}
            </span>
          )}
        </div>
        <div onClick={setDeleteOrderChange}>
          <Icon name="delete" className="text-xl" hasTheme />
        </div>
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-text_color_02 text-sm">{t`assets.financial-record.creationTime`}</span>
        <span className="text-text_color_01 text-sm">{replaceEmpty(formatDate(order?.createdByTime))}</span>
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-text_color_02 text-sm">{t`features_ternary_option_option_order_ternary_order_item_index_v_orp_rzdo`}</span>
        <span className="text-text_color_01 text-sm">
          {replaceEmpty(order?.periodDisplay)} {replaceEmpty(getTimesUnit(order?.periodUnit))}
        </span>
      </div>
      {!(order?.isSmart === Intelligent.IntelligentDoubling) && (
        <div className="flex justify-between mt-3">
          <span className="text-text_color_02 text-sm">
            {t`features_ternary_option_option_order_ternary_order_item_index_zb5gsirjqk`} (
            {replaceEmpty(order?.coinSymbol)})
          </span>
          <span className="text-text_color_01 text-sm">{replaceEmpty(order?.amount)}</span>
        </div>
      )}
      {order?.isSmart === Intelligent.IntelligentDoubling && (
        <>
          <div className="flex justify-between mt-3">
            <span className="text-text_color_02 text-sm">
              {t`features_ternary_option_option_order_ternary_order_item_index_cjqpzko5_h`} (
              {replaceEmpty(order?.coinSymbol)})
            </span>
            <span className="text-text_color_01 text-sm">{replaceEmpty(order?.amount)}</span>
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-text_color_02 text-sm">
              {t`features_ternary_option_option_order_ternary_order_item_index_19vsfgqfxw`} (
              {replaceEmpty(order?.coinSymbol)})
            </span>
            <span className="text-text_color_01 text-sm">{replaceEmpty(order?.lastPlaceAmount)}</span>
          </div>
        </>
      )}
      <div className="flex justify-between mt-3">
        <span className="text-text_color_02 text-sm">{t`features_ternary_option_option_order_ternary_order_item_index_0zxr95sizg`}</span>
        <span className="text-text_color_01 text-sm">{replaceEmpty(order?.cycles)}</span>
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-text_color_02 text-sm">{t`features_ternary_option_option_order_ternary_order_item_index_odx_ohs6nq`}</span>
        <span className="text-text_color_01 text-sm">{replaceEmpty(order?.triggeredCount)}</span>
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-text_color_02 text-sm">
          {t`features_ternary_option_option_order_ternary_order_item_index_xilxi3n1bc`} (
          {replaceEmpty(order?.coinSymbol)})
        </span>
        <span className="text-text_color_01 text-sm">{replaceEmpty(order?.maxAmount)}</span>
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-text_color_02 text-sm">{t`features_ternary_option_option_order_ternary_order_item_index_unyhbcdzhm`}</span>
        <span className="text-text_color_01 text-sm">{replaceEmpty(formatDate(order?.lastTriggerTime))}</span>
      </div>
      <div
        className={classNames('ternary-switch flex justify-between items-center mt-3', {
          'ternary-switch-selected': orderSwitch,
        })}
      >
        <span className="text-text_color_02 text-sm">{t`features_ternary_option_option_order_ternary_order_item_index_aalk4rfsgw`}</span>
        <Switch className="text-sm" loading={orderSwitchLoding} checked={orderSwitch} onChange={setOrderSwitchChange} />
      </div>
    </div>
  )
}

type HistoryOpenOrderItem = {
  order: YapiGetV1OptionOrdersHistoryListData
  sideInd: { [key: string]: string }
  sideIndColor: { [key: string]: string }
}

export function TernaryOpenOrderItem({ order, sideInd, sideIndColor }: HistoryOpenOrderItem) {
  const { isFusionMode } = useCommonStore()

  const [showOpenOrderAll, setShowOpenOrderItemAll] = useState<boolean>(false)

  const setOpenExperienceGoldModal = orders => {
    Dialog.alert({
      closeable: false,
      className: styles['ternary-experience-gold-modal'],
      message: (
        <div>
          <div className="ternary-experience-header">{t`features_ternary_option_option_order_ternary_order_item_index_oyozmhztxn`}</div>
          <div className="ternary-experience-content">
            {t`features_ternary_option_option_order_ternary_order_item_index_gohxqjlke1`}
            {orders?.amount} {order?.coinSymbol}(
            {t`features_ternary_option_option_order_ternary_order_item_index_xsw6vtgyvw`}
            {orders?.voucherAmount} {orders?.coinSymbol})
          </div>
        </div>
      ),
      confirmButtonText: t`features_trade_common_notification_index_5101066`,
    })
  }

  return (
    <div className={classNames(styles['open-order-item-wrapper'], 'rv-hairline--bottom')}>
      <div className="flex justify-between mt-3 items-center">
        <div className="text-text_color_01 text-sm flex items-center">
          <span className="text-base font-medium">
            {replaceEmpty(order?.symbol)} {replaceEmpty(getFuturesGroupTypeName(order?.typeInd))}
          </span>
          <span
            className={classNames('px-1 py-0.5 text-xs ml-2 rounded-sm', {
              'text-buy_up_color bg-buy_up_color_special_02': sideIndColor[order?.sideInd] === 'up',
              'text-sell_down_color bg-sell_down_color_special_02': sideIndColor[order?.sideInd] === 'down',
            })}
          >
            {replaceEmpty(sideInd[order?.sideInd])}
            {order?.amplitude !== 0 ? order?.amplitude : ''}
          </span>
        </div>

        <div className="fold-icon">
          {order?.statusCd === 'revoke' && (
            <div className="text-text_color_03 text-xs  px-1 py-0.5">{t`features_ternary_option_option_order_ternary_order_item_index_bas98op92b`}</div>
          )}
          <Icon
            name={!showOpenOrderAll ? 'asset_view_coin_unfold' : 'asset_view_coin_fold'}
            hasTheme
            onClick={() => setShowOpenOrderItemAll(!showOpenOrderAll)}
          />
        </div>
      </div>
      {/* <div className="flex justify-between mt-4">
        <div>
          <div className="text-text_color_02 text-xs">
            {t`features_ternary_option_option_order_ternary_order_item_index_cb0timpsgg`} ({replaceEmpty(order?.symbol)}
            )
          </div>
          <div
            className={classNames('text-xl mt-0.5 font-medium', {
              'text-buy_up_color': getJudgeShowColor(order?.realizedProfit) === 'up',
              'text-sell_down_color': getJudgeShowColor(order?.realizedProfit) === 'down',
              'text-text_color_01': getJudgeShowColor(order?.realizedProfit) === 'zero',
            })}
          >
            {replaceEmpty(Number(order?.realizedProfit) > 0 ? `+${order?.realizedProfit}` : order?.realizedProfit)}
          </div>
        </div>
      </div> */}

      <div className="flex justify-between mt-2">
        <div className="text-text_color_02 text-sm">
          {replaceEmpty(order?.periodDisplay)}
          {replaceEmpty(getOptionProductPeriodUnit(order?.periodUnit))}({' '}
          {replaceEmpty(
            `${
              isFusionMode
                ? t`features_ternary_option_trade_exhange_order_form_e0gztgzxmq`
                : t`features/assets/financial-record/record-detail/record-details-info/index-13`
            }${
              Number(order?.realYield) > 0
                ? `${isFusionMode ? '' : '+'}${formatNumberDecimalWhenExceed(
                    SafeCalcUtil.mul(SafeCalcUtil.add(order?.realYield, isFusionMode ? 1 : 0), isFusionMode ? 1 : 100),
                    isFusionMode ? 4 : 2
                  )}`
                : formatNumberDecimalWhenExceed(
                    SafeCalcUtil.mul(
                      SafeCalcUtil.add(
                        isFusionMode ? Math.abs(Number(order?.odds)) : order?.realYield,
                        isFusionMode ? 1 : 0
                      ),
                      isFusionMode ? 1 : 100
                    ),
                    isFusionMode ? 4 : 2
                  )
            }${isFusionMode ? '' : '%'}`
          )}
          )
        </div>
        <div
          className={classNames('text-base mt-0.5 font-medium', {
            'text-buy_up_color': getJudgeShowColor(order?.realizedProfit) === 'up',
            'text-sell_down_color': getJudgeShowColor(order?.realizedProfit) === 'down',
            'text-text_color_01': getJudgeShowColor(order?.realizedProfit) === 'zero',
          })}
        >
          {replaceEmpty(Number(order?.realizedProfit) > 0 ? `+${order?.realizedProfit}` : order?.realizedProfit)}
        </div>
      </div>

      {showOpenOrderAll && (
        <>
          <div className="flex justify-between mt-3">
            <div className="text-text_color_02 text-sm">{t`features_future_computer_common_input_control_5oauty3eqs1fnkjg39jo1`}</div>
            <div className="text-text_color_01 text-sm mt-0.5 break-words font-medium">
              {replaceEmpty(order?.openPrice)} {replaceEmpty(order?.quoteCoinShortName)}
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-text_color_02 text-sm">{t`features_ternary_option_option_order_ternary_order_item_index_rhzjrd5c6v`}</div>
            <div className="text-text_color_01 text-sm mt-0.5 break-words font-medium">
              {replaceEmpty(order?.settlementPrice)} {replaceEmpty(order?.quoteCoinShortName)}
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-text_color_02 text-sm text-right">{t`features_ternary_option_option_order_ternary_order_item_index_uk4bfryleq`}</div>
            <div className="mt-0.5 text-sm text-right font-medium">
              {isUpOptionDirection(order?.sideInd as any) ? '>' : '<'}
              {replaceEmpty(order?.targetPrice)} {replaceEmpty(order?.quoteCoinShortName)}
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-text_color_02 text-sm text-right">
              <span className="mr-1">
                {t`features_ternary_option_option_order_ternary_order_item_index_oyozmhztxn`}
              </span>
              {order?.voucherAmount && (
                <span onClick={() => setOpenExperienceGoldModal(order)}>
                  <Icon name="msg" hasTheme className="w-3" />
                </span>
              )}
            </div>
            <div className="mt-0.5 text-righ text-sm text-right font-medium">
              {replaceEmpty(order?.amount)} {replaceEmpty(order?.coinSymbol)}
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-text_color_02 text-sm">{t`features_assets_futures_futures_position_history_cell_index_3cpd00tlhn`}</div>
            <div className="text-text_color_01 text-sm mt-0.5 font-medium">
              {replaceEmpty(formatDate(order?.createdByTime))}
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <div className="text-text_color_02 text-sm">{t`features_ternary_option_option_order_ternary_order_item_index_5m9_o0qhxe`}</div>
            <div className="text-text_color_01 text-sm font-medium">
              {replaceEmpty(formatDate(order?.settlementTime))}
            </div>
          </div>
        </>
      )}

      {/* <div className="flex justify-between mt-2">
        <div className="text-text_color_02 text-xs text-right">{t`features_ternary_option_option_order_ternary_order_item_index_v_orp_rzdo`}</div>
        <div className="mt-0.5 text-right text-sm font-medium">
          {replaceEmpty(order?.periodDisplay)}
          {replaceEmpty(getOptionProductPeriodUnit(order?.periodUnit))}
        </div>
      </div> */}
    </div>
  )
}

type TernaryOrder = {
  order: YapiGetV1OptionOrdersHistoryListData | YapiGetV1OptionPlanOrdersCurrentListData
  listType: string
}

export function TernaryOpenItem({ order, listType }: TernaryOrder) {
  // @ts-ignore
  const spotPlanOpenOrderObj = listType === 'history' ? <TernaryOpenOrderItem /> : <TernaryPlanOrderItem />

  const { sideInd, sideIndColor } = useSideInd()

  return React.cloneElement(spotPlanOpenOrderObj, {
    order,
    sideInd,
    sideIndColor,
  })
}
