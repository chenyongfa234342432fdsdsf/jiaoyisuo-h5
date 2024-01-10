import { Button } from '@nbit/vant'
import { t } from '@lingui/macro'
import styles from './index.module.css'

export default function AgentCommonButton(params) {
  return <Button className={styles['apply-button']} {...params}>{t`features_agent_agent_apply_index_5101611`}</Button>
}
