import classNames from 'classnames'
import { MainIndicatorType, SubIndicatorType } from '@nbit/chart-utils'

interface PropsType {
  mainIndicator: MainIndicatorType
  subIndicator: SubIndicatorType
  setMainIndicator: (v) => void
  setSubIndicator: (v) => void
  chartHeight: number
  setChartHeight: (v) => void
  isFullScreen: boolean
}

const initialHeight = 375

function IndicatorSelect(props: PropsType) {
  const { mainIndicator, setMainIndicator, setSubIndicator, chartHeight, setChartHeight, subIndicator, isFullScreen } =
    props

  /** 选择主图 */
  const selectMainIndicator = (key, e) => {
    e.stopPropagation()

    setMainIndicator({
      ...mainIndicator,
      [key]: {
        ...mainIndicator[key],
        select: !mainIndicator[key].select,
      },
    })
  }

  /** 选择副图 */
  const selectSubIndicator = (key, e) => {
    e.stopPropagation()

    setSubIndicator({
      ...subIndicator,
      [key]: {
        ...subIndicator[key],
        select: !subIndicator[key].select,
      },
    })

    let height = 0
    for (let item in subIndicator) {
      if (key === item && !subIndicator[key].select) {
        height += 70
      } else {
        if (subIndicator[item].select && key !== item) {
          height += 70
        }
      }
    }
    setChartHeight(initialHeight + height)
  }

  return (
    <div className={isFullScreen ? 'ind-full-select' : 'ind-select'}>
      <div className={isFullScreen ? 'ind-full-main' : 'ind-main'}>
        <span
          onClick={e => selectMainIndicator('ma', e)}
          className={classNames({
            'text-text_color_01': mainIndicator.ma.select,
          })}
        >
          MA
        </span>
        <span
          onClick={e => selectMainIndicator('boll', e)}
          className={classNames({
            'text-text_color_01': mainIndicator.boll.select,
          })}
        >
          BOLL
        </span>
        <div className={isFullScreen ? 'ind-full-did' : 'ind-did'}></div>
      </div>
      <div className={isFullScreen ? 'ind-full-sub' : 'ind-sub'}>
        <span
          onClick={e => selectSubIndicator('macd', e)}
          className={classNames({
            'text-text_color_01': subIndicator.macd.select,
          })}
        >
          MACD
        </span>
        <span
          onClick={e => selectSubIndicator('kdj', e)}
          className={classNames({
            'text-text_color_01': subIndicator.kdj.select,
          })}
        >
          KDJ
        </span>
        <span
          onClick={e => selectSubIndicator('rsi', e)}
          className={classNames({
            'text-text_color_01': subIndicator.rsi.select,
          })}
        >
          RSI
        </span>
        <span
          onClick={e => selectSubIndicator('wr', e)}
          className={classNames({
            'text-text_color_01': subIndicator.wr.select,
          })}
        >
          WR
        </span>
      </div>
    </div>
  )
}

export default IndicatorSelect
