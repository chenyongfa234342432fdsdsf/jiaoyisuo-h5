import { ITernaryOptionUpDownPercent } from '@/typings/api/ternary-option'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { decimalUtils } from '@nbit/utils'
import { IncreaseTag } from '@nbit/react'
import { formatDate } from '@/helper/date'
import { useInterval, useMount, useSafeState, useUpdate } from 'ahooks'
import { useTernaryOptionStore } from '@/store/ternary-option'
import { queryOptionUpDownPercent } from '@/apis/ternary-option/trade'
import { t } from '@lingui/macro'
import styles from './option-percent.module.css'

export function useOptionPercent() {
  const { currentCoinExcludePrice } = useTernaryOptionStore()
  const [percentData, setPercentData] = useSafeState<ITernaryOptionUpDownPercent>({
    call: 45,
    put: 55,
  })
  const { call: up, put: down } = percentData
  let diff = decimalUtils.SafeCalcUtil.sub(up, down).toNumber()
  const now = Date.now()
  const refresh = useUpdate()
  useInterval(refresh, 1000)
  const offset = (new Date().getTimezoneOffset() / 60) * -1
  const fetchPercent = async () => {
    if (!currentCoinExcludePrice.id) return
    const res = await queryOptionUpDownPercent({
      optionId: currentCoinExcludePrice.id,
    })
    if (!res.isOk || !res.data) return
    setPercentData(res.data)
  }
  useInterval(fetchPercent, 10 * 1000)
  useEffect(() => {
    fetchPercent()
  }, [currentCoinExcludePrice.id])
  // 这里的样式设定是因为可以保证百分百不会过低
  const downWidth = `calc(${down}% - 8px)`
  const upWidth = `calc(${up}% - 8px)`

  return {
    down,
    up,
    downWidth,
    upWidth,
  }
}

export function OptionPercent(props: ReturnType<typeof useOptionPercent>) {
  const { down, up, downWidth, upWidth } = props

  return (
    <div className={classNames(styles['percent-wrapper'], 'text-xs')}>
      <div className="flex justify-between">
        <span className="font-medium">{down}%</span>
        <div className="">
          <span className="font-medium">{up}%</span>
        </div>
      </div>
      <div className="bar-wrapper">
        <div
          className="bar down"
          style={{
            width: downWidth,
          }}
        ></div>
        <div className="h-2 w-2.5"></div>
        <div
          style={{
            width: upWidth,
          }}
          className="bar up"
        ></div>
        {/* <div
          style={{
            left: `calc(${down}% - 4px)`,
          }}
          className="white-clip"
        ></div> */}
      </div>
      <div className="flex justify-between">
        <div>
          <span className="text-text_color_02">{t`features_ternary_option_trade_option_percent_ruh7kpsdhk`}</span>
        </div>
        <div>
          <span className="text-text_color_02">{t`features_ternary_option_trade_option_percent_frihjzcis6`}</span>
        </div>
      </div>
    </div>
  )
}
