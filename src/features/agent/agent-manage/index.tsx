import { Button, Checkbox, Form, Input, Popup, Slider, Toast } from '@nbit/vant'
import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { QRCodeCanvas } from 'qrcode.react'

import { usePageContext } from '@/hooks/use-page-context'
import { useCopyToClipboard } from 'react-use'
import Icon from '@/components/icon'
import {
  getSlogan,
  getInvitationCodeList,
  GetProductMaxRatia,
  PostEditInvitationCodeName,
  PostSetDefaultInvitationCode,
  PostAddInvitationCode,
  PostEditInvitationCodeRatio,
  PostDelInvitationCode,
  postIsBlackUser,
} from '@/apis/agent/manage'

import useJsbridge from '@/hooks/use-jsbridge'
import { oss_svg_image_domain_address } from '@/constants/oss'
import NavBar from '@/components/navbar'
import { useLayoutStore } from '@/store/layout'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import { InviteCodeListItem, ProductsItemType } from '@/typings/api/agent/manage'
import { getCodeDetailList } from '@/apis/common'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { AgentDictionaryTypeEnum } from '@/constants/agent/common'
import { formatDate } from '@/helper/date'
import RebateQrCodePopup from '@/features/agent/agent-invitation-rebate/component/rebate-qr-code-popup'
import { AgentInviteCodeDefaultDataType } from '@/typings/api/agent/invite'
import { requestWithLoading } from '@/helper/order'
import ScaleCell from './components/scale-cell'
import Styles from './index.module.css'
import AgentAssignScale from '../common/agent-assign-scalce'
import RowCell from './components/row-cell'
import { AgentPopup } from '../common/agent-popup'
import { FriendList } from './components/friend-list'

enum IsDefault {
  default = '1',
  noDefault = '2',
}
function AgentManage() {
  const [state, copyToClipboard] = useCopyToClipboard()
  const pageContext = usePageContext()
  const reasonRef = useRef<string>('')
  const [fullScreenLoading, setFullScreenLoading] = useState<boolean>(false)
  const [editNameLoading, setEditNameLoading] = useState<boolean>(false)
  const [editRateLoading, setEditRateLoading] = useState<boolean>(false)
  const [addLoading, setAddLoading] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [addVisible, setAddVisible] = useState<boolean>(false)
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false)
  const [qrCodeVisible, setQrCodeVisible] = useState<boolean>(false)
  const [friendsVisible, setFriendsVisible] = useState<boolean>(false)
  const [editNameVisible, setEditNameVisible] = useState<boolean>(false)
  const jsbridge = useJsbridge()
  const [slogan, setSlogan] = useState('')
  const curInviteInfoRef = useRef<InviteCodeListItem | null>(null)

  const curInviteCodeRef = useRef<string>('')
  const [inviteList, setInviteList] = useState<Array<InviteCodeListItem>>([])
  const [nameValue, setNameValue] = useState<string>('')
  /** 产品线字典值列表 */
  const [productLineDictionary, setProductLineDictionary] = useState<YapiGetV1OpenapiComCodeGetCodeDetailListData[]>([])
  /** 产品线最大可分配比例 */
  const [maxRateArray, setMaxRateArray] = useState<ProductsItemType[]>([])
  /** 编辑的比例数据 */
  const [editScaleData, setEditScaleData] = useState([])
  const handleCopy = v => {
    copyToClipboard(v as string)
    state.error
      ? Toast({ message: t`user.secret_key_02`, position: 'top' })
      : Toast({ message: t`user.secret_key_01`, position: 'top' })
  }

  /** 获取列表 */
  const getListApi = () => {
    return new Promise((resolve, reject) => {
      getInvitationCodeList({
        pageNum: 1,
        pageSize: 1000,
      })
        .then(res => {
          if (res.isOk) {
            resolve(res)
            setInviteList(res.data?.list || [])
            curInviteInfoRef.current = null
          }
        })
        .finally(() => {
          reject()
        })
    })
  }
  useEffect(() => {
    /**
     * 获取产品线接口
     */
    getCodeDetailList({ codeVal: AgentDictionaryTypeEnum.agentProductCode }).then(res => {
      setProductLineDictionary(res.data || [])
    })
    /**
     * 是否黑名单
     */
    postIsBlackUser({}).then(res => {
      if (res.isOk) {
        if (res.data?.inBlacklist) {
          reasonRef.current = res.data?.reason
        }
      }
    })
    /**
     * 获取邀请码列表
     */
    requestWithLoading(getListApi(), 0)
    /**
     * 获取可分配的最大返佣比例
     */
    GetProductMaxRatia({}).then(res => {
      if (res.isOk) {
        setMaxRateArray(res.data?.products || [])
      }
    })

    getSlogan({}).then(res => {
      if (res.isOk) {
        setSlogan((res.data?.slogan as string) || '')
      }
    })
  }, [])

  /** 关闭弹窗 */
  const onAddClose = () => {
    setAddVisible(false)
  }

  const onEditClose = () => {
    setEditVisible(false)
    curInviteInfoRef.current = null
  }

  const onFriendsClose = () => {
    setFriendsVisible(false)
  }

  /** 取消编辑名称 */
  const onEditNameClose = () => {
    setEditNameVisible(false)
    setTimeout(() => {
      setNameValue('')
    }, 500)
    curInviteInfoRef.current = null
  }

  /** 打开编辑名称弹窗 */
  const openEditNamePop = item => {
    setNameValue(item?.name)
    setEditNameVisible(true)
    curInviteInfoRef.current = item
  }

  /** 确认编辑名称 */
  const confirmEditName = () => {
    setEditNameLoading(true)
    PostEditInvitationCodeName({
      name: nameValue,
      invitationCodeId: curInviteInfoRef.current?.id || '',
    }).then(res => {
      if (res.isOk) {
        setEditNameLoading(false)
        Toast({ message: t`features_agent_invite_operation_index_5101440`, position: 'top' })
        getListApi()
        setEditNameVisible(false)
        setNameValue('')
        curInviteInfoRef.current = null
      }
    })
  }

  const addAgent = () => {
    if (reasonRef.current) {
      return Toast.info({
        message: t`features_agent_agent_manage_index_mtsvvfu63ze1ndgyf9xwp`,
      })
    }
    setNameValue('')
    setAddVisible(true)
  }

  /** 删除邀请码 */
  const deleteInviteCode = item => {
    setDeleteVisible(true)
    curInviteInfoRef.current = item
  }

  /** 设为默认 */
  const setDefaultInviteCode = item => {
    PostSetDefaultInvitationCode({
      invitationCodeId: item.id,
    }).then(res => {
      if (res.isOk) {
        Toast({ message: t`features_agent_agent_manage_index_5101552`, position: 'top' })
        getListApi()
      }
    })
  }

  /** 新增 */
  const onFinish = values => {
    setAddLoading(true)
    return new Promise((resolve, reject) => {
      PostAddInvitationCode({
        ...values,
        isDefault: values.checkbox ? IsDefault.default : IsDefault.noDefault,
      })
        .then(res => {
          if (res.isOk) {
            setAddLoading(false)
            setNameValue('')
            Toast({ message: t`features_agent_agent_manage_index_5101553`, position: 'top' })
            setAddVisible(false)
            resolve(res)
            getListApi()
          }
        })
        .finally(() => {
          reject()
          setAddLoading(false)
        })
    })
  }

  /** 编辑 */
  const onEditFinish = values => {
    setEditRateLoading(true)
    PostEditInvitationCodeRatio({
      ...values,
      invitationCodeId: curInviteInfoRef.current?.id,
    }).then(res => {
      setEditRateLoading(false)
      if (res.isOk) {
        setEditRateLoading(false)
        Toast({ message: t`features_home_more_toolbar_header_toolbar_index_5101331`, position: 'top' })
        setNameValue('')
        setEditVisible(false)
        getListApi()
        curInviteInfoRef.current = null
      }
    })
  }

  /** 输入框 */
  const inputChange = (v, isFromForm?) => {
    const reg =
      /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g
    let value = ''
    if (v.match(reg)) {
      value = v.replace(reg, '')
    } else {
      value = v
    }

    setNameValue(value)
  }

  const { layoutProps } = useLayoutStore()

  /** 邀请好友 */
  const inviteFriends = item => {
    const qrcodeUrl = `https://${location.host}/${pageContext.locale}/register?invitationCode=${item.invitationCode}`
    if (jsbridge.value && jsbridge.value.call('isLogin')) {
      jsbridge.value.call('sharePoster', {
        iconUrl: '',
        title: layoutProps?.businessName,
        desc: slogan,
        imageText: t`features_agent_invite_operation_index_5101442`,
        imageUrl: `${oss_svg_image_domain_address}agent/qr_bg.png`,
        qrcodeUrl,
      })
    } else {
      copyToClipboard(qrcodeUrl)
      state.error
        ? Toast({ message: t`features_agent_invite_operation_index_5101443`, position: 'top' })
        : Toast({ message: t`features_agent_invite_operation_index_5101444`, position: 'top' })
    }
  }

  /** 打开二维码 */

  const openQRCode = item => {
    setQrCodeVisible(true)
    curInviteInfoRef.current = item
    curInviteCodeRef.current = `https://${location.host}/${pageContext.locale}/register?invitationCode=${item.invitationCode}`
  }

  const cancelDelete = () => {
    setDeleteVisible(false)
    setTimeout(() => {
      curInviteInfoRef.current = null
    })
  }

  const confirmDelete = () => {
    setDeleteLoading(true)
    PostDelInvitationCode({
      invitationCodeId: curInviteInfoRef.current?.id || '',
    }).then(res => {
      if (res.isOk) {
        setDeleteVisible(false)
        setDeleteLoading(false)
        Toast({ message: t`features_agent_agent_manage_index_5101554`, position: 'top' })
        getListApi()
      }
    })
  }

  const openFriendsPop = item => {
    curInviteInfoRef.current = item
    setFriendsVisible(true)
  }

  /** 编辑金字塔比例 */
  const openEditRatePop = item => {
    if (reasonRef.current) {
      return Toast.info({
        message: t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_referral_ratio_editor_index_ba_4ue7uns`,
      })
    }
    setEditScaleData(item.products)
    curInviteInfoRef.current = item
    setEditVisible(true)
  }

  const generateInviteUrl = invitationCode => {
    return `https://${location.host}/${pageContext.locale}/register?invitationCode=${invitationCode}`
  }
  const isDefault = 1
  return (
    <div className={Styles.scoped}>
      <NavBar title={`${t`features_agent_agent_manage_index_5101555`} (${inviteList?.length || 0} / 100)`} />

      {inviteList?.map((item, index) => {
        return (
          <div
            className="manage-wrap"
            key={index}
            style={{
              borderBottom: index === (inviteList?.length || 0) - 1 ? 'unset' : '4px solid var(--line_color_02)',
            }}
          >
            <div className="manage-row">
              <div
                className="flex items-center"
                style={{ width: Number(item.isDefault) === isDefault ? 'calc(100% - 44px)' : 'calc(100% - 122px)' }}
              >
                <div className="manage-title-text">{item.name}</div>
                <Icon
                  onClick={() => {
                    openEditNamePop(item)
                  }}
                  hasTheme
                  className="ml-2 mt-0"
                  name="rebate_edit"
                />
              </div>
              {Number(item.isDefault) === isDefault ? (
                <div className="default">{t`features_agent_agent_manage_index_5101556`}</div>
              ) : (
                <div className="set-default-wrap">
                  <div
                    className="set-default"
                    onClick={() => {
                      setDefaultInviteCode(item)
                    }}
                  >
                    {t`features_agent_agent_manage_index_5101557`}
                  </div>

                  <Icon
                    onClick={() => {
                      deleteInviteCode(item)
                    }}
                    className="back"
                    hasTheme
                    name="delete"
                  />
                </div>
              )}
            </div>
            {/* 产品线数据 */}
            {item.products.map((i, idx) => {
              const { productCd, selfRatio, childRatio } = i
              const label = productLineDictionary?.find(item => item.codeVal === productCd)?.codeKey || ''
              return (
                <ScaleCell
                  key={idx}
                  leftSlot={label}
                  myRate={selfRatio}
                  myFriendRate={childRatio}
                  openEditRatePop={() => openEditRatePop(item)}
                />
              )
            })}
            {/* 其他列表数据 */}
            {[
              {
                leftSlot: t`features_agent_invite_operation_index_5101456`,
                rightSlot: item.invitationCode,
                iconSlot: (
                  <Icon
                    onClick={() => {
                      handleCopy(item.invitationCode)
                    }}
                    hasTheme
                    className="back ml-2"
                    name="icon_agent_manage_copy"
                  />
                ),
              },
              {
                leftSlot: t`features_agent_invite_operation_index_5101458`,
                rightSlot: (
                  <div className="overflow-hidden whitespace-nowrap text-ellipsis" style={{ maxWidth: '240px' }}>
                    {generateInviteUrl(item.invitationCode)}
                  </div>
                ),
                iconSlot: (
                  <Icon
                    onClick={() => {
                      handleCopy(generateInviteUrl(item.invitationCode))
                    }}
                    hasTheme
                    className="back ml-2"
                    name="icon_agent_manage_copy"
                  />
                ),
              },
              {
                leftSlot: t`features_agent_agent_manage_index_5101558`,
                rightSlot: item.invitedNum,
                iconSlot: (
                  <Icon
                    onClick={() => {
                      openFriendsPop(item)
                    }}
                    hasTheme
                    className="back ml-2 friends"
                    name="details"
                  />
                ),
              },
              {
                leftSlot: t`assets.financial-record.creationTime`,
                rightSlot: formatDate(item?.createdByTime),
              },
              {
                leftSlot: t`features_agent_agent_manage_index_5101559`,
                rightSlot: (
                  <span
                    className="manage-brand-text"
                    onClick={() => {
                      inviteFriends(item)
                    }}
                  >
                    {t`features_agent_invite_operation_index_5101446`}
                  </span>
                ),
                iconSlot: (
                  <Icon
                    onClick={() => {
                      openQRCode(item)
                    }}
                    hasTheme
                    className="back ml-2"
                    name="asset_drawing_qr"
                  />
                ),
              },
            ].map((i, index) => {
              const { leftSlot, rightSlot, iconSlot } = i
              return <RowCell key={index} IconSlot={iconSlot} rightSlot={rightSlot} leftSlot={leftSlot} />
            })}
          </div>
        )
      })}
      {/* 底部新增 */}
      <div className="footer-operation">
        <Button onClick={addAgent} className="manage-button">
          {t`features_agent_agent_manage_index_5101550`} {inviteList?.length}/100
        </Button>
      </div>
      {/* 新增邀请码 */}
      {addVisible && (
        <AgentAssignScale
          key="add"
          title={t`features_agent_agent_manage_index_5101550`}
          editVisible={addVisible}
          onEditClose={onAddClose}
          saveLoading={addLoading}
          onEditFinish={onFinish}
          style={{ height: '622px' }}
          scalesArray={maxRateArray}
          agentProductLine={productLineDictionary}
          contentRender={content => {
            return (
              <>
                <Form.Item
                  label={
                    <div className="text-text_color_02">
                      <span className="text-sell_down_color">*</span>
                      {t`features_agent_agent_manage_index_3xqmnj_so_`}
                    </div>
                  }
                  key="name"
                  name="name"
                  className="mt-4 !mb-6"
                  rules={[{ required: true, message: t`features_agent_agent_manage_index_5101612` }]}
                >
                  <Input
                    onChange={v => inputChange(v, true)}
                    placeholder={t`features_agent_invite_operation_index_5101439`}
                    maxLength={20}
                    className="manage-name"
                    suffix={<span className="mr-3 text-xs text-text_color_04">{nameValue.length}/20</span>}
                  />
                </Form.Item>
                {content}
                <Form.Item name="checkbox" valuePropName="checked">
                  <Checkbox
                    shape="square"
                    className="default-select-icon"
                    iconRender={({ checked: isActive }) =>
                      !isActive ? (
                        <Icon hasTheme name="login_verify_unselected_disabied" />
                      ) : (
                        <Icon name="login_verify_selected" />
                      )
                    }
                  >{t`features_agent_agent_manage_index_5101557`}</Checkbox>
                </Form.Item>
              </>
            )
          }}
        />
      )}
      {/* 删除邀请码 */}
      <AgentPopup className={Styles.delete} visible={deleteVisible} onClose={cancelDelete}>
        <div className="title">{t`features_agent_agent_manage_index_5101560`}</div>
        <div className="content">
          ”{curInviteInfoRef?.current?.name}”({curInviteInfoRef?.current?.invitationCode})
          {t`features_agent_agent_manage_index_5101562`}
        </div>
        <div className="button-wrap">
          <Button onClick={cancelDelete} className="cancel-button !border-0">
            {t`assets.financial-record.cancel`}
          </Button>
          <Button onClick={confirmDelete} loading={deleteLoading} className="confirm-button">
            {t`user.field.reuse_17`}
          </Button>
        </div>
      </AgentPopup>
      {/* 邀请码显示 */}
      <RebateQrCodePopup
        visible={qrCodeVisible}
        setVisible={() => {
          setQrCodeVisible(false)
          setTimeout(() => {
            curInviteInfoRef.current = null
          }, 500)
        }}
        data={
          {
            invitationCode: curInviteInfoRef.current?.invitationCode,
            slogan,
          } as AgentInviteCodeDefaultDataType
        }
      />
      {/* 调整好友返佣比例 */}
      <AgentAssignScale
        key="edit"
        title={t`features_agent_agent_invitation_rebate_component_rebate_body_index_htustp6wyd`}
        contentTip={t`features_agent_agent_manage_index_tarctci1ds`}
        editVisible={editVisible}
        onEditClose={onEditClose}
        noBackDrag={false}
        saveLoading={editRateLoading}
        onEditFinish={onEditFinish}
        scalesArray={editScaleData}
        agentProductLine={productLineDictionary}
      />
      {/* 好友展示列表 */}
      {friendsVisible && (
        <FriendList
          onFriendsClose={onFriendsClose}
          friendsVisible={friendsVisible}
          invitationCode={curInviteInfoRef.current?.invitationCode}
        />
      )}
      {/* 编辑名称 */}
      <AgentPopup round visible={editNameVisible} className={Styles.editName} onClose={onEditNameClose}>
        <div className="title">{t`features_agent_invite_operation_index_5101489`}</div>
        <Input
          onChange={inputChange}
          placeholder={t`features_agent_invite_operation_index_5101439`}
          maxLength={20}
          value={nameValue}
          className="edit-name-input pl-3"
          suffix={<span className="mr-3 name-length">{nameValue?.length || 0}/20</span>}
        />
        <div className="button-wrap">
          <Button onClick={onEditNameClose} className="cancel-button border-0">
            {t`assets.financial-record.cancel`}
          </Button>
          <Button
            onClick={confirmEditName}
            disabled={!nameValue?.trim()?.length}
            loading={editNameLoading}
            className="confirm-button"
          >
            {t`user.field.reuse_17`}
          </Button>
        </div>
      </AgentPopup>
      {/* 全局页面 loading */}
      <FullScreenLoading isShow={fullScreenLoading} />
    </div>
  )
}

export default AgentManage
