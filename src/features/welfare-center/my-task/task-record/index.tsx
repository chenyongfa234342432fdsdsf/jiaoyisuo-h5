/** 卡劵中心 */
import NavBar from '@/components/navbar'
import classNames from 'classnames'
import { Popover, Tabs } from '@nbit/vant'
import React, { useEffect, useState } from 'react'
import Icon from '@/components/icon'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import { useMount } from 'ahooks'
import { requestWithLoading } from '@/helper/order'
import { t } from '@lingui/macro'
import CommonList from '@/components/common-list/list'
import { YapiGetV1OpenapiComCodeGetCodeDetailListData } from '@/typings/yapi/OpenapiComCodeGetCodeDetailListV1GetApi'
import { getCodeDetailList } from '@/apis/common'
import { getV1WelfareMissionRecordsApiRequest } from '@/apis/welfare-center'
import { link } from '@/helper/link'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { CompleteSchedule, TaskRecordTypeCode, TaskTypeCode } from '@/constants/welfare-center/common'
import styles from './index.module.css'

enum welfare_achievments_mission_condition_options {
  mobile_bind = 'mobile_bind',
  account_security_authorized = 'account_security_authorized',
  mobile_notification_on = 'mobile_notification_on',
  kyc_authorized = 'kyc_authorized',
}

enum welfare_common_condition_scene_options {
  spot_fee = 'spot_fee',
  contract_fee = 'contract_fee',
  contract_transfer = 'contract_transfer',
  spot_goods = 'spot_goods',
  transfer_input = 'transfer_input',
}

enum CompareCondition {
  gt = '≥',

  lt = '<',
  eq = '=',
  ge = '>',
  le = '≤',
}

enum issueStatusCode {
  not_issued = 'not_issued',
  issued = 'issued',
}

export default function TaskRecord() {
  const [tipVisible, setTipVisible] = useState(false)
  const { fetchWelfareCenterDictionaryEnums, fetchCouponCount, voucherCenterData, setHasNew } = useBaseWelfareCenter()
  const getPageData = async () => {
    await fetchWelfareCenterDictionaryEnums()
    await fetchCouponCount()
  }
  useMount(() => {
    requestWithLoading(getPageData(), 0)
  })

  const [currentTab, setCurrentTab] = useState<string>(CompleteSchedule.completed)

  const [historyFinished, setHistoryFinished] = useState<boolean>(false)
  const [historyPositionList, setHistoryPositionList] = useState<any>([])

  const [pageNum, setPageNum] = useState(1)

  const [businessScene, setBusinessScene] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [couponType, setCouponType] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [couponCode, setCouponCode] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [status, setStatus] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [taskTypeCode, setTaskTypeCode] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [condition, setCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [missionCondition, setMissionCondition] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])

  const [userMission, setUserMission] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])
  const [issueStatus, setIssueStatus] = useState<Array<YapiGetV1OpenapiComCodeGetCodeDetailListData>>([])

  const onLoadHistory = async (isRefresh?: boolean) => {
    const params = {
      status: currentTab === CompleteSchedule.completed ? TaskRecordTypeCode.finished : TaskRecordTypeCode.undone,
      pageNum: isRefresh ? 1 : pageNum,
      pageSize: 20,
    }

    const res = await getV1WelfareMissionRecordsApiRequest(params as any)

    const { isOk, data } = res || {}
    if (!isOk || !data) {
      setHistoryFinished(true)
      return
    }

    const nList = isRefresh ? data.list : [...historyPositionList, ...data.list]
    setHistoryFinished(nList.length >= +data?.total)
    setHistoryPositionList(nList)

    setPageNum(isRefresh ? 1 : pageNum + 1)
  }

  useEffect(() => {
    requestWithLoading(onLoadHistory(true), 0)
  }, [currentTab])

  useEffect(() => {
    Promise.all([
      /** 使用场景枚举 */
      getCodeDetailList({ codeVal: 'business_scene' }),
      /** 卡券分类枚举 */
      getCodeDetailList({ codeVal: 'coupon_type_cd' }),
      /** 卡券类型枚举 */
      getCodeDetailList({ codeVal: 'coupon_name_cd' }),
      /** 优惠券状态字典 */
      getCodeDetailList({ codeVal: 'status' }),
      /** 任务类型枚举 */
      getCodeDetailList({ codeVal: 'welfare_mission_type_code' }),
      /** 条件 */
      getCodeDetailList({ codeVal: 'welfare_common_condition_scene_options' }),
      getCodeDetailList({ codeVal: 'welfare_achievments_mission_condition_options' }),
      getCodeDetailList({ codeVal: 'user_mission_status_cd' }),
      getCodeDetailList({ codeVal: 'issue_status_code' }),
    ]).then(
      ([
        businessSceneRes,
        couponTypeRes,
        couponCodeRes,
        statusRes,
        taskTypeCodeRes,
        conditionRes,
        missionConditionRes,
        userMissionRes,
        issueStatusRes,
      ]) => {
        if (businessSceneRes.isOk) {
          setBusinessScene(businessSceneRes.data || [])
        }

        if (couponTypeRes.isOk) {
          setCouponType(couponTypeRes.data || [])
        }

        if (couponCodeRes.isOk) {
          setCouponCode(couponCodeRes.data || [])
        }

        if (statusRes.isOk) {
          setStatus(statusRes.data || [])
        }

        if (taskTypeCodeRes.isOk) {
          setTaskTypeCode(taskTypeCodeRes.data || [])
        }

        if (conditionRes.isOk) {
          setCondition(conditionRes.data || [])
        }

        if (missionConditionRes.isOk) {
          setMissionCondition(missionConditionRes.data || [])
        }

        if (userMissionRes.isOk) {
          setUserMission(userMissionRes.data || [])
        }

        if (issueStatusRes.isOk) {
          setIssueStatus(issueStatusRes.data || [])
        }
      }
    )
  }, [])

  const tabList = [
    {
      title: t`features_trade_future_settings_margin_records_index_5101364`,
      content: (
        <CommonList
          refreshing
          onLoadMore={onLoadHistory}
          onRefreshing={() => requestWithLoading(onLoadHistory(true), 0)}
          finished={historyFinished}
          showEmpty={historyPositionList.length === 0}
          listChildren={historyPositionList.map((item, i) => {
            return (
              <div
                key={i}
                style={{
                  border: '1px solid var(--line_color_02)',
                }}
                className={classNames('relative w-full p-4 box-border rounded-[16px]', {
                  'mt-4': !i,
                  'mt-3': i,
                })}
              >
                {item?.missionType === TaskTypeCode.challenge ? (
                  <>
                    <div className="absolute right-0 top-0">
                      <img
                        src={`${oss_svg_image_domain_address}welfare-center/Group%201000006602.png`}
                        alt=""
                        className="w-[39px] h-[39px] object-contain "
                      />
                    </div>
                    <span
                      style={{
                        transform: 'rotate(45deg)',
                      }}
                      className="absolute right-0 top-[5px] text-[10px] font-medium leading-[18px] text-buy_up_color"
                    >{t`features_trade_future_settings_margin_records_index_6000001`}</span>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <div className="w-[44px] h-[44px] bg-brand_color_special_02 flex justify-center items-center rounded-[44px]">
                            <Icon name="icon_welfare_coupon_spot_yellow" className="text-[22px] !mt-0" />
                          </div>
                        </div>
                        <div className="ml-3 flex flex-col">
                          <div className="common-20-title font-bold flex">
                            {item?.couponTemplateDetail?.couponValue} {item?.couponTemplateDetail?.coinSymbol}
                            <div
                              className="h-[14px] mt-[-4px] bg-sell_down_color text-[10px] leading-[10px] text-button_text_01 font-medium px-1 pt-[2px]"
                              style={{ borderRadius: '4px 4px 4px 0' }}
                            >
                              x{item?.awardValue}
                              {t`helper_order_future_holding_679`}
                            </div>
                          </div>
                          <span className="common-12-content text-text_color_01">
                            {
                              couponType?.filter(_item => {
                                return _item.codeVal === item?.couponTemplateDetail?.couponType
                              })?.[0]?.codeKey
                            }
                          </span>
                        </div>
                      </div>
                      <div>
                        {item?.issueStatus === issueStatusCode.issued ? (
                          <span
                            className={classNames('btn active')}
                            onClick={() => {
                              link('/welfare-center')
                            }}
                          >{t`features_welfare_center_my_task_task_record_index_p2qrjdha7b`}</span>
                        ) : (
                          <span
                            className={classNames('btn')}
                          >{t`features_welfare_center_my_task_task_record_index_ittqqi1fmm`}</span>
                        )}
                      </div>
                    </div>
                    <div className="h-[6px] w-full rounded-[16px] bg-bg_sr_color mt-3">
                      <div
                        className="h-[6px]  rounded-[16px] bg-brand_color"
                        style={{
                          width: `${
                            (item?.conditions?.[0]?.currentValue || 0) / item?.conditions?.[0]?.targetValue > 1
                              ? 100
                              : ((item?.conditions?.[0]?.currentValue || 0) / item?.conditions?.[0]?.targetValue) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-[10px]">
                      <span className="common-12-content text-text_color_03">
                        {
                          condition?.filter(_item => {
                            return _item.codeVal === item?.conditions?.[0]?.conditionName
                          })?.[0]?.codeKey
                        }
                        {CompareCondition[item?.conditions?.[0]?.compareCondition]}
                        {item?.conditions?.[0]?.targetValue || 0}
                        {item?.conditions?.[0]?.targetUnit}
                        {t`features_c2c_trade_trade_form_22225101654`}
                      </span>
                      <span className="common-12-content text-text_color_03">
                        <span className="text-text_color_01 font-medium">
                          {item?.conditions?.[0]?.currentValue || 0}
                        </span>
                        /{item?.conditions?.[0]?.targetValue || 0}
                        {item?.conditions?.[0]?.targetUnit}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute right-0 top-0">
                      <img
                        src={`${oss_svg_image_domain_address}welfare-center/Group%201000006602.png`}
                        alt=""
                        className="w-[39px] h-[39px] object-contain "
                      />
                    </div>
                    <span
                      style={{
                        transform: 'rotate(45deg)',
                      }}
                      className="absolute right-0 top-[5px] text-[10px] font-medium leading-[18px] text-buy_up_color"
                    >{t`features_trade_future_settings_margin_records_index_6000001`}</span>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <div className="w-[44px] h-[44px] bg-brand_color_special_02 flex justify-center items-center rounded-[44px]">
                            <Icon name="icon_welfare_coupon_spot_yellow" className="text-[22px] !mt-0" />
                          </div>
                        </div>
                        <div className="ml-3 flex flex-col">
                          <div className="common-20-title font-bold flex">
                            {item?.couponTemplateDetail?.couponValue} {item?.couponTemplateDetail?.coinSymbol}
                            <div
                              className="h-[14px] mt-[-4px] bg-sell_down_color text-[10px] leading-[10px] text-button_text_01 font-medium px-1 pt-[2px]"
                              style={{ borderRadius: '4px 4px 4px 0' }}
                            >
                              x{item?.awardValue}
                              {t`helper_order_future_holding_679`}
                            </div>
                          </div>

                          <span className="common-12-content text-text_color_01">
                            {
                              couponType?.filter(_item => {
                                return _item.codeVal === item?.couponTemplateDetail?.couponType
                              })?.[0]?.codeKey
                            }
                          </span>
                          <span className="common-12-content text-text_color_03 mt-1">
                            {
                              missionCondition?.filter(_item => {
                                return _item.codeVal === item?.conditions?.[0]?.conditionName
                              })?.[0]?.codeKey
                            }
                            {item?.conditions?.[0]?.conditionName ===
                            welfare_achievments_mission_condition_options.kyc_authorized ? (
                              <Popover
                                theme="dark"
                                placement="top"
                                reference={
                                  <Icon name="property_icon_tips" className="text-xs ml-1 !mt-0 text-text_color_03" />
                                }
                              >
                                <div className="p-2 text-xs text-button_text_01">{t`features_welfare_center_my_task_task_record_index_9rpt4e4qzm`}</div>
                              </Popover>
                            ) : null}
                          </span>
                        </div>
                      </div>

                      <div>
                        {item?.issueStatus === issueStatusCode.issued ? (
                          <span
                            className={classNames('btn active')}
                            onClick={() => {
                              link('/welfare-center')
                            }}
                          >{t`features_welfare_center_my_task_task_record_index_p2qrjdha7b`}</span>
                        ) : (
                          <span
                            className={classNames('btn')}
                          >{t`features_welfare_center_my_task_task_record_index_ittqqi1fmm`}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        />
      ),
      id: CompleteSchedule.completed,
    },
    {
      title: t`features_trade_future_settings_margin_records_index_5101399`,
      content: (
        <CommonList
          refreshing
          onLoadMore={onLoadHistory}
          onRefreshing={() => requestWithLoading(onLoadHistory(true), 0)}
          finished={historyFinished}
          showEmpty={historyPositionList.length === 0}
          listChildren={historyPositionList.map((item, i) => {
            return (
              <div
                key={i}
                style={{
                  border: '1px solid var(--line_color_02)',
                }}
                className={classNames('relative w-full p-4 box-border rounded-[16px]', {
                  'mt-4': !i,
                  'mt-3': i,
                })}
              >
                {item?.missionType === TaskTypeCode.challenge ? (
                  <>
                    <div className="absolute right-0 top-0">
                      <img
                        src={`${oss_svg_image_domain_address}welfare-center/Group%201000006603.png`}
                        alt=""
                        className="w-[39px] h-[39px] object-contain "
                      />
                    </div>
                    <span
                      style={{
                        transform: 'rotate(45deg)',
                      }}
                      className="absolute right-0 top-[5px] text-[10px] font-medium leading-[18px] text-text_color_04"
                    >{t`features_welfare_center_my_task_task_record_index_dzsjuicrpx`}</span>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <div className="w-[44px] h-[44px] bg-card_bg_color_02 flex justify-center items-center">
                            <Icon name="icon_vip_cash" className="text-[22px] !mt-0 text-text_color_03" />
                          </div>
                        </div>
                        <div className="ml-3 flex flex-col">
                          <div className="common-20-title font-bold !text-text_color_04 flex">
                            {item?.couponTemplateDetail?.couponValue} {item?.couponTemplateDetail?.coinSymbol}
                            <div
                              className="h-[14px] mt-[-4px] bg-bg_button_disabled text-[10px] leading-[10px] text-button_text_01 font-medium px-1 pt-[2px]"
                              style={{ borderRadius: '4px 4px 4px 0' }}
                            >
                              x{item?.awardValue}
                              {t`helper_order_future_holding_679`}
                            </div>
                          </div>
                          <span className="common-12-content text-text_color_04">
                            {
                              couponType?.filter(_item => {
                                return _item.codeVal === item?.couponTemplateDetail?.couponType
                              })?.[0]?.codeKey
                            }
                          </span>
                        </div>
                      </div>
                      <div></div>
                    </div>
                    <div className="h-[6px] w-full rounded-[16px] bg-bg_sr_color mt-3">
                      <div
                        className="h-[6px]  rounded-[16px] bg-text_color_04"
                        style={{
                          width: '30%',
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-[10px]">
                      <span className="common-12-content text-text_color_04">
                        {
                          condition?.filter(_item => {
                            return _item.codeVal === item?.conditions?.conditionName
                          })?.[0]?.codeKey
                        }
                        {CompareCondition[item?.conditions?.compareCondition]}
                        {item?.conditions?.targetValue}
                        {item?.conditions?.targetUnit}
                        {t`features_c2c_trade_trade_form_22225101654`}
                      </span>
                      <span className="common-12-content text-text_color_04">
                        <span className="text-text_color_04 font-medium">{item?.conditions?.currentValue}</span>/
                        {item?.conditions?.targetValue}
                        {item?.conditions?.targetUnit}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute right-0 top-0">
                      <img
                        src={`${oss_svg_image_domain_address}welfare-center/Group%201000006603.png`}
                        alt=""
                        className="w-[39px] h-[39px] object-contain "
                      />
                    </div>
                    <span
                      style={{
                        transform: 'rotate(45deg)',
                      }}
                      className="absolute right-0 top-[5px] text-[10px] font-medium leading-[18px] text-text_color_04"
                    >{t`features_welfare_center_my_task_task_record_index_dzsjuicrpx`}</span>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        <div>
                          <div className="w-[44px] h-[44px] bg-card_bg_color_02 flex justify-center items-center">
                            <Icon name="icon_vip_cash" className="text-[22px] !mt-0 text-text_color_03" />
                          </div>
                        </div>
                        <div className="ml-3 flex flex-col">
                          <div
                            className="common-20-title font-bold !text-text_color_04 flex"
                            style={{ width: 'fit-content' }}
                          >
                            {item?.couponTemplateDetail?.couponValue} {item?.couponTemplateDetail?.coinSymbol}
                            <div
                              className="h-[14px] mt-[-4px] bg-bg_button_disabled text-[10px] leading-[10px] text-button_text_01 font-medium px-1 pt-[2px]"
                              style={{ borderRadius: '4px 4px 4px 0' }}
                            >
                              x{item?.awardValue}
                              {t`helper_order_future_holding_679`}
                            </div>
                          </div>

                          <span className="common-12-content text-text_color_04">
                            {
                              couponType?.filter(_item => {
                                return _item.codeVal === item?.couponTemplateDetail?.couponType
                              })?.[0]?.codeKey
                            }
                          </span>
                          <span className="common-12-content text-text_color_04 mt-1">
                            {
                              condition?.filter(_item => {
                                return _item.codeVal === item?.conditions?.conditionName
                              })?.[0]?.codeKey
                            }
                            <Popover
                              theme="dark"
                              placement="top"
                              reference={
                                <Icon
                                  onClick={() => {
                                    // setAssetVisible(true)
                                  }}
                                  name="property_icon_tips"
                                  className="text-xs ml-1 !mt-0 text-text_color_03"
                                />
                              }
                            >
                              <div className="p-2 text-xs text-button_text_01">{t`features_welfare_center_my_task_task_record_index_9rpt4e4qzm`}</div>
                            </Popover>
                          </span>
                        </div>
                      </div>

                      <div></div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        />
      ),
      id: CompleteSchedule.undone,
    },
  ]

  /** tab 切换 */
  const onTabChange = name => {
    setCurrentTab(name)
    setHistoryPositionList([])
  }

  return (
    <div className={classNames(styles['welfare-center'])}>
      <NavBar title={t`features_welfare_center_my_task_task_record_index_uhp9q_q6iq`} />

      <div className="tab-switch">
        <Tabs align="start" className="tab" active={currentTab} onChange={onTabChange}>
          {tabList?.map(item => {
            return (
              <Tabs.TabPane key={item.id} title={item.title} name={item.id}>
                <div className="w-full px-4 box-border">{item.content}</div>
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
