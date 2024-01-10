import { Checkbox, Popup, Slider } from '@nbit/vant'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useState } from 'react'

interface PropsType {
  showSettingOfTime: () => void
  showIndicatorOfChart: () => void
  onClose: () => void
  chartHeight: number
  setChartHeight: (v) => void
  popState: boolean
  setPopState: (v) => void
}

function ChartPop(props: PropsType) {
  const { showSettingOfTime, showIndicatorOfChart, onClose, chartHeight, setChartHeight, popState, setPopState } = props

  const [checked, setChecked] = useState<boolean>(false)
  const checkedChange = v => {
    setChecked(v)
  }

  return (
    <Popup visible={popState} className="rounded" style={{ height: '186px' }} position="bottom" onClose={onClose}>
      <div className="chart-indicator-set-pop">
        <h1 className="title">{t`components_chart_chart_pop_index_510149`}</h1>
        {/* <div className="checked-wrap">
          <Checkbox defaultChecked shape="square" checked={checked} onChange={checkedChange}>
            历史委托
          </Checkbox>
        </div> */}
        <div className="set-wrap">
          <div className="indicator" onClick={showIndicatorOfChart}>
            <Icon name={'indicator_settings_white1'} className="icon" />
            <span>{t`components_chart_chart_pop_index_510150`}</span>
          </div>
          <div className="time" onClick={showSettingOfTime}>
            <Icon name={'time_period'} hasTheme className="icon" />
            <span>{t`components_chart_chart_pop_index_510151`}</span>
          </div>
        </div>
        {/* <h2 className="chart-height">图表高度</h2>
        <Slider
          max={700}
          min={0}
          className="slider"
          barHeight={4}
          value={chartHeight}
          onChange={setChartHeight}
          // onChangeAfter={onChangeAfter}
        />
        <div className="slider-notice">
          <span>偏低</span>
          <span>默认</span>
          <span>偏高</span>
        </div> */}
        <div className="divide"></div>
        <div onClick={onClose} className="cancel">
          {t`user.field.reuse_09`}
        </div>
      </div>
    </Popup>
  )
}

export default ChartPop
