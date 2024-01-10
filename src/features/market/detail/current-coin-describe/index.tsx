import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { baseMarketStore, useMarketStore } from '@/store/market'
import Icon from '@/components/icon'
import { calcCoinDescribePrice, calcCoinDescribeTime } from '@/helper/market'
import { formatDate } from '@/helper/date'
import { getTradePairCoinExt } from '@/apis/market'
import { rateFilter } from '@/helper/assets/spot'
import { baseContractMarketStore, useContractMarketStore } from '@/store/market/contract'
import { KLineChartType } from '@nbit/chart-utils'
import { Loading } from '@nbit/vant'
import Styles from './index.module.css'

interface CurrentCoinDescribeProps {
  type: KLineChartType
}

const checkValue = (key, value) => {
  return key === null ? null : value
}

function CurrentCoinDescribe(props: CurrentCoinDescribeProps) {
  let currentModule

  const marketState = useMarketStore()
  const contractMarketState = useContractMarketStore()

  if (props.type === KLineChartType.Quote) {
    currentModule = marketState
  } else {
    currentModule = contractMarketState
  }

  const [isExpand, setIsExpand] = useState<boolean>(false)

  /** 展开 */
  const expand = () => {
    setIsExpand(true)
  }

  /** 收起 */
  const shrink = () => {
    setIsExpand(false)
  }

  /** 获取币种概况接口 */
  const getDescribeData = param => {
    const params = props.type === KLineChartType.Quote ? { coinId: param } : { coinName: param }
    getTradePairCoinExt(params).then(res => {
      if (res.isOk) {
        currentModule.updateCurrentCoinDescribe(res.data)
      }
    })
  }

  useEffect(() => {
    let baseCurrentModule

    const baseMarketState = baseMarketStore.getState()
    const baseContractMarketState = baseContractMarketStore.getState()
    if (props.type === KLineChartType.Quote) {
      baseCurrentModule = baseMarketState
    } else {
      baseCurrentModule = baseContractMarketState
    }
    if (!baseCurrentModule.currentCoin.id) {
      return
    }
    if (baseCurrentModule.currentCoin.id) {
      getDescribeData(
        props.type === KLineChartType.Quote
          ? baseCurrentModule.currentCoin.sellCoinId
          : baseContractMarketState.currentCoin.baseSymbolName
      )
    }
  }, [currentModule?.currentCoin?.id])

  if (!currentModule?.describe?.id || !currentModule?.currentCoin?.id) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  const describeListData = [
    {
      key: '0',

      value: checkValue(
        currentModule.describe.circulatingSupply,
        rateFilter({
          amount: calcCoinDescribePrice(currentModule.describe.circulatingSupply, currentModule.currentCoin.last),
          symbol: currentModule.currentCoin.quoteSymbolName,
        })
      ),
      title: t`features_market_detail_current_coin_describe_index_510201`,
    },

    {
      key: '1',
      value: checkValue(currentModule.describe.favouritePercent, `${currentModule.describe.favouritePercent}%`),
      title: t`features_market_detail_current_coin_describe_index_510202`,
    },
    {
      key: '2',
      value: checkValue(
        currentModule.describe.highest,
        calcCoinDescribeTime(
          rateFilter({
            amount: currentModule.describe.highest,
            symbol: currentModule.currentCoin.quoteSymbolName,
          }),
          currentModule.describe.highestTime
        )
      ),
      title: t`features_market_detail_current_coin_describe_index_510203`,
    },
    {
      key: '3',
      value: checkValue(
        currentModule.describe.lowest,
        calcCoinDescribeTime(
          rateFilter({
            amount: currentModule.describe.lowest,
            symbol: currentModule.currentCoin.quoteSymbolName,
          }),
          currentModule.describe.lowestTime
        )
      ),
      title: t`features_market_detail_current_coin_describe_index_510204`,
    },
    {
      key: '4',
      value: checkValue(currentModule.describe.startTime, formatDate(currentModule.describe.startTime, 'YYYY/MM/DD')),
      title: t`features_market_detail_current_coin_describe_index_510205`,
    },
    {
      key: '5',
      value: checkValue(currentModule.describe.publicChain, currentModule.describe.publicChain),
      title: t`features_market_detail_current_coin_describe_index_510206`,
    },
    {
      key: '6',
      value: checkValue(
        currentModule.describe.startPrice,
        rateFilter({
          amount: currentModule.describe.startPrice,
          symbol: currentModule.currentCoin.quoteSymbolName,
          precision: 4,
        })
      ),
      title: t`features_market_detail_current_coin_describe_index_510207`,
    },
    {
      key: '7',
      value: checkValue(
        currentModule.describe.maxSupply,
        `${currentModule.describe.maxSupply} ${currentModule.describe.publicChain}`
      ),
      title: t`features_market_detail_current_coin_describe_index_510208`,
    },
    {
      key: '8',
      value: checkValue(
        currentModule.describe.maxSupply,
        rateFilter({
          amount: calcCoinDescribePrice(currentModule.describe.maxSupply, currentModule.currentCoin.last),
          symbol: currentModule.currentCoin.quoteSymbolName,
        })
      ),
      title: t`features_market_detail_current_coin_describe_index_510209`,
    },
    {
      key: '9',
      value: checkValue(
        currentModule.describe.circulatingSupply,
        `${currentModule.describe.circulatingSupply} ${currentModule.describe.publicChain}`
      ),
      title: t`features_market_detail_current_coin_describe_index_510210`,
    },
    {
      key: '10',
      value: checkValue(
        currentModule.describe.circulatingSupply,
        rateFilter({
          amount: calcCoinDescribePrice(currentModule.describe.circulatingSupply, currentModule.currentCoin.last),
          symbol: currentModule.currentCoin.quoteSymbolName,
        })
      ),
      title: t`features_market_detail_current_coin_describe_index_510211`,
    },
    {
      key: '11',
      value: checkValue(currentModule.describe.circulatingPercent, `${currentModule.describe.circulatingPercent}%`),
      title: t`features_market_detail_current_coin_describe_index_510212`,
    },
  ]

  const linkData = [
    {
      key: 'officialUrl',
      value: currentModule.describe.officialUrl,
      title: t`features/market/detail/current-coin-describe/index-4`,
      icon: 'currency_official_website',
    },
    {
      key: 'whitePaper',
      value: currentModule.describe.whitePaper,
      title: t`features/market/detail/current-coin-describe/index-3`,
      icon: 'currency_whitepaper',
    },
    {
      key: 'explorerAddressUrl',
      value: currentModule.describe.explorerAddressUrl,
      title: t`features/market/detail/current-coin-describe/index-5`,
      icon: 'currency_blockchain',
    },
  ]

  return (
    <div className={Styles.scoped}>
      <div className="quote-pop-wrap">
        <div className="title coin-name">
          <img className="img" src={currentModule.describe.appLogo} alt="" />
          <span>{currentModule.describe.shortName}</span>
          <span className="en-name sub-title ml-1">{`${currentModule.describe.fullName}`}</span>
        </div>
        {describeListData.map(item => {
          if (!item.value) {
            return null
          }
          return (
            <div className={classNames('pop-row', 'row-line')} key={item.key}>
              <span className="sub-title">{item.title}</span>
              <span className={'not-link'}>{item.value}</span>
            </div>
          )
        })}
        <div className="info">
          <p className="title">
            {t`features_market_detail_current_coin_describe_index_510213`}
            <span className="ml-1">{currentModule.describe.shortName}</span>
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: isExpand
                ? currentModule.describe.coinRemarks || '-'
                : `${currentModule.describe.coinRemarks?.substring(0, 150) || '-'}...`,
            }}
            className="des sub-title"
          ></div>
          {!isExpand ? (
            <span onClick={expand} className="oper">
              {t`features_market_market_quatation_market_sector_sector_glate_detail_index_510154`}
              <Icon className="expand-icon ml-2" name={'regsiter_icon_drop_white_hover'} />
            </span>
          ) : (
            <span className="oper" onClick={shrink}>
              {t`features_market_detail_current_coin_describe_index_510215`}
              <Icon className="expand-icon ml-2" name={'regsiter_icon_away_white_hover'} />
            </span>
          )}
        </div>
        <div className="title px-4 mb-4">{t`features_market_detail_current_coin_describe_index_510214`}</div>
        <div>
          {linkData.map((item, index) => {
            if (!item.value) {
              return null
            }
            return (
              <div
                className={classNames('pop-row', 'row-line')}
                style={{ marginTop: index === 0 ? 0 : '32px' }}
                key={item.key}
              >
                <div>
                  <Icon hasTheme className="website-icon" name={item.icon} />
                  <span className="sub-title ml-2">{item.title}</span>
                </div>
                <span className={'is-link'}>
                  <a href={item.value} target="_blank">
                    <Icon className="icon" hasTheme name="next_arrow" />
                  </a>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CurrentCoinDescribe
