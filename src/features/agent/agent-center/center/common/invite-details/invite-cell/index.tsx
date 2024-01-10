/**
 * 代理中心 - 邀请详情 - 区域代理列表
 */
import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import {
  AgentLevelTypeEnum,
  AgentModalTypeEnum,
  AgentUserIsRealNameTypeEnum,
  InvitePageTypeEnum,
  getAgentLevelIconName,
  getInviteCertificationStatusTypeName,
} from '@/constants/agent/agent-center/center'
import { link } from '@/helper/link'
import { getAgentCenterInvitePageRoutePath } from '@/helper/route/agent'
import { Toast } from '@nbit/vant'
import classNames from 'classnames'
import {
  AgentCenterInviteCellProps,
  IAgentInviteDto,
  IProductRebateList,
} from '@/typings/api/agent/agent-center/center'
import { CommonDigital, DigitalModuleTypeEnum } from '@/components/common-digital'
import { useAgentCenterStore } from '@/store/agent/agent-center/center'
import { formatCurrency } from '@/helper/decimal'
import { formatDate } from '@/helper/date'
import { useState } from 'react'
import { isString } from 'lodash'
import { getTextFromStoreEnums } from '@/helper/store'
import AgentAssignScale from '@/features/agent/common/agent-assign-scalce'
import { requestWithLoading } from '@/helper/order'
import { postAgentCenterSetRebateRatio } from '@/apis/agent/center'
import { onGetAgentCenterInviteDetail } from '@/helper/agent/center'
import { CopyButton } from '../../copy-button/indext'
import styles from '../layout/index.module.css'

function InviteCell(props: AgentCenterInviteCellProps) {
  const { agentUserBlackInfo, agentCenterEnums } = useAgentCenterStore()
  const {
    pageType = InvitePageTypeEnum.center,
    className,
    isEncrypt = false,
    data,
    model,
    overwriteLastHistoryEntry = false,
    isEditRebateRatio = true,
    selfRebateRatioVisible = true,
    onLoadDetail,
  } = props || {}
  const [proportionVisible, setProportionVisible] = useState(false)

  const onEdit = () => {
    if (agentUserBlackInfo?.inBlacklist) {
      Toast.info(
        t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_index_ba_4ue7uns`
      )
      return
    }
    setProportionVisible(true)
  }

  const onChangeRebateRatio = async rebateRatio => {
    const res = await postAgentCenterSetRebateRatio({ uid: data?.uid, rebateRatio })
    const { isOk, data: ratioData } = res || {}

    if (!isOk || !ratioData || !ratioData?.isSuccess) return
    Toast.info(t`features_agent_agent_center_center_common_invite_details_invite_cell_index_cfkdh0y_xu`)

    setProportionVisible(false)
    pageType === InvitePageTypeEnum.center
      ? requestWithLoading(onGetAgentCenterInviteDetail(true), 0)
      : onLoadDetail && onLoadDetail()
  }

  const infoList = [
    {
      label: 'UID',
      value: `${data?.uid || '--'}`,
      isCopy: true,
      isEncrypt: true,
    },
    {
      label: t`features_agent_agent_center_center_common_invite_details_invite_cell_index_blrujdgas_`,
      value: `${data?.rebateRatio || '--'}%`,
      isHint: true,
      isEncrypt: true,
      isHide: model !== AgentModalTypeEnum.area,
    },
    {
      label: t`features_agent_agent_center_center_common_invite_details_invite_cell_index_jvjqjduro2`,
      value: (
        <div className="!text-brand_color !font-normal">{t`features_agent_agent_center_center_common_invite_details_invite_cell_index_eb1za2g_f7`}</div>
      ),
      isEdit: true,
      isShowProducts: true,
      isHide: model !== AgentModalTypeEnum.pyramid || !isEditRebateRatio,
    },
    {
      label: t`constants_agent_invite_index_9hftgfqry8`,
      value: formatCurrency(data?.inviteNum),
      isHide:
        pageType === InvitePageTypeEnum.subordinate ||
        (model === AgentModalTypeEnum.threeLevel && +(data as IAgentInviteDto)?.agentLevel > 2),
      isEncrypt: true,
    },
    {
      label: t`constants_agent_invite_index_vg3ikq_9fg`,
      value: formatCurrency(data?.teamNum),
      isHide: pageType === InvitePageTypeEnum.subordinate || model === AgentModalTypeEnum.threeLevel,
      isEncrypt: true,
    },
    { label: t`features_trade_future_c2c_25101571`, value: formatDate(data?.registerDate) },
  ]

  function ProductsCell() {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        {data?.productRebateList?.map((productData: IProductRebateList, y: number) => {
          if (!isOpen && y > 0) return null
          return (
            <div className="info-cell-wrap" key={productData?.productCd}>
              <div className="info-label">
                {getTextFromStoreEnums(
                  productData?.productCd || '',
                  agentCenterEnums.agentProductCdShowRatioEnum.enums
                )}
              </div>

              <div className="info-content">
                <CommonDigital
                  content={
                    selfRebateRatioVisible
                      ? t({
                          id: 'features_agent_agent_center_center_common_rebate_details_rebate_cell_index_27k1bt84nm',
                          values: { 0: productData?.selfRatio || '0', 1: productData?.childRatio || '0' },
                        })
                      : `${productData?.childRatio || '0'}%`
                  }
                  isEncrypt={isEncrypt}
                  className="info-value"
                  moduleType={DigitalModuleTypeEnum.agent}
                />

                <Icon
                  name={isOpen ? 'icon_agent_away' : 'icon_agent_drop'}
                  hasTheme
                  className={`info-copy-icon ${y > 0 && 'invisible'}`}
                  onClick={() => setIsOpen(!isOpen)}
                />
              </div>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <>
      <div className={classNames(styles['invite-cell-wrap'], className)}>
        <div className="invite-header">
          <div className="invite-info">
            <div className="info-avatar">{data?.nickName?.match(/^.{1}/)?.[0] || '--'}</div>

            <div className="info-nickname">{data?.nickName}</div>
            <Icon
              name={
                data?.isRealName === AgentUserIsRealNameTypeEnum.yes
                  ? 'icon_agency_center_verified'
                  : 'icon_agent_not_certified'
              }
              hasTheme={data?.isRealName !== AgentUserIsRealNameTypeEnum.yes}
              className="info-auth-icon"
              onClick={() =>
                Toast.info((data?.isRealName && getInviteCertificationStatusTypeName(`${data?.isRealName}`)) || '')
              }
            />

            {model === AgentModalTypeEnum.area && (
              <Icon
                name={getAgentLevelIconName(data?.rebateLevel || AgentLevelTypeEnum.one) || ''}
                className="info-level-icon"
              />
            )}
          </div>

          {pageType === InvitePageTypeEnum.center &&
            (model !== AgentModalTypeEnum.threeLevel ||
              (model === AgentModalTypeEnum.threeLevel && +(data as IAgentInviteDto)?.agentLevel <= 2)) && (
              <div
                className="invite-link-wrap"
                onClick={() =>
                  link(getAgentCenterInvitePageRoutePath(data?.uid, model), {
                    overwriteLastHistoryEntry,
                  })
                }
              >
                <div className="invite-link-text">{t`features_agent_agent_center_invite_index_jexcixkl8l`}</div>
                <Icon name="more" className="invite-link-icon" />
              </div>
            )}

          {pageType === InvitePageTypeEnum.subordinate && (data as IAgentInviteDto)?.parentUid !== 0 && (
            <div
              className="return-btn"
              onClick={() =>
                link(getAgentCenterInvitePageRoutePath((data as IAgentInviteDto)?.parentUid, model), {
                  overwriteLastHistoryEntry: true,
                })
              }
            >{t`features_agent_agent_invite_invite_check_more_index_5101436`}</div>
          )}
        </div>

        {infoList?.map((info, i: number) => {
          return (
            <div
              className={classNames('info-cell', {
                '!mb-0': info?.isHide,
              })}
              key={i}
            >
              <div
                className={classNames('info-cell-wrap', {
                  '!hidden': info?.isHide,
                })}
              >
                <div className="info-label">{info.label}</div>
                <div className="info-content">
                  {isString(info?.value) ? (
                    <CommonDigital
                      content={info?.value}
                      isEncrypt={isEncrypt && info?.isEncrypt}
                      className="info-value"
                      moduleType={DigitalModuleTypeEnum.agent}
                    />
                  ) : (
                    <div className="info-value">{info?.value}</div>
                  )}

                  {info?.isCopy && <CopyButton text={info?.value} className="info-copy-icon" />}
                  {info?.isEdit && <Icon name="rebate_edit" hasTheme className="info-edit-icon" onClick={onEdit} />}
                </div>
              </div>

              {info?.isShowProducts && <ProductsCell />}
            </div>
          )
        })}
      </div>

      {proportionVisible && (
        <AgentAssignScale
          title={t`features_agent_agent_manage_index_vlciyqteol`}
          contentTip={t`features_agent_agent_manage_index_tarctci1ds`}
          editVisible={proportionVisible}
          onEditClose={() => setProportionVisible(false)}
          onEditFinish={e => requestWithLoading(onChangeRebateRatio(e?.ratios), 0)}
          saveLoading={false}
          scalesArray={data?.productRebateList || []}
        />
      )}
    </>
  )
}

export { InviteCell }
