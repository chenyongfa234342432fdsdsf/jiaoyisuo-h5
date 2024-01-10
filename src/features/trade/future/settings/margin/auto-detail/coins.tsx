import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useCreation, useMount } from 'ahooks'
import { useState } from 'react'
import { Input, Popover } from '@nbit/vant'
import { AutoDetailType } from '@/typings/api/trade'
import { formatCurrency } from '@/helper/decimal'
import { useFutureTradeStore } from '@/store/trade/future'
import { onSetPositionOffset } from '@/helper/assets/futures'
import { getCurrencySettings } from '@/apis/assets/futures/common'
import styles from './index.module.css'

type AutoAddMarginCoinsType = {
  data?: AutoDetailType
  loading?: boolean
  onChange?: (v: string) => void
}

export function AutoAddMarginCoins({ data, onChange, loading }: AutoAddMarginCoinsType) {
  const [priceValue, setPriceValue] = useState<string>('')

  const { futureCurrencySettings, updateFutureCurrencySettings } = useFutureTradeStore()

  const onPriceChange = v => {
    /** 处理精度* */
    const offsetNum = onSetPositionOffset(v, futureCurrencySettings?.offset)
    const num = offsetNum.replace(/[^\d^\\.]+/g, '')
    setPriceValue(num)
    onChange && onChange(num)
  }

  useCreation(() => {
    !loading && setPriceValue('')
  }, [loading])

  /** 获取法币精度* */
  useMount(async () => {
    const res = await getCurrencySettings({})
    const { isOk, data: currencyData } = res || {}

    if (!isOk || !currencyData) {
      return
    }
    updateFutureCurrencySettings(currencyData)
  })

  return (
    <div className={styles['auto-add-margin-coins-wrapper']}>
      <div className="coins-wrapper-header">
        <div className="wrapper-header-left">
          <span className="text-base">{t`features_trade_future_settings_margin_auto_detail_coins_5101372`}</span>
          <Popover
            theme="dark"
            placement="bottom-start"
            offset={[-2, 2]}
            reference={<Icon name="msg" className="header-left-icon" />}
          >
            <div className="p-2 text-xs">{t`features_trade_future_settings_margin_auto_detail_coins_5101373`}</div>
          </Popover>
        </div>
        <div className="wrapper-header-right">
          {`${t({
            id: 'features_trade_future_settings_margin_auto_detail_coins_5101374',
            values: { 0: formatCurrency(data?.maxSettingAmount) },
          })} ${data?.currencySymbol || ''}`}
        </div>
      </div>
      <div className="coins-wrapper-body">
        <Input
          type="number"
          value={priceValue}
          onChange={v => onPriceChange(v)}
          placeholder={`${t`features_trade_future_settings_margin_auto_detail_coins_5101375`}(${
            data?.currencySymbol || ''
          })`}
        />
      </div>
      <div className="coins-wrapper-footer">
        <div className="wrapper-footer-text">
          {`${t`features_trade_future_settings_margin_auto_detail_coins_5101376`}(${data?.currencySymbol || ''})`}
        </div>
        <div className="wrapper-footer-price">{formatCurrency(data?.available)}</div>
      </div>
    </div>
  )
}
