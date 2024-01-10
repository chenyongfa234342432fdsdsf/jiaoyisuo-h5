import { t } from '@lingui/macro'
import { Button } from '@nbit/vant'
import { TradeDirectionEnum } from '@/constants/trade'
import { ReactNode, useEffect, useState } from 'react'
import classNames from 'classnames'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { useLongPress } from '@/hooks/use-long-press'
import { IntroSteps } from '@/components/intro-js/intro-steps'
import { Step } from 'intro.js-react'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { KLineChartType, ThemeEnum } from '@nbit/chart-utils'
import { useCommonStore } from '@/store/common'

import { useBaseGuideMapStore } from '@/store/server'
import { GuideMapEnum, GuideMapShowEnum } from '@/constants/common'
import { ExchangeContext, useExchangeInTop } from '../exchange/context'
import styles from './index.module.css'

type IMarketDetailTradeProps = {
  onOrderNode: ReactNode
  tradePath: string
  isTrade?: boolean // 是否为现货进入
  useExchangeResult: ReturnType<typeof useExchangeInTop>
  TradeModal: (props: { visible: boolean; onClose: () => void }) => JSX.Element
  type?: KLineChartType
}
function MarketDetailTrade({
  onOrderNode,
  useExchangeResult,
  TradeModal,
  tradePath,
  isTrade,
  type,
}: IMarketDetailTradeProps) {
  const { onDirectionChange, resetData } = useExchangeResult
  const [tradeVisible, setTradeVisible] = useState(false)
  const { guideMap, postGuideMapUpdate } = useBaseGuideMapStore()

  const [stepEnabled, setStepEnabled] = useState(
    guideMap[type === KLineChartType.Quote ? GuideMapEnum.spotKline : GuideMapEnum.contractKline] ===
      GuideMapShowEnum.yes
  )

  useEffect(() => {
    setStepEnabled(
      guideMap[type === KLineChartType.Quote ? GuideMapEnum.spotKline : GuideMapEnum.contractKline] ===
        GuideMapShowEnum.yes
    )
  }, [guideMap.spot_kline, guideMap.contract_kline])

  const { theme, isFusionMode } = useCommonStore()

  const onExit = () => {
    postGuideMapUpdate(type === KLineChartType.Quote ? GuideMapEnum.spotKline : GuideMapEnum.contractKline)
    setStepEnabled(false)
  }

  const onRenderIntro = (src: string, hint: string) => {
    const imgSrc = `${oss_svg_image_domain_address}guide/${src}${theme === ThemeEnum.light ? '_white' : '_black'}.svg`
    return (
      <div className={`bg-card_bg_color_03 ${styles['position-operation-guide-root']}`}>
        <img alt="" src={imgSrc} width={198} height={40} />
        <div className="flex w-full items-center mt-2" style={{ height: '30px' }}>
          <div className="content-text">{hint}</div>
          <div></div>
          {/* <Button
            type="primary"
            onClick={() => {
              console.log(123123)
              setStepEnabled(false)
            }}
            className="know-button ml-2"
          >
            我知道了
          </Button> */}
        </div>
      </div>
    )
  }

  const steps: Step[] = [
    {
      element: `#page-content .footer-operation button`,
      intro: onRenderIntro(
        'guide_future_trade_fast',
        t`features_trade_common_market_detail_trade_index_4c-uctixwh3pypamd-wng`
      ),
      position: 'top',
      tooltipClass: styles['intro-tooltip-lock'],
    },
  ]
  const showTradeModal = (value: TradeDirectionEnum) => {
    resetData()
    onDirectionChange(value)
    setTradeVisible(true)
  }
  const showBuy = () => showTradeModal(TradeDirectionEnum.buy)
  const showSell = () => showTradeModal(TradeDirectionEnum.sell)
  const toBuy = () => {
    link(`${tradePath}?direction=${TradeDirectionEnum.buy}`)
  }
  const toSell = () => {
    link(`${tradePath}?direction=${TradeDirectionEnum.sell}`)
  }
  const buyLongPress = useLongPress({
    onStartCallback: showBuy,
  })
  const sellLongPress = useLongPress({
    onStartCallback: showSell,
  })

  const onRemindChange = () => {
    link(`/inmail/reminder-page/${type}`)
  }

  return (
    <ExchangeContext.Provider value={useExchangeResult}>
      <div className={styles['market-detail-trade-wrapper']}>
        <div className="flex px-4">
          <div className="flex-1 mr-4" {...buyLongPress}>
            <Button
              onClick={toBuy}
              block
              className={classNames(styles['trade-button'], 'is-buy')}
            >{t`features/market/detail/index-1`}</Button>
          </div>

          <div className="flex-1" {...sellLongPress}>
            <Button
              onClick={toSell}
              block
              className={classNames(styles['trade-button'], 'is-sell')}
            >{t`features/market/detail/index-2`}</Button>
          </div>

          {!isFusionMode && (
            <div className="ml-4 text-center" onClick={onRemindChange}>
              <Icon name="message" hasTheme className="trade-wrapper-icon" />
              <div className="trade-wrapper-text">{t`features_trade_spot_market_detail_trade_index_5101341`}</div>
            </div>
          )}
        </div>
      </div>
      {onOrderNode}
      <TradeModal visible={tradeVisible} onClose={() => setTradeVisible(false)} />
      <IntroSteps
        steps={steps}
        stepEnabled={stepEnabled}
        onExit={onExit}
        tooltipClassCustom={styles['introjs-tooltip-custom']}
        highlightClassCustom={styles['introjs-highlight-custom']}
        onStartCallback={() => {}}
        options={{
          showButtons: true,
          showBullets: false,
          showProgress: false,
          exitOnOverlayClick: false,
          doneLabel: t`features_trade_common_notification_index_5101066`,
        }}
        // onChange={onExit}
      />
    </ExchangeContext.Provider>
  )
}

export default MarketDetailTrade
