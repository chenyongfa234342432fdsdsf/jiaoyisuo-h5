import CommonListEmpty from '@/components/common-list/list-empty'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { ActionSheet } from '@nbit/vant'
import { useDebounceFn, useMount, useRequest, useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import { useState } from 'react'
import { getPerpetualTradePairList } from '@/apis/future/common'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import Search from '@/components/search'
import styles from './index.module.css'

export type IFuturePair = YapiGetV1PerpetualTradePairListData

type ISelectTradePairProps = {
  value?: IFuturePair
  onChange: (value: IFuturePair) => void
  list: IFuturePair[]
}

function SelectFutureTradePair({ value, onChange, list }: ISelectTradePairProps) {
  const [searchKey, setSearchKey] = useState('')
  const { run: debounceSetSearchKey } = useDebounceFn(setSearchKey, {
    wait: 300,
  })
  const [visible, setVisible] = useState(false)
  const selectedTradePair = value
  const displayList = searchKey ? list.filter(item => item.symbolName!.includes(searchKey.toUpperCase())) : list.slice()

  const selectPair = (item: IFuturePair) => {
    if (item.id === value?.id) {
      return
    }
    onChange(item)
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
        <span className="mr-1">
          {selectedTradePair?.symbolName} {t`assets.enum.tradeCoinType.perpetual`}
        </span>
        <Icon name="regsiter_icon_drop" className="text-xs scale-75 translate-y-px" hasTheme />
      </div>
      <ActionSheet visible={visible} cancelText={t`user.field.reuse_09`} onCancel={() => setVisible(false)}>
        <div className={styles['select-trade-pair-modal-wrapper']}>
          <div className="title">{t`features_trade_contract_contract_trade_pair_index_5101507`}</div>
          <div className="px-4 py-2">
            <Search
              placeholder={t`features_trade_contract_contract_trade_pair_index_5101506`}
              value={searchKey}
              onChange={debounceSetSearchKey}
            />
          </div>
          <div className="options-wrapper">
            <CommonListEmpty className="pt-24" hidden={displayList.length !== 0} />
            {displayList.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  selectPair(item)
                }}
                className={classNames('option', 'rv-hairline--bottom', {
                  active: item.id === value?.id,
                })}
              >
                {item.symbolName} {t`assets.enum.tradeCoinType.perpetual`}
              </div>
            ))}
          </div>
        </div>
      </ActionSheet>
    </div>
  )
}

export default SelectFutureTradePair
