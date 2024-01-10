import { useEffect, useState } from 'react'
import { Tabs } from '@nbit/vant'
import { TernaryOptionTradeTabEnum } from '@/constants/ternary-option'
import { t } from '@lingui/macro'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { queryOptionTradeTimes } from '@/apis/ternary-option/trade'
import { ITernaryOptionTradeTime } from '@/typings/api/ternary-option'
import { useOptionTradeStore } from '@/store/ternary-option/trade'
import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import classNames from 'classnames'
import Icon from '@/components/icon'
import { useSpotCoinBalance } from '@/hooks/features/assets/spot'
import { TernaryOptionTradeGuide } from '../guide'
import { OrderForm } from './order-form'
import { OptionExchangeContext, useOptionExchangeInTop } from './context'
import styles from './index.module.css'

function ExchangeWrapper({
  tab,
  activeTab,
  time,
  times,
  onTimeChange,
  balance,
}: {
  tab: TernaryOptionTradeTabEnum
  activeTab: TernaryOptionTradeTabEnum
  times: ITernaryOptionTradeTime[]
  time?: ITernaryOptionTradeTime
  balance: number
  onTimeChange: (value: ITernaryOptionTradeTime | undefined) => void
}) {
  const useExchangeResult = useOptionExchangeInTop(
    {
      selfTab: tab,
    },
    balance
  )
  useExchangeResult.tradeInfo.activeTab = activeTab
  useExchangeResult.isActive = tab === activeTab
  useExchangeResult.times = times
  useExchangeResult.tradeInfo.time = time
  useExchangeResult.onTimeChange = onTimeChange

  return (
    <OptionExchangeContext.Provider value={useExchangeResult}>
      <OrderForm overModeIsTable={false} onFinish={() => {}} />
    </OptionExchangeContext.Provider>
  )
}

function OptionTradeExchange() {
  const [activeTab, setActiveTab] = useState(TernaryOptionTradeTabEnum.normal)
  const tabs = [
    {
      label: t`features_ternary_option_trade_exhange_index_xddo3jcncv`,
      value: TernaryOptionTradeTabEnum.normal,
    },
    {
      label: t`features_market_market_home_global_search_market_trade_search_ternary_option_index_gg3hfqd6hi`,
      value: TernaryOptionTradeTabEnum.over,
    },
  ]
  const { currentCoinExcludePrice: currentCoin } = useTernaryOptionStore()
  const { cacheData, setTimeId, isTutorialMode, setNotNeedOverTableGuide, setIsTutorialMode, updateOptionActiveTab } =
    useOptionTradeStore()
  const [times, setTimes] = useState<ITernaryOptionTradeTime[]>([])
  const [time, setTime] = useState<ITernaryOptionTradeTime>()
  const onTimeChange = (value: ITernaryOptionTradeTime | undefined) => {
    setTime(value)
    setTimeId(value?.id)
  }
  const fetchTimes = async () => {
    if (!currentCoin.id) {
      return
    }
    const res = await queryOptionTradeTimes({
      optionId: currentCoin.id,
    })
    if (!res.isOk || !res.data) return
    setTimes(res.data)
    const time = res.data.find(item => item.id === cacheData.timeId) || res.data[0]
    if (!time) return
    onTimeChange(time)
  }
  useEffect(() => {
    fetchTimes()
  }, [currentCoin.id])
  const onTabChange = (value: TernaryOptionTradeTabEnum) => {
    setActiveTab(value)
    if (value === TernaryOptionTradeTabEnum.over && !cacheData.notNeedOverTableGuide) {
      setIsTutorialMode(true)
      setNotNeedOverTableGuide(true)
    }
  }
  const balance = useSpotCoinBalance(currentCoin.coinId)
  const [guideAdvanceVisible, setGuideAdvanceVisible] = useState(false)
  const showGuide = () => {
    setGuideAdvanceVisible(true)
    setIsTutorialMode(true)
  }

  useEffect(() => {
    updateOptionActiveTab(activeTab)
  }, [activeTab])

  return (
    <>
      <TernaryOptionTradeGuide
        withAdvanceSteps={guideAdvanceVisible}
        isTernary={activeTab === TernaryOptionTradeTabEnum.over}
      />
      <div className="flex items-center pr-4">
        <Tabs
          className={classNames(styles['tabs-wrapper'], 'flex-1 mr-2', {
            'is-tutorial-mode': isTutorialMode,
          })}
          align="start"
          border
          active={activeTab}
          onChange={onTabChange as any}
          ellipsis={false}
        >
          {tabs.map(item => {
            return (
              <Tabs.TabPane
                titleClass={
                  item.value === TernaryOptionTradeTabEnum.normal
                    ? OPTION_GUIDE_ELEMENT_IDS_ENUM.binaryTab
                    : OPTION_GUIDE_ELEMENT_IDS_ENUM.ternaryTab
                }
                key={item.value}
                title={item.label}
                name={item.value}
              />
            )
          })}
        </Tabs>
        <div onClick={showGuide} className="tab-right-extra text-xs">
          <Icon hiddenMarginTop name="icon_option_guide" className="mr-1" hasTheme />
          <span className="text-text_color_03">{t`features_ternary_option_trade_exhange_index_kcjirgvlzs`}</span>
        </div>
      </div>

      {/* 放外面是为了吸顶有效 */}
      {tabs.map(item => {
        return (
          <ExchangeWrapper
            time={time}
            balance={balance}
            times={times}
            onTimeChange={onTimeChange}
            key={item.value}
            activeTab={activeTab}
            tab={item.value}
          />
        )
      })}
    </>
  )
}

export default OptionTradeExchange
