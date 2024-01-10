import { useEffect, Dispatch, SetStateAction } from 'react'
import { useSafeState } from 'ahooks'
import { SelectActionSheet } from '@/components/select-action-sheet'
import { t } from '@lingui/macro'
import { OrderBookButtonTypeEnum } from '@/store/order-book/common'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

export type OrderBookFooterProps = {
  mergeDepth: string
  depthOffset: Array<string>
  onHandicapModeChange: (value: OrderBookButtonTypeEnum) => void
  onMergeDepth: Dispatch<SetStateAction<string>>
}

function OrderBookFooter({ mergeDepth, depthOffset, onHandicapModeChange, onMergeDepth }: OrderBookFooterProps) {
  const [orderBookType, setOrderBookType] = useSafeState(OrderBookButtonTypeEnum.primary)

  const { personalCenterSettings } = useUserStore()
  const isGreenUpRedDown = personalCenterSettings?.colors === UserUpsAndDownsColorEnum.greenUpRedDown

  const handicapModeOptions = [
    {
      key: 1,
      name: t`assets.withdraw.form.count.withdraw-all`,
      value: OrderBookButtonTypeEnum.primary,
    },
    {
      key: 2,
      name: t`features_order_book_trade_footer_index_510297`,
      value: OrderBookButtonTypeEnum.sell,
    },
    {
      key: 3,
      name: t`features_order_book_trade_footer_index_510298`,
      value: OrderBookButtonTypeEnum.buy,
    },
  ]

  const mergeDepthOptions = [...depthOffset].reverse().map(v => {
    return { name: v, value: v }
  })

  useEffect(() => {
    onHandicapModeChange(orderBookType)
  }, [orderBookType])

  return (
    <div className={`order-book-header ${styles.scoped}`}>
      <div className="handicap-btn">
        <div className="tick-btn">
          <SelectActionSheet
            value={mergeDepth}
            actions={mergeDepthOptions}
            onChange={onMergeDepth}
            customHeaderClassName={styles['order-book-select-header']}
            desc={
              <div className={styles['order-book-select-tips']}>
                <Icon name="msg" />
                <p>{t`features_order_book_trade_footer_index_5101101`}</p>
              </div>
            }
          />
        </div>
        <div className="icon-btn">
          <SelectActionSheet
            value={orderBookType}
            actions={handicapModeOptions}
            onChange={setOrderBookType}
            triggerElement={
              orderBookType === OrderBookButtonTypeEnum.primary ? (
                <Icon name={isGreenUpRedDown ? 'buy_and_sell_orders' : 'sell_and_buy_orders'} hasTheme />
              ) : orderBookType === OrderBookButtonTypeEnum.buy ? (
                <Icon name={isGreenUpRedDown ? 'buy' : 'sell'} hasTheme />
              ) : (
                <Icon name={isGreenUpRedDown ? 'sell' : 'buy'} hasTheme />
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

export default OrderBookFooter
