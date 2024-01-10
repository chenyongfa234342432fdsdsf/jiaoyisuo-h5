import Icon from '@/components/icon'
import { InviteDetailsUidTypeEnum } from '@/constants/agent/invite'
import { agentGetUserId } from '@/helper/agent/invite'
import { isFalsyExcludeZero } from '@/helper/common'
import { IAgentInviteStore } from '@/store/agent/agent-invite'
import { YapiPostV1AgentInviteHistoryListMembersData } from '@/typings/yapi/AgentInviteHistoryV1PostApi'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { ReactNode } from 'react'
import { ApplayModelEnum } from '@/constants/agent'

const maxThreeHierarchy = 2
export function ShowDashIfEmpty({
  val,
  children,
  defaultValue,
}: {
  val: number | string
  children?: React.ReactNode
  defaultValue?: string
}) {
  if (!isFalsyExcludeZero(val)) return <>{children}</>
  return <>{defaultValue || '-'}</>
}

export function FinanceValue({ val, precision }: { val?: string | number; precision?: number }) {
  if (isFalsyExcludeZero(val)) {
    return <>{'-'}</>
  }
  return (
    <IncreaseTag
      value={val}
      digits={precision || 2}
      delZero={false}
      kSign
      defaultEmptyText={'0.00'}
      hasPrefix={false}
      hasColor={false}
      hasPostfix={false}
    />
  )
}

export function getInviteDetailsTableColumnSchema(
  store: IAgentInviteStore,
  setSelectedStatesPush,
  // 是否显示详情
  setDetailPopData,
  // 代理模式
  proxyType,
  // 代理层级
  hierarchy
): {
  accessorKey?: keyof YapiPostV1AgentInviteHistoryListMembersData | string
  header?: string | ReactNode
  cell?: (ctx) => ReactNode
  sorter?: boolean
  isHide?: boolean
}[] {
  const userId = agentGetUserId()

  return [
    {
      accessorKey: 'uid',
      header: t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101438`,
      sorter: false,
      cell: ctx => {
        const data = ctx || {}
        return proxyType === ApplayModelEnum.threeLevel && hierarchy === maxThreeHierarchy ? (
          <ShowDashIfEmpty val={data.uid}>
            <span className="uid-wrapper no-click">{data.uid}</span>
          </ShowDashIfEmpty>
        ) : (
          <ShowDashIfEmpty val={data.uid}>
            <span
              className="uid-wrapper"
              onClick={() => {
                const curState = store.getFilterSettingCheckMoreV2()
                const model = curState.model
                // 再填充
                setSelectedStatesPush(curState)
                store.setFilterSettingCheckMoreV2(
                  {
                    uid: String(data.uid),
                    parentUid: String(data.uid),
                    model,
                    queryUidType: InviteDetailsUidTypeEnum.upperLevelUid,
                    pageNum: 1,
                    pageSize: 20,
                  },
                  true
                )
              }}
            >
              {data.uid}
            </span>
          </ShowDashIfEmpty>
        )
      },
    },

    {
      accessorKey: 'parentUid',
      header: (
        <>
          <div className="flex">
            {t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101439`}
            <div className="parent-uid-hide-icon">
              <Icon
                name={store.checkMoreTableUpUidHide ? 'eyes_close' : 'eyes_open'}
                hasTheme
                className="eyes-icon"
                onClick={() => store.toggleCheckMoreUpUidHide()}
              />
            </div>
          </div>
        </>
      ),
      sorter: false,
      cell: ctx => {
        const data = ctx || {}
        if (store?.checkMoreTableUpUidHide) {
          return <span className="parentUid">***</span>
        }

        return (
          <ShowDashIfEmpty val={data?.parentUid}>
            <span className="parentUid">{data?.parentUid}</span>
          </ShowDashIfEmpty>
        )
      },
    },
    {
      accessorKey: proxyType === ApplayModelEnum.threeLevel ? 'fee' : 'teamFee',
      // 金字塔和区域文案显示团队手续费 三级显示 TA 的手续费
      header:
        proxyType === ApplayModelEnum.threeLevel
          ? t({
              id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_ragolyqj0s',
              values: { 0: '' },
            })
          : t({
              id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_em5idemulp',
              values: { 0: '' },
            }),
      sorter: false,
      cell: ctx => {
        const data = ctx || {}
        const key = proxyType === ApplayModelEnum.threeLevel ? 'fee' : 'teamFee'
        return <FinanceValue val={data[key] || 0} />
      },
    },

    {
      accessorKey: proxyType === ApplayModelEnum.threeLevel ? 'contributionRebate' : 'teamContributionRebate',
      // 金字塔和区域文案显示团队贡献返佣 三级显示 TA 的贡献返佣
      header:
        proxyType === ApplayModelEnum.threeLevel
          ? t({
              id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_oryfdwqrhh',
              values: { 0: '' },
            })
          : t({
              id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_3rkql4h8jj',
              values: { 0: '' },
            }),
      sorter: false,
      cell: ctx => {
        const data = ctx || {}
        const key = proxyType === ApplayModelEnum.threeLevel ? 'contributionRebate' : 'teamContributionRebate'
        return (
          <>
            <FinanceValue val={data[key] || 0} />
            <span
              className="text-xs ml-1"
              onClick={() =>
                setDetailPopData({
                  isShow: true,
                  data: data || {},
                })
              }
            >
              <Icon hasTheme name="msg" />
            </span>
          </>
        )
      },
    },
  ]
}
