import { ReactNode, useEffect, useRef, useState } from 'react'
import { link } from '@/helper/link'
import { Button } from '@nbit/vant'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { usePageContext } from '@/hooks/use-page-context'
import { agent_v3_oss_svg_image_domain_address, ApplyResultStateEnum } from '@/constants/agent'
import { t } from '@lingui/macro'
import NavBar from '@/components/navbar'
import { useCommonStore } from '@/store/common'
import { getAgtApplyResult, postResultRead } from '@/apis/agent/result'
import { requestWithLoading } from '@/helper/order'
import Styles from './index.module.css'

interface applyResultType {
  navTitle?: string
  img?: ReactNode
  title?: string
  content?: string
}
function AgentResult() {
  const pageContext = usePageContext()
  const commonState = useCommonStore()
  const [applyResult, setApplyResult] = useState<applyResultType>({})
  const [isLoading, setIsLoading] = useState(true)
  const getAgtApplyResultFunc = async () => {
    const res = await getAgtApplyResult({})
    const data = res.data
    if (data?.applyStatus === ApplyResultStateEnum.applyNoPass) {
      setApplyResult({
        navTitle: t`features_agent_agent_result_index_x6vi4ctkob`,
        img: <LazyImage className="fail-img" src={`${agent_v3_oss_svg_image_domain_address}/fail.png`} />,
        title: t`features_kyc_fail_index_5101210`,
        content: t({
          id: 'features_agent_agent_result_index_6nu3b5awdu',
          values: { 0: data.rejectReason },
        }),
      })
      postResultRead({})
      setIsLoading(false)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    setIsLoading(true)
    /** 审核中 */
    if (Number(pageContext.routeParams.status) === ApplyResultStateEnum.applyProgress) {
      setApplyResult({
        navTitle: t`features_kyc_index_standards_5101191`,
        img:
          commonState?.theme === 'light' ? (
            <LazyImage
              className="apply-img"
              src={`${agent_v3_oss_svg_image_domain_address}/icon_submitted_white.png`}
            />
          ) : (
            <LazyImage className="apply-img" src={`${oss_svg_image_domain_address}agent/register_success_black.png`} />
          ),
        title: t`features_kyc_success_index_5101140`,
        content: t`features_agent_agent_result_index_vygc18jy2z`,
      })
      setIsLoading(false)
      return
    }
    requestWithLoading(getAgtApplyResultFunc())
  }, [])
  return (
    <div className={Styles.scoped}>
      <NavBar title={applyResult?.navTitle} />
      {!isLoading && (
        <div className="apply-wrap">
          {applyResult?.img}

          <div className="title mt-8">{applyResult?.title}</div>
          <div className="content">{applyResult?.content}</div>
          <Button
            onClick={() => {
              link('/agent')
            }}
            className="confirm-button mt-8"
          >
            {t`features_trade_common_notification_index_5101066`}
          </Button>
        </div>
      )}
    </div>
  )
}

export default AgentResult
