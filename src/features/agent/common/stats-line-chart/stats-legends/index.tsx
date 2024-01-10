import { useAgentChartStore } from '@/store/agent/agent-chart'
import { IncreaseTag } from '@nbit/react'
import { Checkbox } from '@nbit/vant'
import { useEffect, useState } from 'react'
import { useUnmount, useUpdateEffect } from 'ahooks'
import { isEmpty } from 'lodash'
import styles from './index.module.css'

type TStatsCheckboxLegend = {
  data: any
  onchange: any
  hasDecimal?: boolean
  chartKey: string
  precision?: number
  checkFirstOnly?: boolean
}
type TStatsLegend = {
  data: any
  hasDecimal?: boolean
  chartKey: string
  precision?: number
}

function StatsSingleCheckboxLegend({ data, onchange, hasDecimal, chartKey, precision = 0 }: TStatsCheckboxLegend) {
  const [checked, setchecked] = useState<string[]>([])

  // useUnmount(() => {
  //   resetTooltipMap()
  // })
  const allData = data[0]
  const singleAgentData = data[1]

  // useUpdateEffect(() => {
  //   resetTooltipMap(chartKey)
  // }, [checked])

  return (
    <Checkbox.Group
      className={`${styles.scoped} !mr-0 items-end`}
      onChange={v => {
        const selected = v.includes(singleAgentData?.id) ? [singleAgentData?.id] : [allData?.id]
        setchecked(selected)
        onchange(selected)
      }}
      value={checked}
    >
      <Checkbox className="whitespace-nowrap text-xs" shape="square" name={singleAgentData?.id}>
        <span>{singleAgentData?.id}</span>
      </Checkbox>
    </Checkbox.Group>
  )
}

function StatsLegend({ data, hasDecimal, chartKey, precision = 0 }: TStatsLegend) {
  const { tooltipMap, resetTooltipMap } = useAgentChartStore()
  // useUnmount(() => {
  //   resetTooltipMap()
  // })

  return (
    <div className={styles.scoped}>
      {data?.map((item, index: number) => {
        // const parsed = JSON.parse(item.id)
        return (
          <div key={index} className="legend">
            <div className="legend-header">
              <span className="!font-normal">{tooltipMap?.[chartKey]?.[index]?.data?.xFormatted}</span>
              <span className="text-text_color_01">
                <span>+ </span>
                {hasDecimal ? (
                  <IncreaseTag
                    hasColor={false}
                    delZero={false}
                    hasPrefix={false}
                    hasPostfix={false}
                    kSign
                    value={tooltipMap?.[chartKey]?.[index]?.data?.yFormatted}
                    defaultEmptyText={precision ? '0.00' : '0'}
                    digits={precision}
                  />
                ) : (
                  <span className="text-text_color_01">{tooltipMap?.[chartKey]?.[index]?.data?.yFormatted}</span>
                )}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatsCheckboxLegend({
  data,
  onchange,
  hasDecimal,
  chartKey,
  precision = 0,
  checkFirstOnly,
}: TStatsCheckboxLegend) {
  const [checked, setchecked] = useState<string[]>([])
  useEffect(() => {
    if (isEmpty(data)) return
    if (checkFirstOnly) {
      setchecked([data[0].id])
    } else {
      setchecked(data?.map(each => each.id))
    }
  }, [data])

  const { tooltipMap, resetTooltipMap } = useAgentChartStore()

  // useUnmount(() => {
  //   resetTooltipMap()
  // })

  // useUpdateEffect(() => {
  //   resetTooltipMap()
  // }, [checked])

  return (
    <>
      {data.length > 0 && (
        <span className="font-normal text-text_color_02 text-sm ml-4">
          {tooltipMap?.[chartKey]?.[0]?.data?.xFormatted || data[0]?.default?.date}
        </span>
      )}
      <div className={`${styles.scoped} mt-2`}>
        <Checkbox.Group
          onChange={v => {
            setchecked(v)
            onchange(v)
          }}
          value={checked}
        >
          {data?.map((item, index: number) => {
            // const parsed = JSON.parse(item.checkboxTitle)
            return (
              <div key={index} className="legend">
                <div className="legend-header">
                  <div className="flex flex-row items-center">
                    <div className="legend-icon" style={{ background: item.color }} />
                    <span className="legend-title">{item.id}</span>
                  </div>
                  <Checkbox className="whitespace-nowrap" shape="square" name={item.id}>
                    <div>
                      +{' '}
                      {hasDecimal ? (
                        <IncreaseTag
                          hasColor={false}
                          delZero={false}
                          hasPrefix={false}
                          hasPostfix={false}
                          kSign
                          value={tooltipMap?.[chartKey]?.find(each => each.id.includes(item.id))?.data?.yFormatted}
                          defaultEmptyText={precision ? '0.00' : '0'}
                          digits={precision}
                        />
                      ) : (
                        <span className="text-text_color_01">{tooltipMap?.[chartKey]?.[index]?.data?.yFormatted}</span>
                      )}
                    </div>
                  </Checkbox>
                </div>
              </div>
            )
          })}
        </Checkbox.Group>
      </div>
    </>
  )
}

export { StatsCheckboxLegend, StatsLegend, StatsSingleCheckboxLegend }
