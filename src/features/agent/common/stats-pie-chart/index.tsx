/**
 * 合约组详情 - 资产数据占比图表
 */
import { useState } from 'react'
import { t } from '@lingui/macro'
import NoDataImage from '@/components/no-data-image'
import { PieChart } from './pie-chart'
import styles from './index.module.css'

/**
 * 饼图图例
 * @param data 图表数据
 * @returns
 */
function LegendRender({ data }) {
  return (
    <div className="pie-legend">
      {data.map((pieItem, index: number) => {
        return (
          <div key={index} className="legend">
            <div className="legend-header">
              <div className="legend-icon" style={{ background: pieItem.color }} />
              <span className="legend-title">{pieItem.label}</span>
              {pieItem.value}%
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function StatsPieChart({ data }) {
  return (
    <div className={styles.scoped}>
      <div className="chart-title">
        <div className="chart-title-icon" />
        {t`features_agent_common_stats_line_chart_index_5101393`}
      </div>
      <div className="chart-wrap">
        {data.length > 0 ? (
          <>
            <div className="pie-wrap">
              <PieChart data={data} />
            </div>
            <LegendRender data={data} />
          </>
        ) : (
          <NoDataImage className="mx-auto" />
        )}
      </div>
    </div>
  )
}
