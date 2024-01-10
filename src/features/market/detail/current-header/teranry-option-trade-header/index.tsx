import CollectStar from '@/components/collect-star'
import { getQuoteDisplayName } from '@/helper/market'
import { useMarketListStore } from '@/store/market/market-list'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { YapiGetV1FavouriteListData } from '@/typings/yapi/FavouriteListV1GetApi'
import { IncreaseTag } from '@nbit/react'
import classnames from 'classnames'
import Icon from '@/components/icon'
import { navigateBackHelper } from '@/helper/link'
import { OPTION_GUIDE_ELEMENT_IDS_ENUM } from '@/constants/guide-ids'
import { useCommonStore } from '@/store/common'
import DomAutoScaleWrapper from '@/components/dom-auto-scale-wrapper'
import { OptionPercent, useOptionPercent } from '@/features/ternary-option/trade/option-percent'
import Styles from './index.module.css'

const DelayTime = () => {
  const wsDelay = useCommonStore().wsDelayTime
  const delayThreshold = 1000

  return (
    <span className={`ws-delay-time-wrapper flex items-center rounded-sm text-xs`}>
      <span
        className={`ws-delay-time px-0.5 ${wsDelay > delayThreshold ? 'text-sell_down_color' : 'text-buy_up_color'} `}
      >
        {wsDelay}ms
      </span>
    </span>
  )
}

const ShowChg = ({ chg }) => {
  return (
    <div className={classnames('chg-wrap items-center flex px-1')}>
      <IncreaseTag hasPostfix digits={2} value={chg || 0} defaultEmptyText={'0.00'} delZero={false} />
    </div>
  )
}

function SecondRow({ onScrolling, currentCoin }) {
  return (
    <div
      className={classnames(Styles['second-row'], {
        'is-scrolling': onScrolling,
      })}
    >
      <span className="content flex items-center">
        <div id={OPTION_GUIDE_ELEMENT_IDS_ENUM.price} className="current-price px-1 flex items-center">
          <IncreaseTag
            digits={2}
            hasPrefix={false}
            value={currentCoin.last || 0}
            defaultEmptyText={'0.00'}
            delZero={false}
          />
        </div>
        <ShowChg chg={currentCoin.chg} />
      </span>
    </div>
  )
}

const HeaderContent = ({ onScrolling, isWrap, marketListState, currentCoin }) => (
  <div
    className={classnames({
      'content-wrap': true,
      'is-scrolling': onScrolling,
    })}
  >
    <div className="row first-row">
      <div
        className="coin option-coin"
        onClick={() => {
          marketListState.setIsSearchPopoverVisible(true)
        }}
      >
        {getQuoteDisplayName(currentCoin, false, false, 'trade')}
      </div>
      {<marketListState.TradeSearchComponent from="trade" />}
    </div>
    {onScrolling && <SecondRow onScrolling={onScrolling} currentCoin={currentCoin} />}
  </div>
)

export function CurrentHeaderTernaryOption({ extra }) {
  const currentModule = useTernaryOptionStore()
  const marketListState = useMarketListStore().ternaryOptionMarketsTradeModule
  const { isFusionMode } = useCommonStore()

  const currentCoin = currentModule.currentCoin
  // 非融合模式下才进入这种效果
  const onScrolling = currentModule.isPageScrolling

  const onClickBack = navigateBackHelper
  const props = { onScrolling, marketListState, isWrap: true, currentCoin }
  const percentProps = useOptionPercent()

  return (
    <div className={`${Styles.scoped} ${onScrolling && 'scrolling'}`}>
      <div
        className={classnames('flex items-center px-4', {
          'rv-hairline--bottom pb-1 mb-2': !onScrolling,
        })}
      >
        {!isFusionMode && (
          <div className="nav-wrapper mr-2">
            <Icon className="common-icon" name="back" hasTheme onClick={onClickBack} />
          </div>
        )}
        <HeaderContent {...props} />
        <div className="right-wrap flex-1 justify-end">
          <div
            className={classnames('flex items-center', {
              hidden: onScrolling,
            })}
          >
            <div className="mr-4">
              <DelayTime />
            </div>
            <CollectStar
              className="star"
              needWrap={false}
              {...(currentCoin as unknown as YapiGetV1FavouriteListData)}
            />
            <div className="extra-wrap">{extra}</div>
          </div>
          <div
            className={classnames('w-3/5', {
              hidden: !onScrolling,
            })}
          >
            <OptionPercent {...percentProps} />
          </div>
        </div>
      </div>
      {!onScrolling && (
        <div className="flex items-center justify-between px-4">
          <SecondRow onScrolling={onScrolling} currentCoin={currentCoin} />
          <div className="w-2/5">
            <OptionPercent {...percentProps} />
          </div>
        </div>
      )}
    </div>
  )
}
