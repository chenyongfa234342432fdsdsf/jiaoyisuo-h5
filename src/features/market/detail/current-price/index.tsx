import { t } from '@lingui/macro'
import classNames from 'classnames'
import { IncreaseTag } from '@nbit/react'
import { useMarketStore } from '@/store/market'
import { rateFilter, rateFilterFutures } from '@/helper/assets/spot'
import { KLineChartType } from '@nbit/chart-utils'
import { useContractMarketStore } from '@/store/market/contract'
import Icon from '@/components/icon'
import { Popover, PopoverInstance } from '@nbit/vant'
import { formatNumberUnit } from '@/store/order-book/common'
import { useEffect, useRef } from 'react'
import { useSafeState } from 'ahooks'
import { Tag } from '@/features/market/components/tag'
import { MarketTabsEnum } from '@/constants/market/market-list/market-module'
import { convertToMillions, formatTradePair } from '@/helper/market'
import { formatNumberDecimal } from '@/helper/decimal'
import Styles from './index.module.css'

interface CurrentPricePorps {
  type: KLineChartType
}

function CurrentPrice(props: CurrentPricePorps) {
  let currentModule

  const marketState = useMarketStore()
  const lastRef = useRef(0)
  const [dir, setDir] = useSafeState(1)
  const contractMarketState = useContractMarketStore()

  if (props.type === KLineChartType.Quote) {
    currentModule = marketState
  } else {
    currentModule = contractMarketState
  }

  useEffect(() => {
    if (lastRef.current === 0) {
      lastRef.current = currentModule.currentCoin.last
    } else {
      if (currentModule.currentCoin.last > lastRef.current) {
        setDir(1)
      } else {
        setDir(-1)
      }
      lastRef.current = currentModule.currentCoin.last
    }
  }, [currentModule.currentCoin.last])
  const contractList = [
    {
      value: 'perpetual_kline',
      text: t`constants_trade_752`,
    },
    {
      value: 'perpetual_index_kline',
      text: t`future.funding-history.index-price.column.mark-price`,
    },
    {
      value: 'perpetual_market_kline',
      text: t`future.funding-history.index-price.column.index-price`,
    },
  ]

  const selectPrice = option => {
    currentModule.updateCurrentPriceType(option.value)
  }

  const { amountOffset } = currentModule.currentCoin
  const popover = useRef<PopoverInstance>(null)
  return (
    <div className={Styles.price}>
      <div className={Styles.scoped}>
        <div className="left-wrap">
          {props.type === KLineChartType.Futures && (
            <div className="h-4 leading-4">
              <Popover
                ref={popover}
                placement="bottom"
                // actions={contractList}
                // onSelect={selectPrice}
                closeOnClickAction
                className="current-price-pop-wrap"
                reference={
                  <>
                    <span className="select-temp">
                      {
                        contractList.find(item => {
                          return item.value === currentModule.currentPriceType
                        })?.text
                      }
                    </span>
                    <Icon className="more-icon" name={'regsiter_icon_drop'} hasTheme />
                  </>
                }
              >
                <div className="pop-wrap">
                  {contractList.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={classNames({
                          'mt-4': index !== 0,
                          'text-brand_color': item.value === currentModule.currentPriceType,
                          'text-text_color_01': item.value !== currentModule.currentPriceType,
                        })}
                        onClick={() => {
                          selectPrice({
                            value: item.value,
                          })
                          popover.current?.hide()
                        }}
                      >
                        {item.text}
                      </div>
                    )
                  })}
                </div>
              </Popover>
            </div>
          )}
          <span
            className={classNames('last-price', {
              'text-buy_up_color': dir >= 0,
              'text-sell_down_color': dir < 0,
            })}
          >
            {currentModule.currentCoin.last}
          </span>
          <span className="cny-change-wrap">
            <span className="cny">
              ≈
              {props.type === KLineChartType.Quote
                ? rateFilter({
                    amount: currentModule.currentCoin.last,
                    symbol: currentModule.currentCoin.quoteSymbolName,
                  })
                : rateFilterFutures({
                    amount: currentModule.currentCoin.last,
                    symbol: currentModule.currentCoin.quoteSymbolName,
                  })}
            </span>

            <div
              className={classNames('p-0.5 rounded-sm text-xs flex item-center ml-2', {
                'bg-buy_up_color_special_02': parseFloat(currentModule.currentCoin.chg) > 0,
                'bg-sell_down_color_special_02': parseFloat(currentModule.currentCoin.chg) < 0,
                'bg-button_hover_01': parseFloat(currentModule.currentCoin.chg) === 0,
              })}
            >
              {/* <IncreaseTag hasPostfix digits={2} value={currentModule.currentCoin.chg} /> */}
              {Number(currentModule.currentCoin.chg) === 0 ? (
                <span className="text-xs font-semibold ml-2">0.00%</span>
              ) : (
                <IncreaseTag hasPostfix digits={2} value={currentModule.currentCoin.chg} />
              )}
            </div>
          </span>
          <Tag
            options={currentModule.currentCoin?.conceptList}
            symbol={currentModule.currentCoin.baseSymbolName}
            type={props.type === KLineChartType.Futures ? MarketTabsEnum.futures : MarketTabsEnum.spot}
          />
        </div>
        <div className="right-wrap">
          <div className="high-row">
            <span className="current">
              {t`features/market/detail/current-price/index-0`}
              <span className="property">{currentModule.currentCoin.high}</span>
            </span>
            <span className="current" style={{ width: '124px' }}>
              {t`features/market/detail/current-price/index-2`}({currentModule.currentCoin.baseSymbolName})
              <span className="property">
                {/* {convertToMillions(
                  Number(
                    rateFilter({
                      amount: formatNumberDecimal(
                        currentModule.currentCoin.volume,
                        currentModule.currentCoin.priceOffset
                      ),
                      showUnit: false,
                      symbol: currentModule.currentCoin.quoteSymbolName,
                    })
                  )
                )} */}
                {convertToMillions(Number(currentModule.currentCoin.volume), false, 2)}
              </span>
            </span>
          </div>
          <div className="low-row">
            <span className="current">
              {t`features/market/detail/current-price/index-1`}
              <span className="property">{currentModule.currentCoin.low}</span>
            </span>

            <span className="current" style={{ width: '124px' }}>
              {t`features_market_detail_current_price_index_510097`}({currentModule.currentCoin.quoteSymbolName})
              <span className="property">
                {/* {convertToMillions(
                  Number(
                    rateFilter({
                      amount: formatNumberDecimal(
                        currentModule.currentCoin.quoteVolume,
                        currentModule.currentCoin.priceOffset
                      ),
                      showUnit: false,
                      symbol: currentModule.currentCoin.quoteSymbolName,
                    })
                  )
                )} */}
                {convertToMillions(Number(currentModule.currentCoin.quoteVolume), false, 2)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentPrice
