import { t } from '@lingui/macro'
import classNames from 'classnames'

import Icon from '@/components/icon'
import { Button, Checkbox, Form, Input, Popover, PopoverInstance, Popup, Slider, Toast } from '@nbit/vant'
import { useEffect, useRef, useState } from 'react'
import { oss_svg_image_domain_address } from '@/constants/oss'
import {
  getV1AgentInvitationCodeQueryMaxApiRequest,
  postAgentInvitationCodePageUpdate,
  postInvitationCodeQuery,
  postV1AgentInvitationCodeAddRebatesApiRequest,
  postV1AgtApplicationUpdateApiRequest,
  getV1AgentInvitationCodeGetSloganApiRequest,
  getV1AgentAbnormalApiRequest,
} from '@/apis/agent'
import { usePageContext } from '@/hooks/use-page-context'

import { useCopyToClipboard } from 'react-use'
import { link } from '@/helper/link'
import { QRCodeCanvas } from 'qrcode.react'
import { YapiGetV1AgentInvitationCodePageData } from '@/typings/yapi/AgentInvitationCodePageListV1GetApi'

import { YapiGetV1AgentInvitationCodeQueryMaxData } from '@/typings/yapi/AgentInvitationCodeQueryMaxV1GetApi'

import LazyImage from '@/components/lazy-image'
import dayjs from 'dayjs'
import { useLayoutStore } from '@/store/layout'
import useJsbridge from '@/hooks/use-jsbridge'
import { useCommonStore } from '@/store/common'
import { I18nsEnum } from '@/constants/i18n'
import { AgentStatus, ApprovalStatrus, ShowBanner } from '@/constants/agent'
import { getCacheAgentBindUser, setCacheAgentBindUser } from '@/helper/agent/agent'
import { createCheckboxIconRender } from '@/components/radio/icon-render'
import Styles from './index.module.css'

const AgentCache = {
  agentBlackTime: 'agentBlackTime',
  agentPop: 'agentPop',
  agentEnterNum: 'agentEnterNum',
}

const AgentId = {
  spot: '1',
  contract: '2',
  borrow: '3',
  option: '4',
  recreation: '5',
}

function InviteOperation({
  next,
  setApplyStatus,
  maxSysRate,
  setIsAgent,
  setCurMaxRate,
  setAllData,
  setFullScreenLoading,
}: {
  next: () => void
  setApplyStatus: (v) => void
  setIsAgent: (v) => void
  setCurMaxRate: (v) => void
  setFullScreenLoading: (v) => void
  setAllData: (v) => void
  maxSysRate: {
    spot: string
    contract: string
    borrowCoin: string
  }
}) {
  const [currentChartTab, setCurrentChartTab] = useState<number>(0)
  const [state, copyToClipboard] = useCopyToClipboard()
  const [editNameLoading, setEditNameLoading] = useState<boolean>(false)
  const [editRateLoading, setEditRateLoading] = useState<boolean>(false)
  const pageContext = usePageContext()

  const jsbridge = useJsbridge()

  const [noticeVisible, setNoticeVisible] = useState<boolean>(false)
  const curInviteCodeRef = useRef<string>('')
  const checkStatusRef = useRef<boolean>(false)
  const curInviteInfoRef = useRef<YapiGetV1AgentInvitationCodePageData | null>(null)
  const popover = useRef<PopoverInstance>(null)

  const [reason, setReason] = useState<string>('')
  const reasonRef = useRef<string>('')
  const successRef = useRef<boolean>(false)

  const [blackListVisible, setBlackListVisible] = useState<boolean>(false)
  const [successVisible, setSuccessVisible] = useState<boolean>(false)
  const [allInviteCode, setAllInviteCode] = useState<YapiGetV1AgentInvitationCodeQueryMaxData | null | any>(null)
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [editNameVisible, setEditNameVisible] = useState<boolean>(false)
  const [nameValue, setNameValue] = useState<string>('')
  const [qrCodeVisible, setQrCodeVisible] = useState<boolean>(false)

  const [maxRate, setMaxRate] = useState({
    spot: '',
    contract: '',
    borrowCoin: '',
    option: '',
    recreation: '',
  })

  const [slogan, setSlogan] = useState('')

  const handleCopy = (v, type?) => {
    if (type) {
      if (allInviteCode.agtInvitationCode?.id && allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null) {
        setNoticeVisible(true)
      } else {
        copyToClipboard(v as string)
        state.error
          ? Toast({ message: t`user.secret_key_02`, position: 'top' })
          : Toast({ message: t`user.secret_key_01`, position: 'top' })
      }
    } else {
      copyToClipboard(v as string)
      state.error
        ? Toast({ message: t`user.secret_key_02`, position: 'top' })
        : Toast({ message: t`user.secret_key_01`, position: 'top' })
    }
  }

  const distributeRate = () => {
    setSuccessVisible(false)

    if (reasonRef.current) {
      return Toast.info({
        message: t`features_agent_invite_operation_index_qszqwghdjtbqizgrutjnu`,
      })
    }
    setEditVisible(true)
  }

  const onSuccessClose = () => {
    setSuccessVisible(false)
  }

  const [form] = Form.useForm()

  const [rateSum, setRateSum] = useState({
    spotSelfRate: 0,
    contractSelfRate: 0,
    borrowCoinSelfRate: 0,
  })

  // const borrowChange = v => {
  //   setRateSum({
  //     ...rateSum,
  //     borrowCoinSelfRate: v,
  //   })
  // }

  // const contractChange = v => {
  //   setRateSum({
  //     ...rateSum,
  //     contractSelfRate: v,
  //   })
  // }

  // const spotChange = v => {
  //   setRateSum({
  //     ...rateSum,
  //     spotSelfRate: v,
  //   })
  // }

  const onEditClose = () => {
    setEditVisible(false)
  }

  const onNoticeClose = () => {
    setNoticeVisible(false)
  }

  const getInviteApi = () => {
    Promise.all([getV1AgentAbnormalApiRequest({}), postInvitationCodeQuery({})])
      .then(([resBlack, res]) => {
        if (resBlack.isOk) {
          // setBlackListVisible(true)

          if (resBlack.data?.onTheBlacklist) {
            setReason(resBlack.data?.reason)
            reasonRef.current = resBlack.data?.reason
            if (!getCacheAgentBindUser(AgentCache.agentBlackTime)) {
              setBlackListVisible(true)
            } else if (dayjs().startOf('date').valueOf() > getCacheAgentBindUser(AgentCache.agentBlackTime)) {
              setBlackListVisible(true)
              setCacheAgentBindUser(AgentCache.agentBlackTime, new Date().valueOf())
            }
          }

          if (res.isOk) {
            setNameValue('')
            setAllInviteCode(res.data)
            setAllData(res.data)
            if (!getCacheAgentBindUser(AgentCache.agentPop)) {
              setTimeout(() => {
                if (popover?.current?.show) {
                  popover.current?.show()
                }
              }, 1000)
            } else {
              if (dayjs().startOf('date').valueOf() > getCacheAgentBindUser(AgentCache.agentPop)) {
                setTimeout(() => {
                  if (popover?.current?.show) {
                    popover.current?.show()
                  }
                }, 1000)
              }
            }
            if (res.data.agtInvitationCode?.id) {
              setIsAgent(true)
            } else {
              setIsAgent(false)
            }
            if (res.data.agtInvitationCode?.id && res.data.agtInvitationCode?.scaleList?.[0]?.childScale === null) {
              const enterNum = getCacheAgentBindUser(AgentCache.agentEnterNum)

              if (
                enterNum === AgentStatus.In &&
                res.data.agtApplicationResp?.approvalStatrusInd === ApprovalStatrus.approval
              ) {
                if (reasonRef.current) {
                  successRef.current = true
                } else {
                  setSuccessVisible(true)
                }

                setCacheAgentBindUser(AgentCache.agentEnterNum, AgentStatus.Out)
              } else {
                setNoticeVisible(true)
              }
            }
            if (
              res.data?.isShowBanner === ShowBanner &&
              (res.data?.agtApplicationResp?.approvalStatrusInd === null || !res.data?.agtApplicationResp) &&
              !res.data.agtInvitationCode?.id
            ) {
              setApplyStatus(true)
            }
          }
        }
      })
      .finally(() => {
        setFullScreenLoading(false)
      })
  }
  /** 获取邀请码 */
  useEffect(() => {
    // setFullScreenLoading(true)
    getInviteApi()
    getV1AgentInvitationCodeQueryMaxApiRequest({}).then(res => {
      if (res.isOk) {
        setMaxRate(res.data as YapiGetV1AgentInvitationCodeQueryMaxData as any)
        setCurMaxRate(res.data as YapiGetV1AgentInvitationCodeQueryMaxData as any)
      }
    })
    getV1AgentInvitationCodeGetSloganApiRequest({}).then(res => {
      if (res.isOk) {
        setSlogan(res.data as string)
      }
    })
  }, [])

  const agentInfomation = allInviteCode?.agtInvitationCode

  const normalInfomation = allInviteCode?.invitationCode

  const onEditFinish = values => {
    // const { spotSelfRate, contractSelfRate, borrowCoinSelfRate } = rateSum

    let rate: Array<{ productCd: string; selfScale: number; childScale: number }> = []
    if (values.spot !== undefined) {
      rate.push({
        productCd: '1',
        selfScale: Number(maxRate.spot) - values.spot,
        childScale: values.spot,
      })
    }
    if (values.contract !== undefined) {
      rate.push({
        productCd: '2',
        selfScale: Number(maxRate.contract) - values.contract,
        childScale: values.contract,
      })
    }
    if (values.coin !== undefined) {
      rate.push({
        productCd: '3',
        selfScale: Number(maxRate.borrowCoin) - values.coin,
        childScale: values.coin,
      })
    }
    if (values.option !== undefined) {
      rate.push({
        productCd: '4',
        selfScale: Number(maxRate.option) - values.option,
        childScale: values.option,
      })
    }
    if (values.recreation !== undefined) {
      rate.push({
        productCd: '5',
        selfScale: Number(maxRate.recreation) - values.recreation,
        childScale: values.recreation,
      })
    }

    setEditRateLoading(true)
    postV1AgentInvitationCodeAddRebatesApiRequest({ scales: rate })
      .then(res => {
        if (res.isOk) {
          Toast({ message: t`features_home_more_toolbar_header_toolbar_index_5101331`, position: 'top' })
          getInviteApi()
          setEditVisible(false)
        }
      })
      .finally(() => {
        setEditRateLoading(false)
      })
  }

  const onEditNameClose = () => {
    setEditNameVisible(false)
  }

  const inputChange = v => {
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

  /** 取消提示 */
  const cancelNotice = () => {
    setNoticeVisible(false)
  }

  const confirmNotice = () => {
    setNoticeVisible(false)
    if (reasonRef.current) {
      return Toast.info({
        message: t`features_agent_invite_operation_index_qszqwghdjtbqizgrutjnu`,
      })
    }

    setEditVisible(true)
    form.setFieldsValue({
      spot: 0,
      contract: 0,
      coin: 0,
      option: 0,
      recreation: 0,
    })
  }

  /** 打开编辑名称弹窗 */
  const openEditNamePop = (type?) => {
    if (type) {
      if (allInviteCode.agtInvitationCode?.id && allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null) {
        setNoticeVisible(true)
      } else {
        setNameValue(allInviteCode.agtInvitationCode?.invitationCodeName)
        setEditNameVisible(true)
      }
    } else {
      setNameValue(allInviteCode.agtInvitationCode?.invitationCodeName)
      setEditNameVisible(true)
    }
  }

  /** 取消编辑名称 */
  const cancelEditName = () => {
    setEditNameVisible(false)
    setTimeout(() => {
      setNameValue('')
    }, 500)
  }

  /** 确认编辑名称 */
  const confirmEditName = () => {
    setEditNameLoading(true)
    postAgentInvitationCodePageUpdate({
      id: agentInfomation?.id,
      invitationCode: agentInfomation?.invitationCode,
      invitationCodeName: nameValue,
    }).then(res => {
      if (res.isOk) {
        setEditNameLoading(false)
        Toast({ message: t`features_agent_invite_operation_index_5101440`, position: 'top' })
        getInviteApi()
        setEditNameVisible(false)
      }
    })
  }
  // imgWebLogo
  const { headerData, layoutProps } = useLayoutStore()

  /** 邀请好友 */
  const inviteFriends = (item, type?) => {
    if (type) {
      if (allInviteCode.agtInvitationCode?.id && allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null) {
        setNoticeVisible(true)
      } else {
        const qrcodeUrl = `https://${location.host}/${pageContext.locale}/register?invitationCode=${item.invitationCode}`

        if (jsbridge.value && jsbridge.value?.call('isLogin')) {
          jsbridge.value?.call('sharePoster', {
            iconUrl: '',
            // title: 'MONKEY Global',
            title: layoutProps?.businessName,
            // desc: t`features_agent_invite_operation_index_5101441`,
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
    } else {
      const qrcodeUrl = `https://${pageContext.host}/${pageContext.locale}/register?invitationCode=${item.invitationCode}`

      if (jsbridge.value && jsbridge.value?.call('isLogin')) {
        jsbridge.value?.call('sharePoster', {
          iconUrl: '',
          // title: 'MONKEY Global',
          title: layoutProps?.businessName,
          // desc: t`features_agent_invite_operation_index_5101441`,
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
  }

  /** 打开二维码 */
  const openQRCode = (item, type?) => {
    if (type) {
      if (allInviteCode.agtInvitationCode?.id && allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null) {
        setNoticeVisible(true)
      } else {
        setQrCodeVisible(true)
        curInviteInfoRef.current = item

        curInviteCodeRef.current = `https://${location.host}/${pageContext.locale}/register?invitationCode=${item.invitationCode}`
      }
    } else {
      setQrCodeVisible(true)
      curInviteInfoRef.current = item

      curInviteCodeRef.current = `https://${location.host}/${pageContext.locale}/register?invitationCode=${item.invitationCode}`
    }
  }

  const generateInviteUrl = invitationCode => {
    return `https://${location.host}/${pageContext.locale}/register?invitationCode=${invitationCode}`
  }

  Form.useWatch('spot', form)
  Form.useWatch('contract', form)
  Form.useWatch('coin', form)
  Form.useWatch('option', form)
  Form.useWatch('recreation', form)

  const spotSelfScale = maxRate?.spot ? { selfScale: maxRate?.spot } : null
  const contractSelfScale = maxRate?.contract ? { selfScale: maxRate?.contract } : null
  const coinSelfScale = maxRate?.borrowCoin ? { selfScale: maxRate?.borrowCoin } : null
  const optionSelfScale = maxRate?.option ? { selfScale: maxRate?.option } : null
  const recreationSelfScale = maxRate?.recreation ? { selfScale: maxRate?.recreation } : null
  // const rate = `${Math.max(Number(maxSysRate.spot), Number(maxSysRate.borrowCoin), Number(maxSysRate.contract)) || ''}%`
  const tip = t({
    id: 'features_agent_invite_operation_index_ob4ne4hdoc',
    values: { 0: headerData?.businessName },
  })

  const commonState = useCommonStore()

  const checkChange = value => {
    checkStatusRef.current = value
  }

  return (
    <div className={Styles.scoped}>
      <div className="invite-info">
        <div className="friend over-hid">
          {t`features_agent_invite_operation_index_5101446`} {t`features_agent_invite_operation_index_5101447`}
        </div>
        <div className="money">{tip}</div>
        <div className="pyramid" onClick={next}>
          {t`features_agent_invite_operation_index_5101452`} <Icon className="pyramid-icon" name="next_arrow" />
        </div>
      </div>
      <div
        className="process-wrap"
        style={{
          height: commonState?.locale !== I18nsEnum['zh-HK'] ? '146px' : '108px',
        }}
      >
        <div
          className="process"
          style={{
            height: commonState?.locale !== I18nsEnum['zh-HK'] ? '98px' : '70px',
          }}
        >
          <Icon onClick={() => {}} hasTheme className="common-icon" name="rebate_icon_invitation" />
          <span className="text-center">{t`features_agent_invite_operation_index_5101620`}</span>
          <span style={{ marginTop: 0 }} className="text-center">
            {t`features_agent_invite_operation_index_5101621`}
          </span>
        </div>
        <div className="line"></div>
        <div
          className="process"
          style={{
            height: commonState?.locale !== I18nsEnum['zh-HK'] ? '98px' : '70px',
          }}
        >
          <Icon onClick={() => {}} hasTheme className="common-icon" name="rebate_icon_registration" />
          <span className="text-center">{t`features_agent_invite_operation_index_5101454`}</span>
        </div>
        <div className="line"></div>
        <div
          className="process width-set"
          style={{
            height: commonState?.locale !== I18nsEnum['zh-HK'] ? '98px' : '70px',
          }}
        >
          <Icon onClick={() => {}} hasTheme className="common-icon" name="rebate_icon_transaction" />
          <span className="text-center">{t`features_agent_invite_operation_index_5101455`}</span>
        </div>
      </div>
      <div className="relative w-full overflow-x-hidden">
        <div className="decorate-left"></div>
        <div className="decorate-right"></div>
        <div className="form-wrap">
          <div className="manage">
            {!allInviteCode?.agtInvitationCode?.id ? (
              <div
                className={classNames('tab', 'tab1-active', 'over-hid')}
              >{t`features_agent_invite_operation_index_5101456`}</div>
            ) : (
              <div className="tab-wrap">
                <div
                  className={classNames('tab', 'over-hid', {
                    'tab0-active': currentChartTab === 0,
                  })}
                  onClick={() => {
                    setCurrentChartTab(0)
                  }}
                >
                  {t`features_agent_invite_operation_index_5101457`}
                </div>
                <div
                  className={classNames('tab', 'over-hid', {
                    'tab1-active': currentChartTab === 1,
                  })}
                  onClick={() => {
                    setCurrentChartTab(1)
                  }}
                >
                  {t`features_agent_invite_operation_index_5101456`}
                </div>
              </div>
            )}
            {!allInviteCode?.agtInvitationCode?.id || currentChartTab === 1 ? null : (
              <div
                onClick={() => {
                  if (
                    allInviteCode.agtInvitationCode?.id &&
                    allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null
                  ) {
                    setNoticeVisible(true)
                  } else {
                    link('/agent/manage')
                  }
                }}
                className="go-manage"
              >
                {t`features_agent_invite_operation_index_5101445`}
              </div>
            )}
          </div>

          <div className="form-content">
            {currentChartTab === 0 && allInviteCode?.agtInvitationCode?.id ? (
              <div className="content-wrap">
                <div className="input-row">
                  <span>{t`features_agent_invite_operation_index_5101437`}</span>
                  <span className="font-semibold">
                    {agentInfomation?.invitationCodeName?.length > 8
                      ? `${agentInfomation?.invitationCodeName?.substring(0, 8)}...`
                      : agentInfomation?.invitationCodeName}
                    <span>
                      <Icon
                        onClick={() => {
                          openEditNamePop('agent')
                        }}
                        className="common-icon ml-2"
                        hasTheme
                        name="rebate_edit"
                      />
                    </span>
                  </span>
                </div>
                <div className="input-row mt-4">
                  <span>{t`features_agent_invite_operation_index_5101456`}</span>
                  <span className="flex items-center">
                    <span
                      className={classNames('overflow-hidden whitespace-nowrap text-ellipsis font-semibold', {
                        'text-brand_color':
                          allInviteCode.agtInvitationCode?.id &&
                          allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null,
                      })}
                      style={{ maxWidth: '156px' }}
                    >
                      {allInviteCode.agtInvitationCode?.id &&
                      allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null ? (
                        <span
                          onClick={confirmNotice}
                          className="text-brand_color"
                        >{t`features_agent_invite_operation_index_tm9cr5vyw56xuiwuydxbb`}</span>
                      ) : (
                        agentInfomation?.invitationCode
                      )}
                    </span>

                    <Icon
                      onClick={() => {
                        handleCopy(agentInfomation?.invitationCode, 'agent')
                      }}
                      className="common-icon ml-3"
                      hasTheme
                      name="copy"
                    />
                  </span>
                </div>
                <div className="input-row mt-4">
                  <span>{t`features_agent_invite_operation_index_5101458`}</span>
                  <span className="flex items-center">
                    <span
                      className={classNames('overflow-hidden whitespace-nowrap text-ellipsis font-semibold', {
                        'text-brand_color':
                          allInviteCode.agtInvitationCode?.id &&
                          allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null,
                      })}
                      style={{ maxWidth: '156px' }}
                    >
                      {allInviteCode.agtInvitationCode?.id &&
                      allInviteCode.agtInvitationCode?.scaleList?.[0]?.childScale === null ? (
                        <span
                          onClick={confirmNotice}
                          className="text-brand_color"
                        >{t`features_agent_invite_operation_index_tm9cr5vyw56xuiwuydxbb`}</span>
                      ) : (
                        generateInviteUrl(agentInfomation?.invitationCode)
                      )}
                    </span>
                    <Icon
                      onClick={() => {
                        handleCopy(generateInviteUrl(agentInfomation?.invitationCode), 'agent')
                      }}
                      hasTheme
                      className="common-icon ml-3"
                      name="copy"
                    />
                  </span>
                </div>
                <div className="button-wrap">
                  <Popover
                    ref={popover}
                    closeOnClickOutside={false}
                    placement="top"
                    trigger="manual"
                    className={Styles.popOnce}
                    reference={
                      <Button
                        className="invite-button"
                        type="primary"
                        onClick={() => {
                          inviteFriends(agentInfomation, 'agent')
                        }}
                      >
                        {t`features_agent_invite_operation_index_5101446`}
                      </Button>
                    }
                  >
                    <div className="relative">
                      <Icon
                        onClick={() => {
                          popover.current?.hide()
                          setCacheAgentBindUser(AgentCache.agentPop, new Date().valueOf())
                        }}
                        className="close-icon"
                        name="close_black"
                      />

                      {agentInfomation?.scaleList?.map((item, index) => {
                        if (item.productCd === AgentId.spot) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_5101459`}{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`}{' '}
                              {Number(item.selfScale)}% /{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                              {Number(item.childScale)}%
                            </div>
                          )
                        }
                        if (item.productCd === AgentId.contract) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_5101460`}{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`}{' '}
                              {Number(item.selfScale)}% /{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                              {Number(item.childScale)}%
                            </div>
                          )
                        }

                        if (item.productCd === AgentId.borrow) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_5101461`}{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`}{' '}
                              {Number(item.selfScale)}% /{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                              {Number(item.childScale)}%
                            </div>
                          )
                        }

                        if (item.productCd === AgentId.option) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_qsbmddpdyj`}{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`}{' '}
                              {Number(item.selfScale)}% /{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                              {Number(item.childScale)}%
                            </div>
                          )
                        }

                        if (item.productCd === AgentId.recreation) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_mixmmdygdh`}{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101408`}{' '}
                              {Number(item.selfScale)}% /{' '}
                              {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                              {Number(item.childScale)}%
                            </div>
                          )
                        }

                        return null
                      })}
                    </div>
                  </Popover>
                  <div className="qr-wrap">
                    <Icon
                      className="qr-icon"
                      onClick={() => {
                        openQRCode(agentInfomation, 'agent')
                      }}
                      hasTheme
                      name="asset_drawing_qr"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="content-wrap">
                <div className="input-row">
                  <span>{t`features_agent_invite_operation_index_5101456`}</span>
                  <span className="font-semibold">
                    {normalInfomation?.invitationCode}
                    <Icon
                      onClick={() => {
                        handleCopy(normalInfomation?.invitationCode)
                      }}
                      className="common-icon ml-3"
                      hasTheme
                      name="copy"
                    />
                  </span>
                </div>
                <div className="input-row mt-4">
                  <span>{t`features_agent_invite_operation_index_5101458`}</span>
                  <span className="flex items-center">
                    <span
                      className="overflow-hidden whitespace-nowrap text-ellipsis font-semibold"
                      style={{ maxWidth: '156px' }}
                    >
                      {generateInviteUrl(normalInfomation?.invitationCode)}
                    </span>

                    <Icon
                      onClick={() => {
                        handleCopy(generateInviteUrl(normalInfomation?.invitationCode))
                      }}
                      className="common-icon ml-3"
                      hasTheme
                      name="copy"
                    />
                  </span>
                </div>
                <div className="button-wrap">
                  <Popover
                    ref={popover}
                    closeOnClickOutside={false}
                    trigger={'manual'}
                    placement="top"
                    className={Styles.popOnce}
                    reference={
                      <Button
                        className="invite-button"
                        onClick={() => {
                          inviteFriends(normalInfomation)
                        }}
                        type="primary"
                      >
                        {t`features_agent_invite_operation_index_5101446`}
                      </Button>
                    }
                  >
                    <div className="relative">
                      <Icon
                        onClick={() => {
                          popover.current?.hide()
                          setCacheAgentBindUser(AgentCache.agentPop, new Date().valueOf())
                        }}
                        className="close-icon"
                        name="close_black"
                      />
                      {normalInfomation?.scaleList?.map((item, index) => {
                        if (item.productCd === AgentId.spot) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_5101459`} {Number(item.selfScale)}%
                            </div>
                          )
                        }
                        if (item.productCd === AgentId.contract) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_5101460`} {Number(item.selfScale)}%
                            </div>
                          )
                        }

                        if (item.productCd === AgentId.borrow) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_5101461`} {Number(item.selfScale)}%
                            </div>
                          )
                        }

                        if (item.productCd === AgentId.option) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_qsbmddpdyj`} {Number(item.selfScale)}%
                            </div>
                          )
                        }

                        if (item.productCd === AgentId.recreation) {
                          return (
                            <div
                              key={index}
                              className={classNames('text-sm', {
                                'mt-2': index,
                              })}
                            >
                              {t`features_agent_invite_operation_index_mixmmdygdh`} {Number(item.selfScale)}%
                            </div>
                          )
                        }

                        return null
                      })}
                    </div>
                  </Popover>
                  <div className="qr-wrap">
                    <Icon
                      className="qr-icon"
                      onClick={() => {
                        openQRCode(normalInfomation)
                      }}
                      hasTheme
                      name="asset_drawing_qr"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {allInviteCode?.isShowBanner === ShowBanner &&
        allInviteCode?.agtApplicationResp?.approvalStatrusInd === ApprovalStatrus.unApply &&
        !agentInfomation?.id && (
          <div
            className="apply-result"
            style={{
              height: commonState?.locale !== I18nsEnum['zh-HK'] ? 'auto' : '40px',
            }}
            onClick={() => {
              link('/agent/result/1')
            }}
          >
            <span>
              <span>
                {t`features_agent_invite_operation_index_5101462`}
                <span className="text-brand_color">{t`features_agent_invite_operation_index_5101463`}</span>
                {t`features_agent_invite_operation_index_5101464`}
              </span>
              <Icon name="next_arrow" />
            </span>
            <LazyImage className="apply-img" src={`${oss_svg_image_domain_address}agent/img_under_review.png`} />
          </div>
        )}

      {allInviteCode?.isShowBanner === ShowBanner &&
        (allInviteCode?.agtApplicationResp?.approvalStatrusInd === null || !allInviteCode?.agtApplicationResp) &&
        !agentInfomation?.id && (
          <div
            className="apply-result"
            style={{
              height: commonState?.locale !== I18nsEnum['zh-HK'] ? 'auto' : '40px',
            }}
            onClick={() => {
              if (reasonRef.current) {
                return Toast.info({
                  message: t`features_agent_invite_operation_index_9ztacudqsqj7xltpyse3_`,
                })
              }
              link('/agent/apply')
            }}
          >
            <span>
              <span>{t`features_agent_invite_operation_index_5101465`}</span>
              <span className="text-brand_color">{t`features_agent_invite_operation_index_5101466`}</span>
              <Icon name="next_arrow" />
            </span>
            <LazyImage className="apply-img" src={`${oss_svg_image_domain_address}agent/img_apply.png`} />
          </div>
        )}

      {allInviteCode?.isShowBanner === ShowBanner &&
        allInviteCode?.agtApplicationResp?.approvalStatrusInd === ApprovalStatrus.refuse &&
        !agentInfomation?.id && (
          <div
            className="apply-result"
            style={{
              height: commonState?.locale !== I18nsEnum['zh-HK'] ? 'auto' : '40px',
            }}
            onClick={() => {
              if (allInviteCode?.agtApplicationResp?.approvalStatrusInd === ApprovalStatrus.refuse) {
                postV1AgtApplicationUpdateApiRequest({
                  id: allInviteCode?.agtApplicationResp?.id,
                }).then(res => {
                  if (res.isOk) {
                    link('/agent/result/2')
                  }
                })
              }
            }}
          >
            <span>
              <span>
                {t`features_agent_invite_operation_index_5101462`}
                <span className="text-sell_down_color">{t`features_agent_invite_operation_index_5101467`}</span>
                {t`features_agent_invite_operation_index_5101468`}
              </span>
              <Icon name="next_arrow" />
            </span>
            <LazyImage className="apply-img" src={`${oss_svg_image_domain_address}agent/img_failed.png`} />
          </div>
        )}
      {/* 申请通过 */}
      <Popup
        visible={successVisible}
        className={Styles.success}
        style={{ width: '298px', zIndex: 9000 }}
        onClose={onSuccessClose}
      >
        <div
          className="title-wrap"
          style={{
            backgroundImage: `url(${oss_svg_image_domain_address}agent/pop_up_bj.png)`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <div className="title">{t`features_agent_invite_operation_index_5101469`}</div>
        </div>
        <div className="bg-brand_color p-4 box-border rounded-lg" style={{ marginTop: '-70px', paddingTop: 0 }}>
          <div className="content-wrap">
            <div>
              {t`features_agent_invite_operation_index_5101470`}
              <span className="text-brand_color">{t`features_agent_invite_operation_index_5101471`}</span>
            </div>
            <div className="mt-2">
              {t`features_agent_invite_operation_index_5101472`}
              <span className="text-brand_color">
                {spotSelfScale ? (
                  <span>
                    {t`features_agent_invite_operation_index_5101473`} {`${spotSelfScale?.selfScale}%`}
                  </span>
                ) : null}
                {contractSelfScale ? (
                  <span>
                    {t`features_agent_invite_operation_index_5101474`} {`${contractSelfScale?.selfScale}%`}
                  </span>
                ) : null}
                {coinSelfScale ? (
                  <span>
                    {t`features_agent_invite_operation_index_5101475`} {`${coinSelfScale?.selfScale}%`}
                  </span>
                ) : null}
                {optionSelfScale ? (
                  <span>
                    {t`features_agent_invite_operation_index_kwc2bujro4`} {`${optionSelfScale?.selfScale}%`}
                  </span>
                ) : null}
                {recreationSelfScale ? (
                  <span>
                    {t`features_agent_invite_operation_index_ic7wqwfwcm`} {`${recreationSelfScale?.selfScale}%`}
                  </span>
                ) : null}
                {t`features_agent_invite_operation_index_5101476`}
              </span>
              {t`features_agent_invite_operation_index_5101477`}
            </div>
            <div className="mt-3">{t`features_agent_invite_operation_index_5101478`}</div>
            <div className="mt-3">
              {t`features_agent_invite_operation_index_5101479`} {t`features_agent_invite_operation_index_5101480`}
            </div>
            <Button onClick={distributeRate} className="confirm-button mt-4">
              {t`features_agent_invite_operation_index_5101481`}
            </Button>
          </div>
        </div>

        <Icon className="agent-pop-close" onClick={onSuccessClose} name="agent_popup_close" />
      </Popup>

      <Popup
        title={t`features_agent_invite_operation_index_5101438`}
        visible={editVisible}
        className={Styles.pop}
        style={{ zIndex: 9000 }}
        closeable
        position="bottom"
        onClose={onEditClose}
      >
        <Form
          layout="vertical"
          form={form}
          className="form-wrap"
          onFinish={onEditFinish}
          footer={
            <div style={{ margin: '24px 16px 16px 16px' }}>
              <Button className="submit-button" loading={editRateLoading} nativeType="submit" type="primary" block>
                {t`features_agent_invite_operation_index_5101482`}
              </Button>
            </div>
          }
        >
          <div className="title">{t`features_agent_invite_operation_index_5101628`}</div>
          {spotSelfScale && (
            <>
              <Form.Item
                name="spot"
                label={
                  <span>
                    {t`features_agent_invite_operation_index_5101485`}
                    <span className="text-brand_color">{Number(maxRate.spot)}%</span>
                  </span>
                }
                initialValue={0}
              >
                <Slider max={Number(maxRate.spot)} />
              </Form.Item>
              <div className="px-4 mb-1 flex justify-between manage-form-text">
                <span>
                  {t`features_agent_invite_operation_index_5101486`} {Number(maxRate.spot) - form.getFieldValue('spot')}
                  %
                </span>
                <span>
                  {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                  {form.getFieldValue('spot')}%
                </span>
              </div>
            </>
          )}

          {contractSelfScale && (
            <>
              <Form.Item
                name="contract"
                label={
                  <span>
                    {t`features_agent_invite_operation_index_5101487`}
                    <span className="text-brand_color">{Number(maxRate.contract)}%</span>
                  </span>
                }
                initialValue={0}
              >
                <Slider max={Number(maxRate.contract)} />
              </Form.Item>
              <div className="px-4 mb-1 flex justify-between manage-form-text">
                <span>
                  {t`features_agent_invite_operation_index_5101486`}
                  {Number(maxRate.contract) - form.getFieldValue('contract')}%
                </span>
                <span>
                  {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                  {form.getFieldValue('contract')}%
                </span>
              </div>
            </>
          )}

          {coinSelfScale && (
            <>
              <Form.Item
                name="coin"
                label={
                  <span>
                    {t`features_agent_invite_operation_index_5101488`}
                    <span className="text-brand_color">{Number(maxRate.borrowCoin)}%</span>
                  </span>
                }
                initialValue={0}
              >
                <Slider max={Number(maxRate.borrowCoin)} />
              </Form.Item>
              <div className="px-4 flex justify-between manage-form-text">
                <span>
                  {t`features_agent_invite_operation_index_5101486`}{' '}
                  {Number(maxRate.borrowCoin) - form.getFieldValue('coin')}%
                </span>
                <span>
                  {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                  {form.getFieldValue('coin')}%
                </span>
              </div>
            </>
          )}

          {optionSelfScale && (
            <>
              <Form.Item
                name="option"
                label={
                  <span>
                    {t`features_agent_invite_operation_index_cptnuax5vw`}
                    <span className="text-brand_color">{Number(maxRate.option)}%</span>
                  </span>
                }
                initialValue={0}
              >
                <Slider max={Number(maxRate.option)} />
              </Form.Item>
              <div className="px-4 flex justify-between manage-form-text">
                <span>
                  {t`features_agent_invite_operation_index_5101486`}{' '}
                  {Number(maxRate.option) - form.getFieldValue('option')}%
                </span>
                <span>
                  {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                  {form.getFieldValue('option')}%
                </span>
              </div>
            </>
          )}

          {recreationSelfScale && (
            <>
              <Form.Item
                name="recreation"
                label={
                  <span>
                    {t`features_agent_invite_operation_index_cugeb1rq4e`}
                    <span className="text-brand_color">{Number(maxRate.recreation)}%</span>
                  </span>
                }
                initialValue={0}
              >
                <Slider max={Number(maxRate.recreation)} />
              </Form.Item>
              <div className="px-4 flex justify-between manage-form-text">
                <span>
                  {t`features_agent_invite_operation_index_5101486`}{' '}
                  {Number(maxRate.recreation) - form.getFieldValue('recreation')}%
                </span>
                <span>
                  {t`features_agent_agent_invite_invite_info_invite_info_content_list_item_index_5101409`}{' '}
                  {form.getFieldValue('recreation')}%
                </span>
              </div>
            </>
          )}
        </Form>
      </Popup>

      {/* 编辑名称 */}
      <Popup visible={editNameVisible} style={{ zIndex: 9000 }} className={Styles.editName} onClose={onEditNameClose}>
        <div className="title">{t`features_agent_invite_operation_index_5101489`}</div>
        <Input
          onChange={inputChange}
          value={nameValue}
          placeholder={t`features_agent_invite_operation_index_5101439`}
          maxLength={20}
          className="edit-name-input pl-3"
          suffix={<span className="mr-3 text-xs text-text_color_04">{nameValue.length}/20</span>}
        />
        <div className="button-wrap">
          <Button onClick={cancelEditName} className="cancel-button">
            {t`assets.financial-record.cancel`}
          </Button>
          <Button
            disabled={!nameValue?.trim()?.length}
            type="primary"
            onClick={confirmEditName}
            loading={editNameLoading}
            className="confirm-button"
          >
            {t`features_trade_future_c2c_225101584`}
          </Button>
        </div>
      </Popup>

      <Popup
        visible={noticeVisible}
        className={Styles.notice}
        style={{ width: '298px', zIndex: 9000 }}
        onClose={onNoticeClose}
      >
        <div className="title">{t`features_agent_invite_operation_index_5101490`}</div>
        <div className="content">{t`features_agent_invite_operation_index_5101491`}</div>
        <div className="button-wrap">
          <Button onClick={cancelNotice} className="cancel-button">
            {t`assets.financial-record.cancel`}
          </Button>
          <Button onClick={confirmNotice} className="confirm-button">
            {t`user.pageContent.title_12`}
          </Button>
        </div>
      </Popup>

      <Popup
        className={Styles.qrCode}
        // style={{
        //   backgroundImage: `url(${oss_svg_image_domain_address}agent/apply_agent_bj.png)`,
        //   backgroundRepeat: 'repeat',
        //   backgroundSize: 'contain',
        // }}
        style={{ zIndex: 9000 }}
        visible={qrCodeVisible}
        onClose={() => {
          setQrCodeVisible(false)
          setTimeout(() => {
            curInviteInfoRef.current = null
          }, 500)
        }}
      >
        <div className="title">
          <Icon className="back mr-2" name="user_head_hover" />
          {layoutProps?.businessName}
        </div>
        <div className="content">{slogan}</div>
        <div className="qr-wrap mt-5">
          <div className="mb-4">
            <QRCodeCanvas size={248} value={curInviteCodeRef.current} />
          </div>
          <div className="button-wrap">
            <span className="label">{t`features_agent_invite_operation_index_5101456`}</span>
            <span className="value">{curInviteInfoRef.current?.invitationCode}</span>
          </div>
        </div>
      </Popup>

      <Popup
        className={Styles.blackList}
        style={{ zIndex: 9999, width: '298px' }}
        visible={blackListVisible}
        closeOnClickOverlay={false}
        onClose={() => {
          setBlackListVisible(false)
          // setTimeout(() => {
          //   curInviteInfoRef.current = null
          // }, 500)
        }}
      >
        <div className="title">{t`features_agent_invite_operation_index_dja-jgl1z4brh3r5y8t5_`}</div>
        <div className="title">{t`features_agent_invite_operation_index_qzy5jhzyx1rwycyjppmq8`}</div>
        <div className="title mt-2">{t`features_agent_invite_operation_index_eu-cizew0z1ynwb_8zwom`}</div>
        <div className="reason">{reason}</div>
        <div className="title mt-2"> {t`features_agent_invite_operation_index_fwwyt3avqndf7ucojxq4a`}</div>
        <Checkbox
          iconRender={createCheckboxIconRender('text-sm')}
          shape="square"
          onChange={checkChange}
          className="mt-4 text-xs text-text_color_03"
        >
          {t`features_agent_invite_operation_index_xjkihaow30q7x4gljwjw3`}
        </Checkbox>
        <Button
          type="primary"
          onClick={() => {
            setBlackListVisible(false)
            if (checkStatusRef.current) {
              setCacheAgentBindUser(AgentCache.agentBlackTime, new Date().valueOf())
            }
            if (successRef.current) {
              setSuccessVisible(true)
            }
          }}
          className="confirm-button mt-4"
        >{t`features_message_center_index_5101365`}</Button>
      </Popup>
    </div>
  )
}

export default InviteOperation
