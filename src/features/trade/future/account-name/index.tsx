import { t } from '@lingui/macro'
import { Input } from '@nbit/vant'
import classNames from 'classnames'
import { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import styles from './index.module.css'

function AccountName(_, ref) {
  const newaccountNameList = useRef([
    t`features_trade_future_account_name_index_raujgynirc`,
    t`features_trade_future_account_name_index_wtqywc8o54`,
    t`features_trade_future_account_name_index_cspu5glfml`,
    t`features_trade_future_account_name_index_ks6nwnznr2`,
    t`features_trade_future_account_name_index_egpedktwmk`,
    t`features_trade_future_account_name_index_xjuxsbbith`,
  ])

  const [accountSelectName, setAccountSelectName] = useState<string>('')

  const onNewAccountNameChange = e => {
    setAccountSelectName(e)
  }

  useImperativeHandle(ref, () => ({
    getAccountSelectName() {
      return accountSelectName
    },
  }))

  return (
    <div className={styles['newaccount-container']}>
      <div className="flex justify-between">
        <span className="text-text_color_02 text-sm">{t`features_trade_future_account_name_index_wmqxfqhzzg`}</span>
        <span className="text-brand_color text-xs">
          {t`features_trade_future_account_name_index_0kgtqzlfnn`} 20{' '}
          {t`features_trade_future_account_name_index_vlg_k04nap`}
        </span>
      </div>
      <Input
        className="newaccount-name"
        value={accountSelectName}
        onChange={onNewAccountNameChange}
        placeholder={t`features_trade_future_account_name_index_y5pm1jzkfw`}
        maxLength={20}
      />
      <div className="mb-6 flex flex-wrap justify-between">
        {newaccountNameList.current?.map(item => {
          return (
            <div
              className={classNames('newaccount-name-item', {
                'newaccount-name-item-selected': accountSelectName === item,
              })}
              key={item}
              onClick={() => setAccountSelectName(item)}
            >
              {item}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default forwardRef(AccountName)
