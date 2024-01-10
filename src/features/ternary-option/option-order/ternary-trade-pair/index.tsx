import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { ActionSheet } from '@nbit/vant'
// import { useDebounceFn } from 'ahooks'
import classNames from 'classnames'
import { useState } from 'react'
import styles from './index.module.css'

type ISelectTradePairProps = {
  value: string
  onChange: (value: string) => void
  pairList: Record<'name' | 'id', string>[]
}

function SelectTradePair({ value, onChange, pairList }: ISelectTradePairProps) {
  const list = [
    {
      name: t`common.all`,
      id: '',
    },
    ...pairList,
  ]

  const [searchKey, setSearchKey] = useState<string>('')

  const [visible, setVisible] = useState<boolean>(false)

  const selectedTradePair = list.find(item => item.id === value)!

  const displayList = searchKey ? list.filter(item => item.name.includes(searchKey.toUpperCase())) : list.slice()

  const selectPair = (id: string) => {
    if (id === value) {
      return
    }
    onChange(id)
    setVisible(false)
  }

  const setCancelAfterChange = () => {
    setSearchKey('')

    setVisible(false)
  }

  return (
    <div className={styles['select-trade-pair-wrapper']}>
      <div className="selected-label" onClick={() => setVisible(true)}>
        <span className="mr-0.5 text-xs">
          {t`features_ternary_option_option_order_ternary_history_spot_select_filters_tfw06fwkhu`}
          <span>: </span>
          {selectedTradePair?.name}
        </span>
        <Icon name="regsiter_icon_drop" className="text-xs scale-75" hasTheme />
      </div>
      <ActionSheet
        visible={visible}
        cancelText={t`user.field.reuse_09`}
        className={styles['select-trade-pair-modal-wrapper']}
        onClose={setCancelAfterChange}
        onClickOverlay={setCancelAfterChange}
        onClosed={setCancelAfterChange}
        onCancel={setCancelAfterChange}
      >
        <div className="header">
          <div className="title">
            <span className="text-base text-text_color_01">{t`features_trade_common_select_trade_pair_index_510280`}</span>
            <Icon name="close" className="text-xl mt-0.5" hasTheme onClick={() => setCancelAfterChange()} />
          </div>
          {/* <div>
            <Search
              shape="round"
              formatter={e => {
                // 只能输入字母和数字
                const reg = /[A-Za-z0-9]+/g
                const values = String(e)

                if (reg.test(values) || !e) {
                  return values.replace(/[^a-zA-Z0-9]/g, '') as string
                } else {
                  return searchKey as string
                }
              }}
              placeholder={t`features_trade_contract_contract_trade_pair_index_5101506`}
              value={searchKey}
              onChange={debounceSetSearchKey}
            />
          </div> */}
        </div>
        <div className="options-wrapper">
          {displayList.map(item => (
            <div
              key={item.id}
              onClick={() => {
                selectPair(item.id)
              }}
              className={classNames('option', {
                active: item.id === value,
              })}
            >
              {item.name}
            </div>
          ))}
        </div>
      </ActionSheet>
    </div>
  )
}

export default SelectTradePair
