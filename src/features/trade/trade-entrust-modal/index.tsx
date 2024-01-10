import { useState } from 'react'
import { ActionSheet, Popup, Tabs } from '@nbit/vant'
import cn from 'classnames'
import Icon from '@/components/icon'
import { baseCommonStore } from '@/store/common'
import { ThemeEnum } from '@/constants/base'
import { EntrustTypeEnum } from '@/constants/trade'
import LimitOrder from './limit-order'
import MarketOrder from './market-order'
import PlanDelegation from './plan-delegation'
import StopProfitStop from './stop-profit-stop'
import { useTradeEntrust } from './tradeentrust'
import styles from './index.module.css'
import { useExchangeContext } from '../common/exchange/context'

type IProps = {
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  whetherIsSpot?: boolean
}

function TradeEntrustModal({ visible, onVisibleChange, whetherIsSpot }: IProps) {
  const { entrustTabList } = useTradeEntrust(whetherIsSpot)
  const { tradeInfo } = useExchangeContext()
  const { theme } = baseCommonStore.getState()
  const imgName = theme === ThemeEnum.light ? 'white' : 'black'
  const setTabContent = selectedTab => {
    switch (selectedTab) {
      case EntrustTypeEnum.market:
        return <MarketOrder imgName={imgName} />
      case EntrustTypeEnum.limit:
        return <LimitOrder imgName={imgName} />
      case EntrustTypeEnum.plan:
        return <PlanDelegation imgName={imgName} />
      case EntrustTypeEnum.stop:
        return <StopProfitStop />
      default:
        return <></>
    }
  }

  return (
    <div>
      <Popup position="bottom" onClickOverlay={() => onVisibleChange(false)} visible={visible} className="rounded-t-lg">
        <div className={styles['modal-container']}>
          <Tabs defaultActive={tradeInfo.entrustType} swipeThreshold={3} align="start">
            {entrustTabList.map(item => {
              return (
                <Tabs.TabPane title={item.title} name={item.id} key={item.id}>
                  <div className="p-4">{setTabContent(item.id)}</div>
                </Tabs.TabPane>
              )
            })}
          </Tabs>
          <Icon name="close" className="tab-close" hasTheme onClick={() => onVisibleChange(false)} />
        </div>
      </Popup>
    </div>
  )
}

export default TradeEntrustModal
