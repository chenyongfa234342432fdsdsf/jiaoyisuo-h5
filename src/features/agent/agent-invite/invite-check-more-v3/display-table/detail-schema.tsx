import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { ApplayModelEnum } from '@/constants/agent'
import { ReactNode } from 'react'
import { formatDate } from '@/helper/date'

type DetailCellRenderConfig = {
  /** 显示标签 */
  labelRender?: (currency?: string) => string
  /** 渲染函数 */
  render?: (detailData, dictionary?: []) => ReactNode
  /** 该配置项标识 */
  key?: string
}
enum AreaLevelEnum {
  level1 = 'one',
  level2 = 'two',
  level3 = 'three',
  level4 = 'four',
  level5 = 'five',
  level6 = 'six',
  level7 = 'seven',
  level8 = 'eight',
  level9 = 'nine',
}
const tableDetailMap = {
  /** 用户 uid */
  uid: {
    labelRender: () =>
      t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101438`,
    render: detailData => {
      return <span>{detailData?.uid || '--'}</span>
    },
  },
  /** 昵称 */
  nickName: {
    labelRender: () => t`features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_kcd5wcwsip`,
    render: detailData => {
      return <span>{detailData?.nickName || '--'}</span>
    },
  },
  /** 上级 uid */
  parentUid: {
    labelRender: () =>
      t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101439`,
    render: detailData => {
      return <span>{detailData?.parentUid || '--'}</span>
    },
  },
  /** 手机号 */
  mobileNumber: {
    labelRender: () => t`user.safety_items_02`,
    render: detailData => {
      return <span>{detailData?.mobileNumber || '--'}</span>
    },
  },
  /** 邮箱 */
  email: {
    labelRender: () => t`user.safety_items_04`,
    render: detailData => {
      return <span>{detailData?.email || '--'}</span>
    },
  },
  kycType: {
    labelRender: () =>
      t`features_agent_agent_invite_invite_check_more_v2_invitation_details_v2_display_table_table_schema__sr1abdgfl`,
    render: (detailData, dictionary) => {
      const kycTypeCode = dictionary?.kycTypeInd || []
      const findItem = kycTypeCode?.find(i => i.codeVal === String(detailData?.kycType))
      return <span>{findItem?.codeKey || '--'}</span>
    },
  },
  /**  邀请人数 */
  inviteNum: {
    labelRender: () => t`features_agent_invite_describe_index_5101500`,
    render: detailData => {
      return <span>{detailData?.inviteNum || 0}</span>
    },
  },
  /** 团队人数 */
  teamNum: {
    labelRender: () => t`constants_agent_index_jszioqtxqu`,
    render: detailData => {
      return <span>{detailData?.teamNum || 0}</span>
    },
  },
  /** 代理级别 */
  agentLevel: {
    labelRender: () =>
      t`features_agent_agent_invite_invite_check_more_display_table_table_columns_table_schema_5101441`,
    render: detailData => {
      return <span>{detailData?.agentLevel || '--'}</span>
    },
  },
  /** 区域返佣等级&比例 */
  rebateLevel: {
    labelRender: () => t`features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_mitc5lmrz6`,
    render: detailData => {
      const imgMap = {
        1: AreaLevelEnum.level1,
        2: AreaLevelEnum.level2,
        3: AreaLevelEnum.level3,
        4: AreaLevelEnum.level4,
        5: AreaLevelEnum.level5,
        6: AreaLevelEnum.level6,
        7: AreaLevelEnum.level7,
        8: AreaLevelEnum.level8,
        9: AreaLevelEnum.level9,
      }
      return (
        <span>
          <Icon className="level-icon" name={`icon_agent_grade_${imgMap[detailData?.rebateLevel || 0]}`} />
          {detailData?.rebateRatio || 0}%
        </span>
      )
    },
  },
  /** 团队返佣 */
  teamRebate: {
    labelRender: currency =>
      t({
        id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_min1ql5xrk',
        values: { 0: currency },
      }),
    render: detailData => {
      return <span>{detailData?.teamRebate || 0}</span>
    },
  },
  /** 团队手续费 */
  teamFee: {
    labelRender: currency =>
      t({
        id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_em5idemulp',
        values: { 0: `（${currency}）` },
      }),
    key: 'teamFee',
    render: detailData => {
      return <span>{detailData?.teamFee || 0}</span>
    },
  },
  /** 团队贡献返佣 */
  teamContributionRebate: {
    labelRender: currency =>
      t({
        id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_3rkql4h8jj',
        values: { 0: `（${currency}）` },
      }),
    key: 'teamContributionRebate',
    render: detailData => {
      return <span>{detailData?.teamContributionRebate || 0}</span>
    },
  },
  /** 总入金 */
  incoming: {
    labelRender: currency =>
      t({
        id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_4d02qtkfpz',
        values: { 0: currency },
      }),
    key: 'incoming',
    render: detailData => {
      return <span>{detailData?.incoming || 0}</span>
    },
  },
  /** 总出金 */
  withdraw: {
    labelRender: currency =>
      t({
        id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_nndhkd7glw',
        values: { 0: currency },
      }),
    key: 'withdraw',
    render: detailData => {
      return <span>{detailData?.withdraw || 0}</span>
    },
  },
  /** 注册时间 */
  registerDate: {
    labelRender: () => t`features_trade_future_c2c_25101571`,
    key: 'registerDate',
    render: detailData => {
      return <span>{detailData?.registerDate && formatDate(detailData?.registerDate)}</span>
    },
  },
  /** 产品线返佣比例 需要特殊处理通过 key 来区分 */
  productRebateList: {
    key: 'productRebateList',
  },
  /** 产品线 */
  productCd: {
    labelRender: () => t`features_assets_financial_record_record_list_record_list_screen_index_gzrjucuusr`,
    key: 'registerDate',
    render: (detailData, dictionary) => {
      const agentProductCode = dictionary?.agentProductCode
      const dictionaryCode = agentProductCode?.find(i => i.codeVal === detailData?.productCd)
      return <span>{dictionaryCode?.codeKey || t`constants_market_market_list_market_module_index_5101071`}</span>
    },
  },
  /** TA 的手续费 */
  fee: {
    labelRender: currency =>
      t({
        id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_ragolyqj0s',
        values: { 0: `(${currency})` },
      }),
    render: detailData => {
      return <span>{detailData?.fee || 0}</span>
    },
  },
  /** TA 的贡献返佣 */
  contributionRebate: {
    labelRender: currency =>
      t({
        id: 'features_agent_agent_invite_invite_check_more_v3_display_table_detail_schema_oryfdwqrhh',
        values: { 0: `(${currency})` },
      }),
    render: detailData => {
      return <span>{detailData?.contributionRebate || 0}</span>
    },
  },
}
export function getDetailSchema(type): DetailCellRenderConfig[] {
  switch (type) {
    /**
     * 区域代理
     */
    case ApplayModelEnum.area:
      return [
        tableDetailMap.uid,
        tableDetailMap.nickName,
        tableDetailMap.parentUid,
        tableDetailMap.mobileNumber,
        tableDetailMap.email,
        tableDetailMap.kycType,
        tableDetailMap.inviteNum,
        tableDetailMap.teamNum,
        tableDetailMap.agentLevel,
        tableDetailMap.rebateLevel,
        tableDetailMap.productCd,
        tableDetailMap.teamRebate,
        tableDetailMap.teamFee,
        tableDetailMap.teamContributionRebate,
        tableDetailMap.incoming,
        tableDetailMap.withdraw,
        tableDetailMap.registerDate,
      ]
    /**
     * 金字塔代理
     */
    case ApplayModelEnum.pyramid:
      return [
        tableDetailMap.uid,
        tableDetailMap.nickName,
        tableDetailMap.parentUid,
        tableDetailMap.mobileNumber,
        tableDetailMap.email,
        tableDetailMap.kycType,
        tableDetailMap.inviteNum,
        tableDetailMap.teamNum,
        tableDetailMap.agentLevel,
        tableDetailMap.productRebateList,
        tableDetailMap.productCd,
        tableDetailMap.teamRebate,
        tableDetailMap.teamFee,
        tableDetailMap.teamContributionRebate,
        tableDetailMap.incoming,
        tableDetailMap.withdraw,
        tableDetailMap.registerDate,
      ]
    /**
     * 三级代理
     */
    case ApplayModelEnum.threeLevel:
      return [
        tableDetailMap.uid,
        tableDetailMap.nickName,
        tableDetailMap.parentUid,
        tableDetailMap.mobileNumber,
        tableDetailMap.email,
        tableDetailMap.kycType,
        tableDetailMap.inviteNum,
        tableDetailMap.agentLevel,
        tableDetailMap.productCd,
        tableDetailMap.fee,
        tableDetailMap.contributionRebate,
        tableDetailMap.incoming,
        tableDetailMap.withdraw,
        tableDetailMap.registerDate,
      ]
    default:
      return []
  }
}
