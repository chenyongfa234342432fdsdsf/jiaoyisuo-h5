import cn from 'classnames'
import { useState } from 'react'
import { Card, Button, Dialog } from '@nbit/vant'
import { useTradeStore } from '@/store/trade'
import { MarginModeEnum, LayoutEnum, TradeModeEnum } from '@/constants/trade'
import Select from '@/components/select'
import OrderBook from '@/features/order-book/trade'
import Header from '@/features/trade/header'
import MyTrade from '@/features/trade/future/my-trade'
import Exchange from '@/features/trade/common/exchange'
import { t } from '@lingui/macro'
import { KLineChartType } from '@nbit/chart-utils'
import styles from './index.module.css'

export default LeverageTrade

function LeverageTrade() {
  const layout = LayoutEnum.left

  const [marginType, setMarginType] = useState({
    value: MarginModeEnum.cross,
  })
  const limitedList = [
    { text: t`constants_order_746`, value: MarginModeEnum.cross, help: '3x' },
    { text: t`constants_order_745`, value: MarginModeEnum.isolated, help: '10x' },
  ]
  const onBorrow = () => {
    Dialog.alert({
      confirmButtonText: t`features_trade_leveraged_leveraged_trade_index_5101278`,
      theme: 'round-button',
      showCancelButton: true,
      message: <div> {t`features_trade_leveraged_leveraged_trade_index_5101279`}</div>,
    })
  }
  const onPreviewRisk = () => {
    Dialog.alert({
      theme: 'round-button',
      message: (
        <div>
          {' '}
          {t`features_trade_leveraged_leveraged_trade_index_5101280`} 1.02{' '}
          {t`features_trade_leveraged_leveraged_trade_index_5101281`}
        </div>
      ),
    })
  }

  const handleSelectPrice = () => []

  return (
    <div className={cn(styles.scoped, 'my-4')}>
      <Header type={KLineChartType.Quote} />

      <Card>
        <div className="flex items-center justify-between mb-8 leverage">
          <div className="flex items-center justify-between w-48 left">
            <div className="w-32">
              <Select
                value={marginType}
                onChange={v => {
                  setMarginType(v)
                }}
                options={limitedList}
              >
                <Select.Item titleClass="order-type-item" name="value" options={limitedList} />
              </Select>
            </div>
            <Button type="default" size="small" onClick={onBorrow}>
              {t`features_trade_leveraged_leveraged_trade_index_5101282`}
            </Button>
          </div>
          <div className="right" onClick={onPreviewRisk}>
            <div>{t`features_trade_leveraged_leveraged_trade_index_5101283`} </div>
            <div className="text-buy_up_color">999.00</div>
          </div>
        </div>
        <div className={cn('content flex justify-between', layout)}>
          <Exchange />
          <OrderBook onSelectPrice={handleSelectPrice} tradeMode={TradeModeEnum.spot} />
        </div>
        <MyTrade />
      </Card>
    </div>
  )
}
