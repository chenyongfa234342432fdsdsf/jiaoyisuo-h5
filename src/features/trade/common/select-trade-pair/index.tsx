import CommonListEmpty from '@/components/common-list/list-empty'
import Icon from '@/components/icon'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { t } from '@lingui/macro'
import { ActionSheet, Search } from '@nbit/vant'
import { useDebounceFn, useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import { useState } from 'react'
import styles from './index.module.css'

type ISelectTradePairProps = {
  value: any
  onChange: (value: any) => void
  showSelectTradePairValue?: boolean
}

function SelectTradePair({ value, onChange, showSelectTradePairValue = true }: ISelectTradePairProps) {
  const { pairList } = useBaseOrderSpotStore()
  const list = [
    {
      name: t`common.all`,
      id: '' as any,
    },
    ...pairList,
  ]

  const [searchKey, setSearchKey] = useState('')
  const { run: debounceSetSearchKey } = useDebounceFn(setSearchKey, {
    wait: 300,
  })
  const [visible, setVisible] = useState(false)
  const selectedTradePair = list.find(item => item.id === value)!
  const displayList = searchKey ? list.filter(item => item.name.includes(searchKey.toUpperCase())) : list.slice()

  const selectPair = (id: any) => {
    if (id === value) {
      return
    }
    onChange(id)
    setVisible(false)
  }
  useUpdateEffect(() => {
    if (visible) {
      setSearchKey('')
    }
  }, [visible])

  return (
    <div className={styles['select-trade-pair-wrapper']}>
      <div className="selected-label" onClick={() => setVisible(true)}>
        <span className="mr-0.5">
          {t`features_trade_common_select_trade_pair_index_510279`}
          {showSelectTradePairValue && `:${selectedTradePair.name}`}
        </span>
        <Icon name="icon_trade_drop" className="text-xs scale-75 translate-y-px mt-0.5" hasTheme />
      </div>
      <ActionSheet visible={visible} cancelText={t`user.field.reuse_09`} onCancel={() => setVisible(false)}>
        <div className={styles['select-trade-pair-modal-wrapper']}>
          <div className="title">{t`features_trade_common_select_trade_pair_index_510280`}</div>
          <div className="bg-bg_color">
            <Search
              shape="round"
              placeholder={t`features_trade_common_select_trade_pair_index_510278`}
              value={searchKey}
              onChange={debounceSetSearchKey}
            />
          </div>
          <div className="options-wrapper">
            <CommonListEmpty hidden={displayList.length !== 0} />
            {displayList.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  selectPair(item.id)
                }}
                className={classNames('option', 'rv-hairline--bottom', {
                  active: item.id === value,
                })}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </ActionSheet>
    </div>
  )
}

export default SelectTradePair
