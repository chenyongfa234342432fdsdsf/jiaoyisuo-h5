import NotLogin from '@/components/not-login'
import { EntrustTypeEnum } from '@/constants/trade'
import { useTradeCurrentSpotCoin } from '@/hooks/features/trade'
import { t } from '@lingui/macro'
import { Button, Popup } from '@nbit/vant'
import classNames from 'classnames'
import { getEntrustTypes } from '@/helper/trade'
import { useMount } from 'ahooks'
import { useExchangeContext } from '../../common/exchange/context'
import TradeSelect from '../../common/select'
import { MarketDetailTradeSpotAmount } from './exchange-amount'
import styles from '../../common/market-detail-trade/index.module.css'

type ITradeModalProps = {
  visible: boolean
  onClose: () => void
}
export function TradeModal({ visible, onClose }: ITradeModalProps) {
  const { tradeInfo, symbol, balance, isBuy, onEntrustTypeChange, onOrder } = useExchangeContext()
  const currentSpotCoin = useTradeCurrentSpotCoin()

  const entrustTypes = getEntrustTypes([EntrustTypeEnum.market, EntrustTypeEnum.limit]).map(item => ({
    ...item,
    text: item.name,
  }))

  useMount(() => {
    if (tradeInfo.entrustType === EntrustTypeEnum.plan) {
      onEntrustTypeChange(EntrustTypeEnum.market)
    }
  })

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
          <TradeSelect
            className="sm-text"
            value={tradeInfo.entrustType}
            onChange={onEntrustTypeChange}
            options={entrustTypes}
          />
          <span onClick={onClose} className="text-text_color_02">
            {t`assets.financial-record.cancel`}
          </span>
        </div>
        <div className="justify-between mb-2 flex items-center">
          <span className="text-text_color_02">
            {t`features_trade_spot_exchange_balance_510297`} ({symbol})
          </span>
          <span>{balance}</span>
        </div>
        <div>
          <div></div>
          <MarketDetailTradeSpotAmount />
        </div>
        <Button
          block
          className={classNames(styles['trade-button'], 'mb-5', {
            'is-buy': isBuy,
            'is-sell': !isBuy,
          })}
          onClick={onOrder}
        >
          <NotLogin className="h-full" notLoginNode={t`user.field.reuse_07`}>
            {isBuy
              ? t({
                  id: 'features_trade_spot_exchange_510220',
                  values: { 0: currentSpotCoin.baseSymbolName },
                })
              : t({
                  id: 'features_trade_spot_exchange_510221',
                  values: { 0: currentSpotCoin.baseSymbolName },
                })}
          </NotLogin>
        </Button>
      </div>
    </Popup>
  )
}
