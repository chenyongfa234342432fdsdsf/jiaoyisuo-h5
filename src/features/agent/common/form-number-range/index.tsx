import { t } from '@lingui/macro'
import { Field } from '@nbit/vant'
import { ReactNode, useEffect, useState } from 'react'
import styles from './index.module.css'

const zero = '0'
export function FormItemGroup({
  numMin,
  numMax,
  onChange,
  key1,
  key2,
  placeholder1,
  placeholder2,
  suffix,
  inputValidation,
  /** 中间分隔符号 */
  centerSeparator,
}: {
  /** 低值 */
  numMin: number | string
  /** 高值 */
  numMax: number | string
  /**
   * 范围的默认值
   */
  value?: any
  /**
   * 数据改变函数
   */
  onChange?: any
  /**
   * 开始的 key 值
   */
  key1: string
  /**
   * 结束的 key 值
   */
  key2: string
  /**
   * 开始的默认提示
   */
  placeholder1: string
  /**
   * 结束的默认提示
   */
  placeholder2: string
  /**
   * 尾部插槽
   */
  suffix?: ReactNode
  /**
   * 输入校验
   */
  inputValidation?: (value) => boolean
  /**
   * 中间分隔符号
   */
  centerSeparator?: string
}) {
  const [state, setState] = useState({})
  useEffect(() => {
    setState(prev => {
      return {
        ...prev,
        [key1]: numMin,
        [key2]: numMax,
      }
    })
  }, [numMin, numMax])

  return (
    <div className={`num-range ${styles.scoped}`}>
      <Field
        type="digit"
        value={String(state[key1] || '')}
        onChange={v => {
          if (inputValidation && !inputValidation(v)) {
            return
          }
          onChange && onChange({ ...state, [key1]: v === zero ? v : v.replace(/^[0]+/, '') })
        }}
        placeholder={placeholder1}
        suffix={<span>{suffix}</span>}
      />
      <span>{centerSeparator || t`features_assets_financial_record_datetime_search_index_602`}</span>

      <Field
        type="digit"
        value={String(state[key2] || '')}
        onChange={v => {
          if (inputValidation && !inputValidation(v)) {
            return
          }
          onChange && onChange({ ...state, [key2]: v === zero ? v : v.replace(/^[0]+/, '') })
        }}
        placeholder={placeholder2}
        suffix={<span>{suffix}</span>}
      />
    </div>
  )
}
