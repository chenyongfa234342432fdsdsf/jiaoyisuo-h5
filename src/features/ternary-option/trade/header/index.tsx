import Icon from '@/components/icon'
import { Popup } from '@nbit/vant'
import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { CurrentHeaderTernaryOption } from '@/features/market/detail/current-header/teranry-option-trade-header'
import { getTernaryOptionHomeMenu } from '@/constants/ternary-option/market-trade-area'
import { link } from '@/helper/link'
import Link from '@/components/link'
import { getTernaryOptionTodayPLPagePath } from '@/helper/route/ternary-option'
import styles from '../index.module.css'
import styles2 from './index.module.css'

function MenuOptions() {
  const actions = useMemo(() => getTernaryOptionHomeMenu(), [])
  const onSelect = item => {
    link(item.pagePath)
  }

  return (
    <div className="menu-options">
      {actions.map((item, index) => {
        return (
          <div key={index} className="action item-wrapper" onClick={() => onSelect(item)}>
            <span className="icon-wrap">{item.icon}</span>
            <span className="text-wrap">{item.text}</span>
          </div>
        )
      })}
    </div>
  )
}

export function TernaryOptionTradeHeader() {
  const [visible, setVisible] = useState(false)

  return (
    <div className={classNames(styles['header-wrapper'])}>
      <CurrentHeaderTernaryOption
        extra={
          <>
            <Link href={getTernaryOptionTodayPLPagePath()}>
              <Icon className="text-base" name="options_data" hasTheme />
            </Link>

            <Popup
              position="right"
              duration={0}
              className={`${styles2['popup-content']}`}
              overlayClass={`${styles2['popup-overlay']}`}
              visible={visible}
              onClose={() => setVisible(false)}
            >
              <MenuOptions />
            </Popup>
          </>
        }
      />
    </div>
  )
}
