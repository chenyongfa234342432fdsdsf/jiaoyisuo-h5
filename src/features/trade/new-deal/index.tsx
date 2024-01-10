import { useRef, useEffect } from 'react'
import cn from 'classnames'
import { useSafeState } from 'ahooks'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { useCommonStore } from '@/store/common'
import { formatDate } from '@/helper/date'
import NoDataImage from '@/components/no-data-image'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { guid } from '@/helper/common'
import { useTradeDeal } from './tradedeal'
import styles from './index.module.css'

type DealTableList = {
  time: string
  price: number
  qty: string
  id: number
  showtime: string
  direction: number
  digits: number
}

type SubsType = {
  biz: string
  type: string
  contractCode: string
  userId?: string
}

type SubscribeList = {
  subs: SubsType
  callback: (e: DealTableList[]) => void
}

type Props = {
  type: string
}

function NewDeal(props: Props) {
  const { type } = props

  const { setChangeSubs } = useTradeDeal()

  const { isFusionMode } = useCommonStore()
  const { requestSubs: subs, getStore, request, ws } = setChangeSubs(type)

  const [dealTableList, setDealTableList] = useSafeState<DealTableList[]>([])

  const marketState = getStore()

  const { symbolWassName: contractCode, symbolName, baseSymbolName } = marketState?.currentCoin || {}

  const setDigits = price => {
    const priceComputed = price?.split('.')?.[1]
    return priceComputed ? priceComputed.length : 0
  }

  const setChangeShowList = data => {
    return data
      .map(item => {
        item.judgeTime = Number(item.time)
        item.showtime = formatDate(Number(item.time), 'HH:mm:ss')
        item.digits = setDigits(item?.price)
        item.id = guid()
        return item
      })
      .sort((a, b) => b.judgeTime - a.judgeTime)
  }

  const getMarketTradesRequest = async () => {
    const { isOk, data } = await request.latestTransaction({ limit: 50, symbol: symbolName })
    if (isOk && data?.list) {
      const showList = data.list.map(item => {
        item.qty = item.volume
        return item
      })
      setDealTableList(setChangeShowList(showList))
    }
    return isOk
  }

  const cancelSubscribleRef = useRef<SubscribeList[]>([
    {
      subs: { ...subs, contractCode },
      callback: showList => {
        setDealTableList(item => {
          const changeShowList = setChangeShowList(showList)
          const list = [...changeShowList, ...item].slice(0, 100)
          return list
        })
      },
    },
  ])

  useEffect(() => {
    if (symbolName) {
      if (cancelSubscribleRef.current) {
        cancelSubscribleRef.current.forEach(({ subs, callback }) => {
          ws.unsubscribe({
            subs,
            callback,
          })
        })
      }

      cancelSubscribleRef.current[0].subs = { ...subs, contractCode }

      const tradesRequest = async () => {
        await getMarketTradesRequest()
        cancelSubscribleRef.current.forEach(({ subs, callback }) => {
          ws.subscribe({
            subs,
            callback,
            throttleType: WSThrottleTypeEnum.increment,
            throttleTime: 100,
          })
        })
      }

      tradesRequest()

      return () => {
        cancelSubscribleRef.current.forEach(({ subs, callback }) => {
          ws.unsubscribe({
            subs,
            callback,
          })
        })
      }
    }
  }, [contractCode])

  return (
    <div className={styles.scoped}>
      <div className="trade-deal-table">
        <div className="deal-table-header">
          <div>{t`future.funding-history.funding-rate.column.time`}</div>
          <div>{t`future.funding-history.index.table-type.price`}</div>
          <div>
            {t`features/trade/spot/price-input-0`} ({baseSymbolName})
          </div>
        </div>
        <div className="deal-table-body">
          {dealTableList.length === 0 ? (
            <div className="deal-note-date">
              <NoDataImage />
            </div>
          ) : (
            dealTableList.map(item => {
              return (
                <div
                  className={cn('deal-table-tr', {
                    'deal-table-tr-green': item.direction !== 2,
                    'deal-table-tr-red': item.direction === 2,
                  })}
                  key={item.id}
                >
                  <div>{item.showtime}</div>
                  <div
                  // className={cn({
                  //   'table-price-green': item.direction !== 2,
                  //   'table-price-red': item.direction === 2,
                  // })}
                  >
                    <IncreaseTag
                      hasPrefix={false}
                      digits={item.digits}
                      diffTarget={item.direction === 2 ? Infinity : 0}
                      value={Number(item.price)}
                    />
                  </div>
                  <div>
                    <IncreaseTag hasPrefix={false} hasColor={false} value={Number(item.qty)} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default NewDeal
