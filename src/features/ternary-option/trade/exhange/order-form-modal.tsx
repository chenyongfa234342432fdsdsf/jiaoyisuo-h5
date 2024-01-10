import { useTernaryOptionStore } from '@/store/ternary-option'
import { formatTimeLabel } from '@/helper/ternary-option'
import TradeBottomModal from '@/features/trade/common/bottom-modal'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { useToggle } from 'ahooks'
import { getTernaryOptionTradeDirectionEnumNameInTag } from '@/constants/ternary-option'
import Icon from '@/components/icon'
import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { formatCurrency } from '@/helper/decimal'
import { useOptionExchangeContext } from './context'
import styles from './order-form-modal.module.css'
import { OrderForm } from './order-form'

export function OrderFormModal({ visible, onVisibleChange }) {
  const { tradeInfo, isUp, isOver } = useOptionExchangeContext()
  const { currentCoin } = useTernaryOptionStore()
  const { isTutorialMode, userCacheData, toggleOverCallIsTable, updateMyTradeActiveTabCounter } = useOptionTradeStore()
  const titleNode = (
    <div className={styles['exchange-order-modal-title-wrapper']}>
      <div className="mr-1">
        {currentCoin.symbol}
        <span> {t`assets.enum.tradeCoinType.perpetual`}</span>
      </div>
      <div className="tag text-text_color_02 bg-card_bg_color_02">{formatTimeLabel(tradeInfo.time?.period || 30)}</div>
      <div
        className={classNames('tag', {
          'bg-buy_up_color_special_02 text-buy_up_color': isUp,
          'bg-sell_down_color_special_02 text-sell_down_color': !isUp,
        })}
      >
        <span>
          {getTernaryOptionTradeDirectionEnumNameInTag(tradeInfo.direction!)}{' '}
          {isOver && formatCurrency(tradeInfo.targetProfitRate?.amplitude)}
        </span>
      </div>
    </div>
  )
  const onFinish = () => {
    onVisibleChange(false)
    updateMyTradeActiveTabCounter()
  }

  return (
    <TradeBottomModal
      titleRightExtra={
        isOver || isTutorialMode ? (
          <div id={OPTION_GUIDE_ELEMENT_IDS_ENUM.tableSwitch} onClick={toggleOverCallIsTable} className="mr-3">
            <Icon
              name={!userCacheData.overCallIsTable ? 'options_sheet' : 'options_slider'}
              className="text-xl text-icon_color"
            />
          </div>
        ) : undefined
      }
      destroyOnClose
      title={titleNode}
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <OrderForm onFinish={onFinish} overModeIsTable={userCacheData.overCallIsTable} />
    </TradeBottomModal>
  )
}
