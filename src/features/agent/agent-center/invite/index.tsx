/**
 * 代理中心-TA 的邀请
 */
import NavBar from '@/components/navbar'
import {
  AgentInviteListSortTypeEnum,
  AgentModalTypeEnum,
  InviteDetailRegisterSortTypeEnum,
  InvitePageTypeEnum,
  getAgentCenterInviteDetailKeyByModalType,
  getChildInviteDetailKeyByModalType,
} from '@/constants/agent/agent-center/center'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import classNames from 'classnames'
import CommonList from '@/components/common-list/list'
import { useEffect, useState } from 'react'
import { requestWithLoading } from '@/helper/order'
import { getAgentCenterChildInviteOverview, postAgentCenterChildInviteList } from '@/apis/agent/center'
import { usePageContext } from '@/hooks/use-page-context'
import {
  AgentCenterChildInviteListReq,
  IAgentInviteDto,
  IAgentInviteeList,
} from '@/typings/api/agent/agent-center/center'
import { formatCurrency } from '@/helper/decimal'
import { t } from '@lingui/macro'
import { useGetState, useMount, useUpdateEffect } from 'ahooks'
import { link } from '@/helper/link'
import { getAgentMoreDetail } from '@/helper/route/agent'
import { InviteFilter } from '../center/common/invite-details/invite-filter'
import styles from './index.module.css'
import { InviteCell } from '../center/common/invite-details/invite-cell'
import { ScrollToTopButton } from '../center/common/scroll-top-button'

const initInviteForm = {
  registerDateSort: InviteDetailRegisterSortTypeEnum.default,
  rebateLevel: '',
  isRealName: '',
  teamNumMin: '',
  teamNumMax: '',
  startTime: 0,
  endTime: 0,
  pageNum: 1,
  pageSize: 10,
  uid: 0,
  sort: AgentInviteListSortTypeEnum.registerDate,
}

function AgentInviteLayout() {
  const { fetchAgentCenterEnums } = useAgentCenterStore() || {}
  const pageContext = usePageContext()
  const userUid = pageContext.urlParsed.search?.uid
  const model = pageContext.urlParsed.search?.model
  const [inviteDetail, setInviteDetail] = useState<IAgentInviteDto>({} as IAgentInviteDto)
  const [finished, setFinished] = useState(false)
  const [inviteForm, setInviteForm, getInviteForm] = useGetState<AgentCenterChildInviteListReq>(initInviteForm)
  const [inviteList, setInviteList] = useState<IAgentInviteeList[]>([])
  useMount(fetchAgentCenterEnums)

  const teamList = [
    {
      label: t`features_agent_agent_center_invite_index_kta24uiq9p`,
      value: !inviteDetail?.parentUid
        ? t`features_agent_agent_center_invite_index_zpuaui4ahp`
        : t({
            id: 'features_agent_agent_center_invite_index_vamgwwajlj',
            values: { 0: inviteDetail?.agentLevel || 1 },
          }),
    },
    { label: t`constants_agent_invite_index_9hftgfqry8`, value: formatCurrency(inviteDetail?.inviteNum) || 0 },
    {
      label: t`constants_agent_invite_index_vg3ikq_9fg`,
      value: formatCurrency(inviteDetail?.teamNum) || 0,
      isHide: model === AgentModalTypeEnum.threeLevel,
    },
  ]

  const onLoadUserInviteDetail = async () => {
    const res = await getAgentCenterChildInviteOverview({
      uid: userUid,
      model,
    })
    const { isOk, data } = res || {}
    if (!isOk || !data) return
    setInviteDetail(data[getChildInviteDetailKeyByModalType(model)])
  }

  const onLoadUserInviteList = async (isRefresh = false, form?: AgentCenterChildInviteListReq) => {
    let nForm = form ? { ...form } : { ...inviteForm }
    let params = {
      ...nForm,
      model,
      uid: +userUid,
      pageNum: isRefresh ? 1 : inviteForm?.pageNum,
    }
    if (!params?.registerDateSort) delete params?.registerDateSort
    if (!params?.registerDateSort) delete params?.sort
    if (!params?.isRealName) delete params?.isRealName
    if (!params?.teamNumMin) delete params?.teamNumMin
    if (!params?.teamNumMax) delete params?.teamNumMax
    if (!params?.startTime) delete params?.startTime
    if (!params?.endTime) delete params?.endTime
    if (!params?.rebateLevel) delete params?.rebateLevel
    if (!params?.searchUid) delete params?.searchUid
    const res = await postAgentCenterChildInviteList(params)

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      setFinished(true)
      return
    }
    const resp: IAgentInviteeList[] = data[getAgentCenterInviteDetailKeyByModalType(model)] || []
    const nList = isRefresh || (!isRefresh && inviteForm?.pageNum === 1) ? resp : [...inviteList, ...resp]
    setInviteList(nList)
    setFinished(params?.pageNum >= data?.pageTotal)
    setInviteForm({ ...nForm, pageNum: isRefresh ? 1 : inviteForm?.pageNum + 1 })
  }

  useEffect(() => {
    if (!userUid || !model) return
    requestWithLoading(onLoadUserInviteDetail(), 0)
  }, [])

  useUpdateEffect(() => {
    requestWithLoading(onLoadUserInviteDetail(), 0)
    onLoadUserInviteList(true, initInviteForm)
  }, [userUid])

  return (
    <div className={styles['agent-invite-layout']}>
      <NavBar
        title={t`features_agent_agent_center_invite_index_jexcixkl8l`}
        right={
          inviteDetail?.parentUid === 0 ? (
            <></>
          ) : (
            <span
              className="more"
              onClick={() => link(getAgentMoreDetail(model))}
            >{t`features_agent_common_agent_layout_index_8s0ijmnjld`}</span>
          )
        }
        appRightConfig={
          inviteDetail?.parentUid === 0
            ? {}
            : {
                text: t`features_agent_common_agent_layout_index_8s0ijmnjld`,
                textColor: 'brand_color',
                onClickRight: () => link(getAgentMoreDetail(model)),
              }
        }
      />
      <InviteCell
        selfRebateRatioVisible={false}
        data={inviteDetail}
        className="!border-b-0"
        pageType={InvitePageTypeEnum.subordinate}
        model={model}
        isEditRebateRatio={inviteDetail?.agentLevel === 1}
      />

      <div className="invite-detail-wrap">
        {teamList?.map((tramInfo, i: number) => {
          if (tramInfo?.isHide) return null

          return (
            <div
              className={classNames('invite-detail-cell', {
                mr: model === AgentModalTypeEnum.threeLevel,
              })}
              key={i}
            >
              <div className="cell-label">{tramInfo?.label}</div>
              <div className="cell-value">{tramInfo?.value}</div>
            </div>
          )
        })}
      </div>

      <div className="invite-list-wrap">
        <InviteFilter
          uidVisible={false}
          form={inviteForm}
          onChange={e => {
            const nForm = { ...getInviteForm(), ...e }
            requestWithLoading(onLoadUserInviteList(true, nForm), 0)
          }}
          model={model}
        />

        <CommonList
          finished={finished}
          onLoadMore={onLoadUserInviteList}
          listChildren={inviteList.map((inviteData: IAgentInviteeList, i: number) => {
            return (
              <InviteCell
                key={inviteData?.uid}
                data={inviteData}
                model={model}
                overwriteLastHistoryEntry
                className={(i + 1 === inviteList?.length && '!border-b-0') || ''}
                isEditRebateRatio={inviteDetail?.parentUid === 0}
                selfRebateRatioVisible={false}
                onLoadDetail={() => requestWithLoading(onLoadUserInviteDetail(), 0)}
              />
            )
          })}
          showEmpty={inviteList?.length === 0}
        />
      </div>

      <ScrollToTopButton />
    </div>
  )
}

export { AgentInviteLayout }
