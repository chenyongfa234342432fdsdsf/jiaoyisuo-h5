import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import { useEffect, useState } from 'react'
import { getRebateRuleApiRequest } from '@/apis/agent/invite'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import styles from './index.module.css'

type AgentRebateRulesType = {
  area: string
  pyramid: string
  threeLevel: string
}

export default function AgentRebateRules() {
  const [loading, setLoading] = useState<boolean>(false)
  const [rulesData, setRulesData] = useState<AgentRebateRulesType>()

  const getAgentRebateRulesData = async () => {
    setLoading(true)
    const { data, isOk } = await getRebateRuleApiRequest({})
    isOk && data && setRulesData(data)
    setLoading(false)
  }

  useEffect(() => {
    getAgentRebateRulesData()
  }, [])

  return (
    <section className={styles['agent-rebate-rules-wrap']}>
      <NavBar title={t`features_agent_agent_invitation_rebate_agent_rebate_rules_index_hkalabowqa`} />
      <main className="rules-main">
        {rulesData?.pyramid && (
          <>
            <p>{t`features_agent_invite_operation_index_5101452`}</p>
            <label dangerouslySetInnerHTML={{ __html: rulesData?.pyramid }} />
          </>
        )}
        {rulesData?.area && (
          <>
            <p>{t`features_agent_agent_invitation_rebate_agent_rebate_rules_index_qyigj_kjw1`}</p>
            <label dangerouslySetInnerHTML={{ __html: rulesData?.area }} />
          </>
        )}
        {rulesData?.threeLevel && (
          <>
            <p>{t`features_agent_agent_invitation_rebate_agent_rebate_rules_index_cs0j1z0txp`}</p>
            <label dangerouslySetInnerHTML={{ __html: rulesData?.threeLevel }} />
          </>
        )}
      </main>
      <FullScreenLoading mask isShow={loading} className="fixed" />
    </section>
  )
}
