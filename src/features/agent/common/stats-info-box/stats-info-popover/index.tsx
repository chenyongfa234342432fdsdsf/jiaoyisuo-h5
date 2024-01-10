import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { YapiPostV1AgtRebateInfoHistoryQueryDetailsListIncomes } from '@/typings/yapi/AgtRebateInfoHistoryQueryDetailsV1PostApi'
import { t } from '@lingui/macro'
import { ReactNode, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import InfoColumn from '../info-column'
import styles from './index.module.css'

type TStatsInfoPopover = {
  children: ReactNode
  onchange: (state: boolean) => void
  data: YapiPostV1AgtRebateInfoHistoryQueryDetailsListIncomes
  disabled?: boolean
}

function StatsInfoPopover({ children, onchange, data, disabled }: TStatsInfoPopover) {
  const { isHideMyInfo, productTypesMap } = useAgentStatsStore()
  const [isOpen, setisOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const onClick = e => {
    setisOpen(true)
    onchange(true)
  }
  useEffect(() => {
    const closePopover = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setisOpen(false)
        onchange(false)
      }
    }
    document.addEventListener('click', closePopover)

    return () => document.removeEventListener('click', closePopover)
  }, [])

  return (
    <div className={styles.scoped}>
      {disabled ? (
        <div ref={wrapperRef} className="relative">
          {children}
        </div>
      ) : (
        <>
          <div
            ref={wrapperRef}
            className={classNames('relative cursor-pointer text-text_color_02', { 'text-text_color_01': isOpen })}
            onClick={onClick}
          >
            {children}
            {isOpen && <span className="info-popover-triangle"></span>}
          </div>
          {isOpen && (
            <div className="info-popover">
              {productTypesMap?.spot && (
                <InfoColumn title={t`constants_assets_common_587`} value={data?.spot} isHide={isHideMyInfo} />
              )}
              {productTypesMap?.contract && (
                <InfoColumn title={t`constants_assets_common_588`} value={data?.contract} isHide={isHideMyInfo} />
              )}
              {productTypesMap?.borrowCoin && (
                <InfoColumn
                  title={t`features_agent_common_stats_info_box_stats_info_popover_index_5101392`}
                  value={data?.borrowCoin}
                  isHide={isHideMyInfo}
                />
              )}
            </div>
          )}
          {isOpen && <div className="h-[72px]"></div>}
        </>
      )}
    </div>
  )
}

export default StatsInfoPopover
