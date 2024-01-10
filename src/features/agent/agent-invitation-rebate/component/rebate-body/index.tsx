import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { Toast } from '@nbit/vant'
import { link } from '@/helper/link'
import { useCopyToClipboard } from 'react-use'
import {
  postPyramidCodeApiRequest,
  getProductRatioApiRequest,
  getInvitationCodeApiRequest,
  getPyramidListApiRequest,
  postInvitationCodeApiRequest,
  getFirstSettingReadApiRequest,
} from '@/apis/agent/invite'
import {
  AgentInviteCodeDefaultDataType,
  AgentScaleDataTypeProp,
  AgentRebateBodySelectTypeProps,
  AgentPyramidApplyInfoType,
} from '@/typings/api/agent/invite'
import { getCodeDetailList } from '@/apis/common'
import { usePageContext } from '@/hooks/use-page-context'
import { getAgentModuleRoutePath } from '@/helper/route/agent'
import { useState, useEffect, useLayoutEffect } from 'react'
import AgentAssignScale from '@/features/agent/common/agent-assign-scalce'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import Select from '@/features/agent/agent-invitation-rebate/component/rebate-select'
import { LevelIconType, AgentModeStatusEnum, AgentApplyStatus } from '@/constants/agent/invite'
import RebateApplyPopup from '@/features/agent/agent-invitation-rebate/component/rebate-apply-popup'
import RebateLadderPopup from '@/features/agent/agent-invitation-rebate/component/rebate-ladder-popup'
import RebateQrCodePopup from '@/features/agent/agent-invitation-rebate/component/rebate-qr-code-popup'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import styles from './index.module.css'

type RebateBodyCodeType = { [key: string]: { codeKey: string; codeVal: string; remark: string } }

enum RebateBodyItemHeight {
  none,
  single,
  min = 32,
}

type RebateBodyProps = {
  onChange: (v) => void
  isBlack: boolean
  pyramidData?: AgentPyramidApplyInfoType
  showTag?: YapiGetV1OpenapiComCodeGetCodeDetailListData
}

export default function RebateBody({ onChange, showTag, isBlack, pyramidData }: RebateBodyProps) {
  const [marginType, setMarginType] = useState<{ [key: string]: number }>()
  const [loading, setLoading] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [scaleVisible, setScaleVisible] = useState<boolean>(false)
  const [scalceData, setScaleData] = useState<AgentScaleDataTypeProp[]>([])
  const [applyVisible, setApplyVisible] = useState<boolean>(false)
  const [isRebateShow, setIsRebateShow] = useState<boolean>(false)
  const [ladderVisible, setLadderVisible] = useState<boolean>(false)
  const [qrCodeVisible, setQrCodeVisible] = useState<boolean>(false)
  const [productList, setProductList] = useState<RebateBodyCodeType>()
  const [rebateData, setRebateData] = useState<AgentInviteCodeDefaultDataType>()
  const [currentHeight, setCurrentHeight] = useState<number>(RebateBodyItemHeight.none)
  const [isThreeShow, setIsThreeShow] = useState<boolean>(false)
  const [threeCurrentHeight, setThreeCurrentHeight] = useState<number>(RebateBodyItemHeight.min * 3)
  const [pyramidList, setPyramidList] = useState<Array<AgentRebateBodySelectTypeProps>>([])
  const [currentMode, setCurrentMode] = useState<AgentModeStatusEnum>(AgentModeStatusEnum.area)

  const [copyState, copyToClipboard] = useCopyToClipboard()
  const pageContext = usePageContext()

  const generateInviteUrl = (invitationCode?: string) => {
    return `https://${location.host}/${pageContext.locale}/register?invitationCode=${invitationCode}`
  }

  const handleCopy = v => {
    copyToClipboard(v)
    copyState?.error
      ? Toast({ message: t`user.secret_key_02`, position: 'top' })
      : Toast({ message: t`user.secret_key_01`, position: 'top' })
  }

  const getRebateCodeData = async (flag = false) => {
    setLoading(true)
    const { data, isOk } = await getInvitationCodeApiRequest({})
    if (isOk && data) {
      if (flag) {
        const length = data?.pyramid?.products?.length || RebateBodyItemHeight.none
        setIsRebateShow(false)
        setCurrentHeight(RebateBodyItemHeight.min * length)
      }
      setRebateData(data)
      onChange && onChange(data)
      setMarginType({ value: data?.id })
    }
    setLoading(false)
  }

  /** 产品线数据字典 */
  const getShowRatioCode = async () => {
    const { data, isOk } = await getCodeDetailList({ codeVal: 'agent_product_cd_show_ratio' })
    if (isOk && data) {
      let newData = {}
      data.forEach(item => {
        newData[item.codeVal] = item
      })
      setProductList(newData)
    }
  }

  /** 模式更改 */
  const onMarginTypeChange = async v => {
    const params = {
      invitationCodeId: v?.value,
    }
    setLoading(true)
    const { data, isOk } = await postInvitationCodeApiRequest(params)
    if (!isOk) return setLoading(false)
    data?.isSuccess && getRebateCodeData()
  }

  /** 金字塔返佣展开与折叠 */
  const onAgentAwayChange = () => {
    const length = rebateData?.pyramid?.products?.length || RebateBodyItemHeight.none
    const minHeight = RebateBodyItemHeight.min
    const maxHeight = RebateBodyItemHeight.min * length
    setCurrentHeight(isRebateShow ? maxHeight : minHeight)
    setIsRebateShow(!isRebateShow)
  }

  /** 三级返佣展开与折叠 */
  const onThreeLevelChange = () => {
    const minHeight = RebateBodyItemHeight.min
    const maxHeight = RebateBodyItemHeight.min * 3
    setThreeCurrentHeight(isThreeShow ? maxHeight : minHeight)
    setIsThreeShow(!isThreeShow)
  }

  /** 获取金字塔混合模式下拉菜单 */
  const getPyramidData = async () => {
    const params = {
      pageNum: 1,
      pageSize: 6,
    }
    const { data, isOk } = await getPyramidListApiRequest(params)
    if (isOk && data) {
      const newData = data?.list?.map(item => {
        return {
          value: item.id,
          text: item.name || '--',
        }
      })
      setPyramidList(newData || [])
      setMarginType({ value: data?.list?.[RebateBodyItemHeight.none]?.id })
    }
  }

  const getFirstPyramidList = async (isShow: boolean) => {
    setApplyVisible(isShow)
    await getFirstSettingReadApiRequest({})
  }

  /** 分配金字塔比列 */
  const onApplyChange = async () => {
    if (isBlack) {
      return Toast.info(t`features_agent_invite_operation_index_qszqwghdjtbqizgrutjnu`)
    }
    setApplyVisible(false)
    const { data, isOk } = await getProductRatioApiRequest({})
    if (isOk && data) {
      const newData = data?.products?.map(item => {
        return {
          ...item,
          childRatio: RebateBodyItemHeight.none,
        }
      })
      setScaleVisible(true)
      setScaleData(newData)
    }
  }

  /** 完成金字塔分配比例 */
  const onFinishChange = async v => {
    const params = {
      ...v,
      invitationCodeId: rebateData?.id,
    }
    setSaveLoading(true)
    const { data, isOk } = await postPyramidCodeApiRequest(params)
    if (isOk && data?.isSuccess) {
      setScaleVisible(false)
      Toast.success(t`features_user_personal_center_settings_converted_currency_index_587`)
      getRebateCodeData()
    }
    setSaveLoading(false)
  }

  /** 展示金字塔分配比例 */
  const onEditChange = () => {
    if (isBlack) {
      return Toast.info(t`features_agent_invite_operation_index_qszqwghdjtbqizgrutjnu`)
    }
    setScaleVisible(true)
  }

  useEffect(() => {
    if (marginType?.value) {
      rebateData?.pyramid && getPyramidData()
      const isShow = rebateData?.pyramid?.showPyramidSetting
      isShow && getFirstPyramidList(isShow)
    }
  }, [rebateData?.pyramid, marginType?.value])

  useLayoutEffect(() => {
    getShowRatioCode()
    getRebateCodeData(true)
  }, [])

  return (
    <div className={styles['rebate-body-wrap']}>
      {rebateData?.agentLine?.length === RebateBodyItemHeight.single &&
        !rebateData?.pyramid &&
        pyramidData?.showBanner &&
        showTag?.codeVal === AgentApplyStatus.none && (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-text_color_01">{t`features_agent_agent_invitation_rebate_component_rebate_body_index_cyksy6k2c1`}</span>
            <span className="text-sm text-sell_down_color">{t`features_agent_agent_invitation_rebate_component_rebate_body_index_eqxiwf3p_g`}</span>
          </div>
        )}
      {/* 金字塔返佣 */}
      {rebateData?.pyramid && (
        <div className="pyramid-rebate">
          <div className="pyramid-rebate-header">
            <div className="pyramid-rebate-select">
              <Select
                value={marginType}
                onChange={v => {
                  onMarginTypeChange(v)
                }}
                options={pyramidList}
              >
                <Select.Item titleClass="order-type-item" name="value" options={pyramidList} />
              </Select>
            </div>
            <div className="pyramid-rebate-header-text">
              <span
                onClick={() => link(getAgentModuleRoutePath())}
              >{t`modules_agent_agent_manage_index_page_wjhkrktd_0cs7mts9x6fo`}</span>
            </div>
          </div>
          <div className="pyramid-rebate-body">
            <div className="header">
              <label>{t`features_agent_agent_invitation_rebate_component_rebate_body_index_exwks62ny4`}</label>
              <Icon name="contract_adjust_leverage" className="header-icon" onClick={onEditChange} />
            </div>
            <div className="main">
              <div className="main-wrap" style={{ height: currentHeight }}>
                {rebateData?.pyramid?.products?.map((item, index) => {
                  return (
                    <div key={index} className="item">
                      <label>{productList?.[item.productCd]?.codeKey}</label>
                      <span>
                        {t({
                          id: 'features_agent_agent_invitation_rebate_component_rebate_body_index_k0w7vsb4ib',
                          values: { 0: item?.selfRatio, 1: item?.childRatio },
                        })}
                      </span>
                    </div>
                  )
                })}
              </div>
              <Icon
                hasTheme
                className="main-icon"
                onClick={onAgentAwayChange}
                name={isRebateShow ? 'icon_agent_drop' : 'icon_agent_away'}
              />
            </div>
          </div>
        </div>
      )}
      {/* 区域返佣 */}
      {rebateData?.area && (
        <div className="regional-rebate">
          <div className="regional-rebate-header">
            <span className="regional-rebate-header-text">{t`features_agent_agent_invitation_rebate_component_rebate_body_index_oa08clv_hb`}</span>
            <div
              className="regional-rebate-header-right"
              onClick={() => {
                setLadderVisible(true)
                setCurrentMode(AgentModeStatusEnum.area)
              }}
            >
              <Icon name={`icon_agent_grade_${LevelIconType(rebateData?.area?.grade)}`} className="agent-icon" />
              <Icon name="msg" hasTheme className="msg-icon" />
            </div>
          </div>
          <div className="regional-rebate-body">
            <div className="regional-rebate-body-left">{t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101410`}</div>
            <div className="regional-rebate-body-right">{`${rebateData?.area.ratio}%`}</div>
          </div>
        </div>
      )}
      {/* 三级返佣 */}
      {rebateData?.threeLevel && (
        <div className="level-three-rebate">
          <div className="wrap-header">
            <span className="wrap-header-text">{t`features_agent_agent_invitation_rebate_component_rebate_body_index_xxuhff3fxt`}</span>
            <div
              className="wrap-header-right"
              onClick={() => {
                setLadderVisible(true)
                setCurrentMode(AgentModeStatusEnum.threeLevel)
              }}
            >
              <Icon name={`icon_agent_grade_${LevelIconType(rebateData?.threeLevel?.grade)}`} className="agent-icon" />
              <Icon name="msg" hasTheme className="msg-icon" />
            </div>
          </div>
          <div className="wrap-body-content">
            <div className="wrap-body-main" style={{ height: threeCurrentHeight }}>
              {rebateData?.threeLevel?.firstLevelRatio && (
                <div className="wrap-body">
                  <div className="wrap-body-left">{t`features_agent_agent_invitation_rebate_component_rebate_body_index_fk_vu7dx5x`}</div>
                  <div className="wrap-body-right">{`${rebateData?.threeLevel?.firstLevelRatio}%`}</div>
                </div>
              )}
              {rebateData?.threeLevel?.secondLevelRatio && (
                <div className="wrap-body">
                  <div className="wrap-body-left">{t`features_agent_agent_invitation_rebate_component_rebate_body_index_x_nvxg6c7q`}</div>
                  <div className="wrap-body-right">{`${rebateData?.threeLevel?.secondLevelRatio}%`}</div>
                </div>
              )}
              {rebateData?.threeLevel?.thirdLevelRatio && (
                <div className="wrap-body">
                  <div className="wrap-body-left">{t`features_agent_agent_invitation_rebate_component_rebate_body_index_zu75rgqsfq`}</div>
                  <div className="wrap-body-right">{`${rebateData?.threeLevel?.thirdLevelRatio}%`}</div>
                </div>
              )}
            </div>
            <Icon
              hasTheme
              className="main-icon"
              onClick={onThreeLevelChange}
              name={isThreeShow ? 'icon_agent_drop' : 'icon_agent_away'}
            />
          </div>
        </div>
      )}

      <div className="rebate-body-invite">
        <div className="rebate-body-invite-header">
          {rebateData?.invitationCode && (
            <div className="qr-wrap">
              <Icon className="qr-icon" onClick={() => setQrCodeVisible(true)} hasTheme name="asset_drawing_qr" />
            </div>
          )}
          <div className="input-row">
            <span className="input-row-text">{t`features_agent_invite_operation_index_5101456`}</span>
            <span className="text-sm font-medium">
              {rebateData?.invitationCode || '--'}
              {rebateData?.invitationCode && (
                <Icon
                  hasTheme
                  name="copy"
                  className="common-icon ml-3"
                  onClick={() => {
                    handleCopy(rebateData?.invitationCode)
                  }}
                />
              )}
            </span>
          </div>
        </div>
        <div className="rebate-body-invite-link">
          <span className="text">{t`features_agent_invite_operation_index_5101458`}</span>
          <span className="flex-1 text-sm font-medium truncate text-right">
            {rebateData?.invitationCode ? generateInviteUrl(rebateData?.invitationCode) : '--'}
          </span>
          {rebateData?.invitationCode && (
            <Icon
              hasTheme
              name="copy"
              onClick={() => {
                handleCopy(generateInviteUrl(rebateData?.invitationCode))
              }}
              className="common-icon mt-0.5 ml-3"
            />
          )}
        </div>
      </div>

      <RebateLadderPopup mode={currentMode} visible={ladderVisible} setVisible={setLadderVisible} />
      <RebateQrCodePopup
        visible={qrCodeVisible}
        setVisible={setQrCodeVisible}
        data={rebateData as AgentInviteCodeDefaultDataType}
      />
      <AgentAssignScale
        title={t`features_agent_agent_invitation_rebate_component_rebate_body_index_htustp6wyd`}
        saveLoading={saveLoading}
        editVisible={scaleVisible}
        onEditFinish={onFinishChange}
        noBackDrag={false}
        onEditClose={() => setScaleVisible(false)}
        scalesArray={rebateData?.pyramid?.products || scalceData}
        contentTip={t`features_agent_agent_invitation_rebate_component_rebate_body_index_l27dbpoe9d`}
      />
      {applyVisible && (
        <RebateApplyPopup visible={applyVisible} onChange={onApplyChange} setVisible={setApplyVisible} />
      )}
      <FullScreenLoading mask isShow={loading} className="fixed" />
    </div>
  )
}
