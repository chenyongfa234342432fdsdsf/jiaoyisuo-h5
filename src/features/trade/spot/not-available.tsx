import { t } from '@lingui/macro'
import { Button } from '@nbit/vant'
import { useCountDown, useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { subscribeSpotCoin } from '@/apis/trade'
import LazyImage from '@/components/lazy-image'
import { SpotStopStatusEnum } from '@/constants/trade'
import { checkLogin } from '@/helper/auth'
import { formatDate } from '@/helper/date'
import { YapiGetV1TradePairDetailData as ISpotCoin } from '@/typings/yapi/TradePairDetailV1GetApi'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './common.module.css'

export type ISpotNotAvailableProps = {
  children?: ReactNode
  className?: string
  placeNode?: ReactNode
  coin: ISpotCoin
  tipAlign?: 'left' | 'center' | 'right'
  type?: 'kline'
}

function useSubscription(coin: ISpotCoin) {
  function getIsSubscribed() {
    return coin.subscribed?.toString() === '1'
  }
  const [isSubscribed, setIsSubscribed] = useState(getIsSubscribed)
  useUpdateEffect(() => {
    setIsSubscribed(getIsSubscribed())
  }, [coin])
  const subscribe = async () => {
    if (!checkLogin()) {
      return
    }
    const res = await subscribeSpotCoin({
      tradeId: coin.id!,
    })
    if (!res.isOk) {
      return
    }
    setIsSubscribed(true)
  }
  return {
    isSubscribed,
    subscribe,
  }
}

/**
 * 现货不可用组件，可用会正常展示，不可用则展示上线日期
 */
export function SpotNotAvailable({ children, className, tipAlign, placeNode, coin, type }: ISpotNotAvailableProps) {
  const { isSubscribed, subscribe } = useSubscription(coin)

  const [, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: coin.openTime,
  })
  const available = coin.marketStatus !== SpotStopStatusEnum.appoint
  if (available) {
    return children! as JSX.Element
  }
  const countdowns = [days, hours, minutes, seconds]
  return (
    <div className={classNames(className, styles['not-available-wrapper'], 'text-sm')}>
      {placeNode || (
        <div>
          <div className="flex flex-col items-center mb-2">
            <div className="mb-4 bg-card_bg_color_01 px-1.5 py-2">
              <div className="flex justify-center mb-1">
                {countdowns.map((countdown, index) => {
                  return (
                    <div className="flex text-button_text_02 font-semibold" key={index}>
                      {index > 0 && <span className="mx-1">:</span>}
                      <div className="countdown-tag">{countdown}</div>
                    </div>
                  )
                })}
              </div>
              <div className="text-center">{t`features_trade_spot_not_available_510230`}</div>
            </div>

            <LazyImage
              className="w-40 mb-2"
              whetherManyBusiness
              src={`${oss_svg_image_domain_address}image_stop_coming.png`}
            />
            <span className="text-text_color_02 mb-2">{formatDate(coin.openTime!)}</span>
            <Button
              className={classNames({
                'subscribe-button': type === 'kline',
              })}
              onClick={subscribe}
              block
              type="primary"
              disabled={isSubscribed}
            >
              {!isSubscribed
                ? t`features_trade_spot_not_available_510222`
                : t`features_trade_spot_not_available_510223`}
            </Button>
          </div>
          <div className={classNames('text-xs text-text_color_02', `text-${tipAlign}`)}>
            * {t`features_trade_spot_not_available_510224`}
          </div>
        </div>
      )}
    </div>
  )
}
