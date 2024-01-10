import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { t } from '@lingui/macro'
import { Divider, Popup } from '@nbit/vant'
import { useEffect, useState } from 'react'
import { useAgentProductTypes } from '@/hooks/features/agent'
import Icon from '@/components/icon'
import classNames from 'classnames'
import StatsTableFilterForm from '../stats-table-filter-form'
import ColFilterSelector from '../stats-table-filter-form/col-filter-selector'
import { ProductDataFilterSelector } from '../stats-table-filter-form/data-filter-selector'
import styles from './index.module.css'

function StatsTableHeader() {
  const { filterSetting, setFilterSetting } = useAgentStatsStore()
  const [visible, setvisible] = useState(false)
  const options = useAgentProductTypes()

  const [currentValue, setcurrentValue] = useState(options[0]?.label || '')

  useEffect(() => {
    setcurrentValue(options[0]?.label)
  }, [options])
  return (
    <div className={styles.scoped}>
      <div className="table-header-filter">
        {/* <ProductDataFilterSelector
          value={[filterSetting.productCd]}
          onChange={val => setFilterSetting({ productCd: val[0] })}
        /> */}
        <div className="flex flex-row items-center">
          <span className="text-text_color_02 text-sm font-normal">{t`features_agent_agent_gains_stats_table_stats_table_header_index_t3k9nap4n6`}</span>
          <div onClick={() => setvisible(true)} className="popover-input">
            <span>{currentValue}</span>
            <Icon className="drop-icon" name="regsiter_icon_drop" hasTheme />
          </div>
        </div>
        <StatsTableFilterForm />
      </div>
      <Divider />
      <div className="table-header-title">
        <span className="text-text_color_03 text-xs">
          {t`features_agent_agent_gains_stats_table_stats_table_header_index_5101387`}
        </span>
        <ColFilterSelector />
      </div>
      <Popup className={styles['popup-select']} position="bottom" visible={visible}>
        {options.map((option, idx) => (
          <div
            className={classNames('popup-item', { 'text-brand_color': currentValue === option.label })}
            key={idx}
            onClick={() => {
              setFilterSetting({ productCd: option.value })
              setcurrentValue(option.label)
              setvisible(false)
            }}
          >
            {option.label}
          </div>
        ))}
        <Divider />
        <div
          className="popup-item cancel-btn"
          onClick={() => {
            setvisible(false)
          }}
        >{t`assets.financial-record.cancel`}</div>
      </Popup>
    </div>
  )
}

export default StatsTableHeader
