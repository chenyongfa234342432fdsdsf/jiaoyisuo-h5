import { EntrustTypeEnum } from '@/constants/trade'
import { useTradeCurrentFutureCoin } from '@/hooks/features/trade'
import { t } from '@lingui/macro'
import { Button, Popup } from '@nbit/vant'
import classNames from 'classnames'
import { getEntrustTypes } from '@/helper/trade'
import { useMount } from 'ahooks'
import { formatCurrency } from '@/helper/decimal'
import { useScaleDom } from '@/hooks/use-scale-dom'
import { useExchangeContext } from '../../common/exchange/context'
import TradeSelect from '../../common/select'
import { MarketDetailTradeFutureAmount } from './exchange-amount'
import styles from '../../common/market-detail-trade/index.module.css'
import { FutureGroupSelect, FutureLever } from '../header'
import { FutureActionButton } from '../exchange-action-button'

type ITradeModalProps = {
  visible: boolean
  onClose: () => void
}
export function TradeModal({ visible, onClose }: ITradeModalProps) {
  const { tradeInfo, balance, isBuy, buyDigit, onEntrustTypeChange, onOrder } = useExchangeContext()
  const currentFutureCoin = useTradeCurrentFutureCoin()

  const entrustTypes = getEntrustTypes([EntrustTypeEnum.market, EntrustTypeEnum.limit]).map(item => ({
    ...item,
    text: item.name,
  }))

  useMount(() => {
    if (tradeInfo.entrustType === EntrustTypeEnum.plan) {
      onEntrustTypeChange(EntrustTypeEnum.market)
    }
  })

  const scaleDomRef = useScaleDom(240, balance, 0.6)

  return (
    <Popup
      overlay={false}
      visible={visible}
      onClickOverlay={onClose}
      position="bottom"
      className={classNames(styles['trade-modal-wrapper-popup'])}
    >
      <div className={styles['trade-modal-wrapper']}>
        <div className="header">
          <div className="flex items-center">
            <div className="group-select mr-2 whitespace-nowrap">
              <FutureGroupSelect groupNameAutoScale={false} />
            </div>
            <FutureLever />
          </div>
          <span onClick={onClose} className="text-text_color_02">
            {t`assets.financial-record.cancel`}
          </span>
        </div>
        <div className="justify-between mb-2 flex items-center">
          <div className="h-8 flex items-center justify-center rounded bg-bg_sr_color">
            <TradeSelect
              className="w-28 sm-text"
              value={tradeInfo.entrustType}
              onChange={onEntrustTypeChange}
              options={entrustTypes}
            />
          </div>
          <div className="flex">
            <span className="text-text_color_02 mr-2">
              {t`features_trade_spot_exchange_balance_510297`} ({currentFutureCoin.quoteSymbolName})
            </span>
            <div className="balance-number-value overflow-ellipsis" ref={scaleDomRef}>
              {formatCurrency(balance, buyDigit)}
            </div>
          </div>
        </div>
        <div>
          <div></div>
          <MarketDetailTradeFutureAmount />
        </div>
        <Button
          block
          className={classNames(styles['trade-button'], 'mb-5', {
            'is-buy': isBuy,
            'is-sell': !isBuy,
          })}
          onClick={onOrder}
        >
          <FutureActionButton />
        </Button>
      </div>
    </Popup>
  )
}
