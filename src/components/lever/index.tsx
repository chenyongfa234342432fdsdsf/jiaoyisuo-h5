import Slider from '@/components/slider'
import { t } from '@lingui/macro'
import { ITradePairLever } from '@/typings/api/trade'
import { getLeverSliderPoints } from '@/helper/trade'
import TradePriceInput from '@/features/trade/common/price-input'
import classNames from 'classnames'
import styles from './index.module.css'

export type ILeverProps = {
  value: number
  onChange: (v: number) => void
  leverList: ITradePairLever[]
  /** 当前杠杆值，可不传，则不展示 */
  currentValue?: number
}

function Lever({ currentValue, leverList, value, onChange }: ILeverProps) {
  // 至少要 5 否则杠杆展示会有问题
  const max = leverList[0]?.maxLever || 5
  const localOnChange = (v: number) => {
    if (v > max) {
      v = max
    }
    onChange(v)
  }

  const sliderPoints = getLeverSliderPoints(max)

  return (
    <div className={styles['lever-wrapper']}>
      <div
        className={classNames('text-center mt-4 mb-4', {
          hidden: currentValue === undefined,
        })}
      >
        <span className="text-text_color_02">{t`features/trade/common/lever/index-1`}</span> {currentValue}X
      </div>
      <div className="relative price-input-step-wrapper mx-auto mb-5">
        <TradePriceInput
          allowEmpty={false}
          integer
          className="w-full"
          min={1}
          max={max}
          value={value.toString()}
          digit={0}
          onChange={v => localOnChange(Number(v))}
          currentValue={currentValue}
        />
        {/* 只有这里用到了 suffix，去改原来的组件不合适，不如重写 */}
        <div
          className="input-lever-suffix"
          style={{
            // @ts-ignore
            '--tw-translate-x': value >= 100 ? '20px' : '14px',
          }}
        >
          X
        </div>
      </div>
      <div className="py-2.5">
        <Slider pointSuffix="X" points={sliderPoints} min={1} max={max} value={value} onChange={localOnChange} />
      </div>
    </div>
  )
}

export default Lever
