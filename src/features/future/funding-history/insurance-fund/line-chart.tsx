import { formatDate } from '@/helper/date'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import { formatNumberDecimalWhenExceed } from '@/helper/decimal'
import { useMount } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import { useCssThemeColors } from '@/hooks/use-css-theme-color'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, zoomPlugin)

/** 仅适用于当前情况 */
function formatNumberUnit(num: string, digit: number) {
  if (Number(num) < 1e3) return formatNumberDecimalWhenExceed(num, digit)
  const abbrev = ['', 'K', 'M', 'B', 'T']
  const unrangifiedOrder = Math.floor(Math.log10(Math.abs(Number(num))) / 3)
  const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1))
  const suffix = abbrev[order]

  return formatNumberDecimalWhenExceed(Number(num) / 10 ** (order * 3), digit) + suffix
}

function getOptions({ tickColor, tooltipBgColor, textColor, gridLineColor, digit, symbol, data, labels }) {
  const tooltipFont = {
    size: 10,
    color: textColor,
    weight: 400,
  }
  const options: ChartOptions<any> = {
    responsive: true,
    elements: {
      point: {
        radius: 0,
        // 像素是 6
        hoverRadius: 3,
      },
    },
    interaction: {
      intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        callback(value, index, ticks) {
          return `${formatDate(value, 'MM-DD')}`
        },
        grid: {
          display: false,
        },
        count: 7,
        ticks: {
          color: tickColor,
          count: 7,
          autoSkip: true,
          font: {
            size: 10,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        position: 'right',
        type: 'linear',
        grid: {
          drawTicks: false,
          color: gridLineColor,
        },
        min: 0,
        grace: '5%',
        border: {
          display: false,
        },
        ticks: {
          callback(value, index, ticks) {
            return `${formatNumberUnit(value, digit)} ${symbol}`
          },
          padding: 8,
          color: tickColor,
          count: 4,
          autoSkip: true,
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          scaleMode: 'x',
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        limits: {
          x: {
            min: 'original',
            max: 'original',
          },
        },
      },
      tooltip: {
        backgroundColor: tooltipBgColor,
        titleColor: textColor,
        bodyColor: textColor,
        titleFont: tooltipFont,
        bodyFont: tooltipFont,
        displayColors: false,
        caretSize: 0,
        padding: {
          x: 12,
          y: 8,
        },
        titleMarginBottom: 2,
        callbacks: {
          label(item) {
            return `${item.formattedValue} ${symbol}`
          },
        },
      },
    },
    events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
  }

  return options
}

export default function FundTrendLineChart({
  data,
  digit,
  symbol,
}: {
  data: Array<{
    x: number
    y: number
  }>
  digit: number
  symbol: string
}) {
  const labels = data.map(item => formatDate(item.x, 'MM-DD').toString())
  const colors = useCssThemeColors()
  const options = getOptions({
    tickColor: colors.textColor03,
    digit,
    tooltipBgColor: colors.cardBgColor01,
    textColor: colors.textColor01,
    symbol,
    gridLineColor: colors.lineColor02,
    data,
    labels,
  })
  const datasets = [
    {
      label: 'Dataset 1',
      showLine: true,
      data, // data.map(item => item.y),
      borderColor: colors.brandColor,
      backgroundColor: colors.brandColor,
      borderWidth: 1,
      clip: 10,
    },
  ]
  const chartData = {
    labels,
    datasets,
  }
  const ref = useRef<any>()
  useEffect(() => {
    if (ref.current) {
      // ref.current.zoomScale('x', {
      //   min: data[0].x,
      //   max: data[data.length - 1].x,
      // })
    }
  }, [colors, data])
  if (!colors.brandColor) return null
  return <Line ref={ref} width="100%" className="!w-full" options={options} data={chartData} />
}
