import { Popup } from '@nbit/vant'

/**
 * 代理中心-切换币种/法币弹窗
 */
import Icon from '@/components/icon'
import { SearchInput } from '@/features/assets/common/search-input'
import { useState } from 'react'
import { useDebounce } from 'ahooks'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import CommonList from '@/components/common-list/list'
import LazyImage from '@/components/lazy-image'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import styles from './index.module.css'

interface IAgentCurrencyModalProps {
  visible: boolean
  onClose: () => void
}
function AgentCurrencyModal(props: IAgentCurrencyModalProps) {
  const { visible, onClose } = props || {}
  const { agentCurrencyList, currentCurrency, updateCurrentCurrency } = useAgentCenterStore() || {}
  const [searchKey, setSearchKey] = useState('')
  const debounceKey = useDebounce(searchKey)
  const filterList = [...agentCurrencyList].filter(currencyItem => {
    const ignoreCaseKey = debounceKey.toUpperCase()
    return currencyItem?.currencyEnName && currencyItem?.currencyEnName.toUpperCase().includes(ignoreCaseKey)
  })

  return (
    <Popup
      visible={visible}
      position="bottom"
      onClose={onClose}
      className={styles['currency-modal-root']}
      closeOnPopstate
      safeAreaInsetBottom
      destroyOnClose
    >
      <div className="modal-header">
        <div className="header-title">{t`features_agent_agent_center_center_currency_modal_intex_yq9rgs9mef`}</div>
        <Icon name="close" hasTheme className="close-icon" onClick={onClose} />
      </div>

      <SearchInput
        value={searchKey}
        placeholder={t`features_agent_agent_center_center_currency_modal_intex_itlswpffe8`}
        onChange={val => setSearchKey(val)}
        className="search"
      />

      <CommonList
        finished
        listChildren={filterList?.map(currency => {
          return (
            <div
              key={currency?.currencyEnName}
              className={classNames('currency-cell', {
                active: currentCurrency?.currencyEnName === currency?.currencyEnName,
              })}
              onClick={() => {
                updateCurrentCurrency(currency)
                onClose()
              }}
            >
              <LazyImage src={currency?.appLogo} width={22} height={22} round />
              <div className="name">{currency?.currencyEnName}</div>
            </div>
          )
        })}
        showEmpty={filterList?.length === 0}
      />
    </Popup>
  )
}

export { AgentCurrencyModal }
