import { CommonDigital } from '@/components/common-digital'
import Icon from '@/components/icon'
import HideContent from '@/features/agent/common/hide-content'
import { IncreaseTag } from '@nbit/react'
import { useState } from 'react'
import { FinanceValue } from '@/features/agent/agent-invite/invite-check-more-v3/display-table/table-schema'
import StatsPopup from '../../stats-popup'
import styles from './index.module.css'

type TInfoColumn = {
  title: string
  popupContent?: string
  value: string | number
  className?: string
  hasIcon?: boolean
  isFinanceValue?: boolean
  isHide?: boolean
  precision?: number
}

function InfoColumn({
  title,
  popupContent,
  value,
  className,
  hasIcon,
  isFinanceValue = true,
  isHide,
  precision,
}: TInfoColumn) {
  const [visible, setvisible] = useState(false)
  return (
    <span className={`${styles.scoped} ${className}`}>
      <div>
        <span className="flex items-center">
          <span className="text-xs text-text_color_02">{title}</span>

          {hasIcon && (
            <Icon
              className="ml-1 mt-0 text-xs"
              name="msg"
              hasTheme
              onClick={e => {
                e.stopPropagation()
                setvisible(true)
              }}
            />
          )}
        </span>
        <HideContent className="text-left text-text_color_01 text-sm font-medium" isHide={isHide}>
          {isFinanceValue ? (
            <IncreaseTag
              value={value || undefined}
              defaultEmptyText={'0.00'}
              digits={precision}
              kSign
              delZero={false}
            />
          ) : (
            <IncreaseTag value={value || undefined} defaultEmptyText={'0'} />
          )}
        </HideContent>
      </div>

      <StatsPopup title={title} content={popupContent} visible={visible} setVisible={setvisible} />
    </span>
  )
}

export default InfoColumn
