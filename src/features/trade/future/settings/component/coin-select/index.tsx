import { useState, useEffect } from 'react'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import styles from './index.module.css'

type CoinSelectType = {
  onChange?: (v) => void
  data?: string
}

const CoinSelect = (props: CoinSelectType) => {
  const { onChange, data } = props

  const [coinId, setCoinId] = useState<string>('no')

  const CoinSelectList = [
    // {
    //   id: 'yes',
    //   title: `等比扣款`,
    //   content: `按照选定的保证金价值等份进行扣款`,
    // },
    {
      id: 'no',
      title: t`features_trade_future_settings_component_coin_select_index_5101382`,
      content: t`features_trade_future_settings_component_coin_select_index_5101383`,
    },
  ]

  const onCoinChange = v => {
    setCoinId(v.id)
    onChange && onChange(v)
  }

  useEffect(() => {
    data && setCoinId(data)
  }, [data])

  return (
    <div className={styles.scoped}>
      {CoinSelectList.map(v => {
        return (
          <div
            key={v.id}
            onClick={() => onCoinChange(v)}
            className={`coin-select-wrap ${coinId === v.id ? 'select-wrap' : ''}`}
          >
            {coinId === v.id ? <Icon name="contract_select" className="select-wrap-icon" /> : null}
            <div className={`select-wrap-title ${coinId === v.id ? 'select-title' : ''}`}>{v.title}</div>
            <div className={`select-wrap-content ${coinId === v.id ? 'select-content' : ''}`}>{v.content}</div>
          </div>
        )
      })}
    </div>
  )
}
export default CoinSelect
