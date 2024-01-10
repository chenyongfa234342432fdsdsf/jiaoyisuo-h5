import { t } from '@lingui/macro'
import { divide } from 'lodash'
import { useEffect, useState } from 'react'
import { AutoDetailType } from '@/typings/api/trade'
import { formatNumberDecimal } from '@/helper/decimal'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { getFuturesCurrencySettings } from '@/helper/assets/futures'
import styles from './index.module.css'

enum ProgressEnum {
  zero = 0,
  one = 1,
  two = 2,
  twelve = 12,
  oneHundred = 100,
}

export function AutoAddMarginBolus({ data }: { data?: AutoDetailType }) {
  const [percent, setPercent] = useState<number>(ProgressEnum.zero)

  const {
    futuresCurrencySettings: { offset },
  } = useAssetsFuturesStore()

  useEffect(() => {
    getFuturesCurrencySettings()
    const total = Number(data?.total) || ProgressEnum.zero
    const remaining = Number(data?.remaining) || ProgressEnum.zero
    const leftPercent = total ? divide(total, remaining + total) : ProgressEnum.zero
    const newPercent = formatNumberDecimal(leftPercent, 2, false)
    setPercent(20)
  }, [data])

  return (
    <div className={styles['auto-add-margin-bolus-wrapper']}>
      {data?.isSettingAutoMargin && (
        <>
          <div className="progress">
            <div className={`progress-l`} style={{ width: `${percent}%` }}>
              <div
                className="diagonal-bar"
                style={{
                  width:
                    percent === ProgressEnum.zero || percent === ProgressEnum.oneHundred
                      ? ProgressEnum.zero
                      : ProgressEnum.twelve,
                }}
              >
                <div className="red"></div>
                <div className="white"></div>
              </div>
            </div>
            <div
              className="progress-r"
              style={{
                width: `${
                  ProgressEnum.oneHundred - percent === ProgressEnum.one
                    ? ProgressEnum.two
                    : ProgressEnum.oneHundred - percent
                }%`,
              }}
            ></div>
          </div>
          <div className="bolus-wrapper-percentage-num">
            <div className="percentage-num-text">
              <label className="num-text-first">{t`features_trade_future_settings_margin_auto_detail_bolus_5101377`}</label>
              <span className="num-text-second">{`${percent}%`}</span>
            </div>
            <div className="percentage-num-text">
              <label className="num-text-first">{t`features_trade_future_settings_margin_auto_detail_bolus_5101378`}</label>
              <span className="num-text-second">{`${ProgressEnum.oneHundred - percent}%`}</span>
            </div>
          </div>
          <div className="bolus-wrapper-percentage-contair">
            {data?.lastTimeSettingAutoMargin && (
              <div className="percentage-contair-wrap">
                <label>
                  {`${t`features_trade_future_settings_margin_auto_detail_bolus_5101379`}${data?.currencySymbol || ''}`}
                </label>
                <div className="contair-wrap-price">
                  {formatNumberDecimal(data?.lastTimeRemaining, Number(offset || 0), false)}
                </div>
              </div>
            )}
            <div className="percentage-contair-wrap">
              <label>
                {`${t`features_trade_future_settings_margin_auto_detail_bolus_5101380`}${data?.currencySymbol || ''}`}
              </label>
              <div className="contair-wrap-price">{formatNumberDecimal(data?.total, Number(offset || 0), false)}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
