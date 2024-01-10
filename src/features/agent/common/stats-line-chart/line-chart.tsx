import { ThemeEnum } from '@/constants/base'
import { useAgentChartStore } from '@/store/agent/agent-chart'
import { useCommonStore } from '@/store/common'
import { ResponsiveLine, Serie } from '@nivo/line'
import { useMount } from 'ahooks'
import { useEffect, useState } from 'react'

const spread = 7

function calTickSpread(data) {
  const length = data[0]?.data?.length || 0
  return Math.ceil(length / spread)
}

const commonProperties = themeSetting => {
  return {
    margin: { top: 10, right: 30, bottom: 30, left: 40 },
    pointSize: 6,
    pointBorderWidth: 2,
    pointBorderColor: { theme: 'background' },
    theme: {
      grid: {
        line: {
          // line_color_02
          stroke: ThemeEnum.dark === themeSetting ? '#323337' : '#F2F2F2',
          strokeWidth: 1,
        },
      },
      axis: {
        ticks: {
          text: {
            // text_color_02
            fill: ThemeEnum.dark === themeSetting ? '#C0C0C0' : '#7F7F81',
          },
        },
      },
    },
  }
}

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
const ResponsiveLineChart = ({ data, chartKey }) => {
  // fix weird line bug
  // const [localData, setLocalData] = useState<Serie[]>([])
  // useEffect(() => {
  //   setLocalData(data)
  // }, [data])

  const { setTooltipMap } = useAgentChartStore()
  useEffect(() => {
    // set default tooltip
    setTooltipMap(
      chartKey,
      data.map(each => {
        return {
          ...each,
          data: {
            yFormatted: each?.data[each?.data.length - 1].y,
            xFormatted: each?.data[each?.data.length - 1].x,
          },
        }
      })
    )
  }, [...data, chartKey])

  const { theme } = useCommonStore()
  return (
    <ResponsiveLine
      {...commonProperties(theme)}
      data={data}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        stacked: false,
      }}
      axisLeft={{
        legendOffset: 12,
      }}
      axisBottom={{
        format: '%m-%d',
        tickValues: `every ${calTickSpread(data)} days`,
        legendOffset: -12,
      }}
      curve={'linear'}
      enablePoints
      // useMesh
      enableGridX={false}
      enableArea
      // crosshairType="cross"
      enableCrosshair
      colors={(node: any) => {
        return `${node.color}`
      }}
      animate={false}
      // remove tooltip
      // tooltip={v => {
      //   setTooltipMap(chartKey, {
      //     x: v.point.data.xFormatted,
      //     y: v.point.data.yFormatted
      //   })
      // }}
      enableSlices="x"
      sliceTooltip={({ slice }) => {
        return <SlicedTooltip slice={slice} chartKey={chartKey} />
      }}
    />
  )
}

function SlicedTooltip({ slice, chartKey }) {
  const { setTooltipMap } = useAgentChartStore()
  useEffect(() => {
    setTooltipMap(chartKey, slice.points)
  }, [slice])
  return <></>
}

export default ResponsiveLineChart
