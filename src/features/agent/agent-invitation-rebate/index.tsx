import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { isApp } from '@/helper/is-app'
import NavBar from '@/components/navbar'
import { Button, Toast } from '@nbit/vant'
import { useState, useEffect } from 'react'
import { ThemeEnum } from '@/constants/base'
import useJsbridge from '@/hooks/use-jsbridge'
import { useCopyToClipboard } from 'react-use'
import { useCommonStore } from '@/store/common'
import { useLayoutStore } from '@/store/layout'
import { getCodeDetailList } from '@/apis/common'
import {
  AgentApplyStatus,
  AgentModeStatusEnum,
  ApprovalStatusTypeEnum,
  ApprovalStatusIndPassTypeEnum,
} from '@/constants/agent/invite'
import LazyImage, { Type } from '@/components/lazy-image'
import { usePageContext } from '@/hooks/use-page-context'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useAgentStore } from '@/store/agent/agent-invitation-rebate'
import { getAgentApplyRoutePath, getAgentResultRoutePath } from '@/helper/route/agent'
import { getPyramidApplyInfoApiRequest, getUserCheckBlacklistApiRequest } from '@/apis/agent/invite'
import { AgentPyramidApplyInfoType, AgentInviteCodeDefaultDataType } from '@/typings/api/agent/invite'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import RebateBody from '@/features/agent/agent-invitation-rebate/component/rebate-body'
import RebateHeader from '@/features/agent/agent-invitation-rebate/component/rebate-header'
import RebateWarnPopup from '@/features/agent/agent-invitation-rebate/component/rebate-warn-popup'
import styles from './index.module.css'

export default function AgentInvitationRebate() {
  const jsbridge = useJsbridge()
  const commonState = useCommonStore()
  const pageContext = usePageContext()
  const { fetchAgentEnums } = useAgentStore()
  const [copyState, copyToClipboard] = useCopyToClipboard()
  const { customerJumpUrl, businessName } = useLayoutStore().layoutProps || {}

  const [blackReason, setBlackReason] = useState<string>('')
  const [blackVisible, setBlackVisible] = useState<boolean>(false)
  const [isBlack, setIsBlack] = useState<boolean>(false)
  const [pyramidData, setPyramidData] = useState<AgentPyramidApplyInfoType>()
  const [showTag, setShowTag] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData>()
  const [invitationData, setInvitationData] = useState<AgentInviteCodeDefaultDataType>()
  const [statusCode, setStatusCode] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])

  const getPyramidApplyInfoData = async () => {
    /** 是否拉黑 */
    const { data: blackData, isOk: blackIsOk } = await getUserCheckBlacklistApiRequest({})
    if (blackIsOk && blackData?.inBlacklist) {
      setBlackReason(blackData?.reason)
      setIsBlack(blackData?.inBlacklist)
      setBlackVisible(blackData?.inBlacklist)
    }
    const { data, isOk } = await getPyramidApplyInfoApiRequest({})
    isOk && data && setPyramidData(data)
  }

  const getStatusCode = async () => {
    const { data, isOk } = await getCodeDetailList({ codeVal: 'approvalStatusInd' })
    if (isOk && data) {
      const uniqueArray = data.filter((obj, index, self) => {
        const firstIndex = self.findIndex(o => o.codeVal === obj.codeVal)
        return index === firstIndex
      })
      setStatusCode(uniqueArray)
    }
  }

  /** 处理金字塔模式的跳转路由 */
  const onPassPyramidChange = () => {
    switch (showTag?.codeVal) {
      case AgentApplyStatus.noPass:
        link(getAgentResultRoutePath(ApprovalStatusIndPassTypeEnum.noPass))
        break
      case AgentApplyStatus.pending:
        link(getAgentResultRoutePath(ApprovalStatusIndPassTypeEnum.pending))
        break
      case AgentApplyStatus.none:
        if (isBlack) {
          return Toast.info(t`features_agent_invite_operation_index_9ztacudqsqj7xltpyse3_`)
        }
        link(getAgentApplyRoutePath())
        break
      default:
        isBlack && Toast.info(t`features_agent_invite_operation_index_9ztacudqsqj7xltpyse3_`)
        break
    }
  }

  /** 获取邀请码和邀请链接 */
  const onRebateChange = v => {
    v && setInvitationData(v)
  }

  /** banner 海报文案 */
  const handleBannerText = () => {
    const agentData = invitationData?.agentLine
    const isArea = agentData?.includes(AgentModeStatusEnum.area)
    const area = isArea ? t`features_agent_agent_invitation_rebate_index_dvyd6it_ll` : ''
    const isThreeLevel = agentData?.includes(AgentModeStatusEnum.threeLevel)
    const threeLevel = isThreeLevel
      ? t`features_agent_agent_invitation_rebate_component_rebate_ladder_popup_index_vzvtihuacz`
      : ''
    const firstText = threeLevel || area || ''
    const isPyramid = agentData?.includes(AgentModeStatusEnum.pyramid)
    const secondText = isPyramid ? t`features_agent_agent_invitation_rebate_component_rebate_body_index_cyksy6k2c1` : ''
    return `${firstText}${firstText ? '+' : ''}${secondText}${
      firstText ? t`features_agent_agent_invitation_rebate_index_ruwm8myjpf` : ''
    }${t`features_agent_agent_invitation_rebate_index_mihns9lqjf`}`
  }

  /** button 按钮文案 */
  const handleButtonText = () => {
    let params = {
      class: '',
      text: t`features_agent_invite_operation_index_5101446`,
    }
    if (pyramidData?.showBanner) {
      switch (showTag?.codeVal) {
        case AgentApplyStatus.pending:
          params = {
            class: ApprovalStatusTypeEnum.pending,
            text: showTag?.codeKey,
          }
          break
        case AgentApplyStatus.noPass:
          params = {
            class: ApprovalStatusTypeEnum.noPass,
            text: showTag?.codeKey,
          }
          break
        default:
      }
    }
    return params
  }

  /** 邀请好友分享海报 */
  const onInvitationChange = () => {
    if (handleButtonText()?.class === ApprovalStatusTypeEnum.pending) {
      return link(getAgentResultRoutePath(ApprovalStatusIndPassTypeEnum.pending))
    }
    if (handleButtonText()?.class === ApprovalStatusTypeEnum.noPass) {
      return link(getAgentResultRoutePath(ApprovalStatusIndPassTypeEnum.noPass))
    }
    if (pyramidData?.showBanner && showTag?.codeVal === AgentApplyStatus.none) {
      if (isBlack) {
        return Toast.info(t`features_agent_invite_operation_index_9ztacudqsqj7xltpyse3_`)
      }
      return link(getAgentApplyRoutePath())
    }
    const isAppShare = isApp()
    const code = invitationData?.invitationCode || ''
    const qrcodeUrl = `https://${location.host}/${pageContext.locale}/register?invitationCode=${code}`
    if (isAppShare) {
      jsbridge.value?.call('sharePoster', {
        iconUrl: '',
        title: businessName,
        desc: invitationData?.slogan,
        imageText: t`features_agent_invite_operation_index_5101442`,
        imageUrl: `${oss_svg_image_domain_address}agent/qr_bg.png`,
        qrcodeUrl,
      })
    } else {
      copyToClipboard(qrcodeUrl)
      copyState.error
        ? Toast({ message: t`features_agent_invite_operation_index_5101443`, position: 'top' })
        : Toast({ message: t`features_agent_invite_operation_index_5101444`, position: 'top' })
    }
  }

  useEffect(() => {
    if (pyramidData && statusCode) {
      const findStatus = statusCode?.find(item => item?.codeVal === String(pyramidData.applyStatus))
      findStatus && setShowTag(findStatus)
    }
  }, [pyramidData, statusCode])

  useEffect(() => {
    fetchAgentEnums()
    getStatusCode()
    getPyramidApplyInfoData()
  }, [])

  return (
    <section className={styles['agent-invitation-rebate-wrap']}>
      <NavBar
        title={t`user.personal_center_05`}
        onClickRight={() => {
          location.href = customerJumpUrl as string
        }}
        right={
          <Icon
            hasTheme
            onClick={() => {
              location.href = customerJumpUrl as string
            }}
            className="common-icon"
            name="nav_service"
          />
        }
        onClickLeft={() => link('/personal-center')}
        appRightConfig={{
          onClickRight: () => {
            location.href = customerJumpUrl as string
          },
          iconUrl: `${oss_svg_image_domain_address}agent/customer_service_${
            commonState?.theme === ThemeEnum.light ? 'white' : 'black'
          }.png`,
        }}
      />

      <RebateHeader />

      <RebateBody isBlack={isBlack} showTag={showTag} onChange={onRebateChange} pyramidData={pyramidData} />

      {pyramidData?.showBanner && (
        <div className="agent-invitation-footer" onClick={onPassPyramidChange}>
          <div className="left">
            <p>{t`features_agent_agent_invitation_rebate_index_za3fbyogha`}</p>
            <div className="mode-wrap">
              <span>{handleBannerText()}</span>
              <Icon name="icon_agent_next" className="mode-wrap-icon" />
            </div>
            {showTag && showTag.codeVal !== AgentApplyStatus.none && (
              <div className={`mode-tag ${showTag.codeVal === AgentApplyStatus.noPass ? 'no-pass-tag' : 'pass-tag'}`}>
                {showTag.codeKey || ''}
              </div>
            )}
          </div>
          <LazyImage
            imageType={Type.png}
            className="footer-image"
            src={`${oss_svg_image_domain_address}agent/v3/new_agent_pyramid_mode`}
          />
        </div>
      )}

      <div className="agent-invitation-button">
        <Button type="primary" onClick={onInvitationChange} className={handleButtonText()?.class}>
          {pyramidData?.showBanner && showTag?.codeVal === AgentApplyStatus.none
            ? t`features_agent_agent_invitation_rebate_index_qzyjf3zii4`
            : handleButtonText()?.text}
        </Button>
      </div>

      <RebateWarnPopup reason={blackReason} visible={blackVisible} onClose={() => setBlackVisible(false)} />
    </section>
  )
}
