import { t } from '@lingui/macro'
import { Field, Input } from '@nbit/vant'
import { useEffect, useState } from 'react'
import styles from './index.module.css'

export function FormItemGroup({
  value,
  onChange,
  key1,
  key2,
  placeholder1,
  placeholder2,
  suffix,
  inputValidation,
}: {
  value?: any
  onChange?: any
  key1: string
  key2: string
  placeholder1: string
  placeholder2: string
  suffix?: any
  inputValidation?: any
}) {
  const [state, setState] = useState(value || {})

  useEffect(() => {
    setState(prev => {
      return {
        ...prev,
        ...value,
      }
    })
  }, [value])

  return (
    <div className={`form-num-range ${styles.scoped}`}>
      <Field
        type="number"
        value={String(state[key1] || '')}
        onChange={v => {
          if (inputValidation && !inputValidation(v)) {
            return
          }
          onChange && onChange({ ...state, [key1]: v })
        }}
        placeholder={placeholder1}
        suffix={<span>{suffix}</span>}
      />
      <span>{t`features_assets_financial_record_datetime_search_index_602`}</span>

      <Field
        type="number"
        value={String(state[key2] || '')}
        onChange={v => {
          if (inputValidation && !inputValidation(v)) {
            return
          }
          onChange && onChange({ ...state, [key2]: v })
        }}
        placeholder={placeholder2}
        suffix={<span>{suffix}</span>}
      />
    </div>
  )
}
