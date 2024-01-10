import { formatTimeLabel, isOverOptionDirection, isUpOptionDirection } from '@/helper/ternary-option'
import { t } from '@lingui/macro'
import {
  TernaryOptionTradeDirectionEnum,
  getTernaryOptionTradeDirectionEnumNameInPageCenter,
  getTernaryOptionTradeDirectionEnumNameInTag,
} from '@/constants/ternary-option'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { useEffect, useRef, useState } from 'react'
import { Toast } from '@nbit/vant'
import { useUpdateEffect } from 'ahooks'
import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { getIsLogin } from '@/helper/auth'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import { formatCurrency } from '@/helper/decimal'
import { replaceEmpty } from '@/helper/filters'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useOptionExchangeContext } from './context'
import styles from './actions.module.css'
import { OrderFormModal } from './order-form-modal'

export function OptionExchangeActions() {
  const { tradeInfo, currentCoin, balance, resetData, onDirectionChange } = useOptionExchangeContext()
  const { isTutorialMode } = useOptionTradeStore()
  const upText = t`features_ternary_option_trade_exhange_actions_lefinobwtq`
  const downText = t`features_ternary_option_trade_exhange_actions_9y_nhopgmq`
  const timeText = tradeInfo.time ? formatTimeLabel(tradeInfo.time?.period) : ''
  const directionText = tradeInfo.direction
    ? getTernaryOptionTradeDirectionEnumNameInPageCenter(tradeInfo.direction)
    : '?'
  const text = t({
    id: `features_ternary_option_trade_exhange_actions_x3k5cny8xx`,
    values: {
      0: timeText,
      1: currentCoin.tradeInfo?.baseSymbolName,
      2: directionText,
    },
  })
  const actions = [
    {
      icon: 'options_rise',
      value: TernaryOptionTradeDirectionEnum.call,
    },
    {
      icon: 'options_fall',
      value: TernaryOptionTradeDirectionEnum.put,
    },
    {
      icon: 'options_rise_over',
      value: TernaryOptionTradeDirectionEnum.overCall,
      isHot: true,
    },
    {
      icon: 'options_fall_over',
      value: TernaryOptionTradeDirectionEnum.overPut,
      isHot: true,
    },
  ]
  const [modalVisible, setModalVisible] = useState(false)
  useUpdateEffect(() => {
    if (!modalVisible) {
      resetData()
    }
  }, [modalVisible])
  const pageContent = usePageContext()
  const availableText = t({
    id: `features_ternary_option_trade_exhange_order_form_eiityuh8m2`,
    values: {
      0: currentCoin.coinSymbol,
    },
  })

  return (
    <div className={styles['actions-wrapper']}>
      <div className="text-xl px-4 font-medium text-center">{text}</div>
      <div className="p-4">
        <div id={OPTION_GUIDE_ELEMENT_IDS_ENUM.actions} className="actions p-4">
          {actions.map(item => {
            const onClick = () => {
              if (!getIsLogin()) {
                link(`/login/?redirect=${pageContent.path}`)
                return
              }
              if (!tradeInfo.time) {
                Toast(t`features_ternary_option_trade_exhange_actions_uubxtotchs`)
                return
              }
              onDirectionChange(item.value)
              setModalVisible(true)
            }
            return (
              <div key={item.value}>
                <div
                  className={classNames('action-item mb-2', {
                    'bg-buy_up_color_special_02 text-buy_up_color': isUpOptionDirection(item.value),
                    'bg-sell_down_color_special_02 text-sell_down_color': !isUpOptionDirection(item.value),
                  })}
                  onClick={onClick}
                >
                  <Icon
                    name={item.icon}
                    className={classNames('direction-icon', isOverOptionDirection(item.value) ? 'is-over' : '')}
                  />
                  {item.isHot && (
                    <div className="hot-tag">
                      <LazyImage src={`${oss_svg_image_domain_address}option_hottag.png`} className="w-8" />
                    </div>
                  )}
                  {isTutorialMode && item.value === TernaryOptionTradeDirectionEnum.call && (
                    <div className="guide-finger">
                      <LazyImage src={`${oss_svg_image_domain_address}guide_finger.png`} />
                    </div>
                  )}
                </div>
                <div className="text-center">{getTernaryOptionTradeDirectionEnumNameInTag(item.value)}</div>
              </div>
            )
          })}
        </div>
        <div className="balance-wrapper mt-2">
          <div className="mr-1 text-text_color_02 whitespace-nowrap">{availableText}:</div>
          <div className="break-all font-medium">{getIsLogin() ? formatCurrency(balance) : replaceEmpty()}</div>
        </div>
        <div className="h-4"></div>
      </div>

      {modalVisible && <OrderFormModal visible={modalVisible} onVisibleChange={setModalVisible} />}
    </div>
  )
}
