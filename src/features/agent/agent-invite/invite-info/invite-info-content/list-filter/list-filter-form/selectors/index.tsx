import CommonSelector from '@/components/common-selector'
import { useAgentInviteStore } from '@/store/agent/agent-invite'
import { SelectorOption } from '@nbit/vant'
import { SelectorValue } from '@nbit/vant/es/selector/PropsType'
import styles from './index.module.css'

export function AgentInviteContentListFilterFormInviteSelector({
  value,
  onChange,
  options,
}: {
  value?: any
  onChange?: any
  options: SelectorOption<SelectorValue>[]
}) {
  return <CommonSelector value={value} className={styles.scoped} options={options} onChange={onChange} />
}
