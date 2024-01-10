import cn from 'classnames'
import { useState } from 'react'
import { ChartTrendingO, CashBackRecord, Ellipsis } from '@react-vant/icons'
import { Cell, Popup, PopupPosition } from '@nbit/vant'
import { marketUtils } from '@nbit/utils'
import styles from './index.module.css'

export default Header

function Header({ currentObject }) {
  const { sellSymbol, buySymbol, change } = currentObject
  const [state, setState] = useState('')
  const onClose = () => setState('')

  return (
    <div className={cn(styles.scoped, 'mb-2.5 mx-3')}>
      <div className="flex">
        <div className="flex flex-col">
          <span className="symol">
            {sellSymbol} / {buySymbol}
          </span>
          <span className="desc">永续</span>
        </div>

        <span className={cn('ml-3.5 text-sm font-semibold mt-1.5', marketUtils.getColorClassByPrice(change))}>
          {change}%
        </span>
      </div>
      <div className="flex">
        <div className="icon-item">
          <ChartTrendingO />
        </div>
        <div className="icon-item">
          <CashBackRecord />
        </div>
        <div className="icon-item" onClick={() => setState('top')}>
          <Ellipsis />
        </div>
      </div>
      <Popup visible={state === 'top'} style={{ height: '30%' }} position="top" onClose={onClose}>
        我是精选功能
      </Popup>
    </div>
  )
}
