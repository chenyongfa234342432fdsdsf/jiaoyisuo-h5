import React from 'react'
import cn from 'classnames'
import { Tabs } from '@nbit/vant'
import { LimitContent } from './limit'
import { MarketContent } from './market'
import { LimitTakeStopContent } from './limit-take-stop'

import styles from './index.module.css'

export default EntrustTip

const entrustList = [
  {
    title: '限价单',
    content: <LimitContent />,
  },
  {
    title: '市价单',
    content: <MarketContent />,
  },
  {
    title: '止盈止损',
    content: <LimitTakeStopContent />,
  },
]

function EntrustTip() {
  return (
    <div className={cn(styles.scoped)}>
      <div className="mt-3.5">
        <Tabs active={0}>
          {entrustList.map(item => (
            <Tabs.TabPane key={item.title} title={item.title}>
              {item.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
