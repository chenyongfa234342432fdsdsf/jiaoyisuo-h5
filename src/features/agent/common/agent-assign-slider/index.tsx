import { Slider } from '@nbit/vant'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import styles from './index.module.css'

export default function AgentAssignSlider({ min = 0, max, onChange, sliderVal = 0 }) {
  const [value, setValue] = useState(0)
  const sliderChange = val => {
    if (min >= val) {
      setValue(min)
      onChange && onChange(min)
      return
    }
    setValue(val)
    onChange && onChange(val)
  }
  useEffect(() => {
    setValue(sliderVal)
  }, [sliderVal])
  /** 切割多少个分隔 */
  const pointSum = Math.ceil(Number(max) / 10) + 1
  return (
    <div className={styles['my-slider-box']}>
      <div className="my-slider">
        {/* 分割点 */}
        <div className="point-group">
          {[...Array(pointSum)].map((i, index) => {
            return (
              <span
                style={{
                  position: 'absolute',
                  left: `calc(${(100 / ([...Array(pointSum)].length - 1)) * index}%)`,
                }}
                key={index}
                className="point-box"
              >
                <i
                  key={index}
                  className={classNames('point', `${index * (max / (pointSum - 1))}`, {
                    active: index * (max / (pointSum - 1)) <= value,
                  })}
                ></i>
              </span>
            )
          })}
        </div>
        <Slider
          button={<span className="slider-button"></span>}
          value={value}
          onChange={sliderChange}
          max={Number(max)}
        />
      </div>
    </div>
  )
}
