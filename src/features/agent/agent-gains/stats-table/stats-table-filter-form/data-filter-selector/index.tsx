import CommonSelector from '@/components/common-selector'
import { useAgentProductTypes, useAgentRebateTypes } from '@/hooks/features/agent'
import { SelectorOption, SelectorValue } from '@nbit/vant/es/selector/PropsType'
import styles from './index.module.css'

export function ProductDataFilterSelector({ value, onChange }) {
  let options = useAgentProductTypes()
  // temporary
  options = options.slice(0, 1)
  return (
    <CommonSelector
      value={value}
      className={styles.scoped}
      options={options as SelectorOption<SelectorValue>[]}
      onChange={onChange}
    />
  )
}

export function RebateDataFilterSelector({ value, onChange }) {
  const options = useAgentRebateTypes()
  return (
    <CommonSelector
      value={value}
      className={styles.scoped}
      options={options as SelectorOption<SelectorValue>[]}
      onChange={onChange}
    />
  )
}
