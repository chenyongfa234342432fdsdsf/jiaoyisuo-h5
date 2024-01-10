import { t } from '@lingui/macro'
import { useEffect, useState } from 'react'
import Icon from '@/components/icon'

import {
  getV1AgentInvitationCodeQueryProductCdApiRequest,
  getV1AgentInvitationCodeQueryRebatesApiRequest,
  getV2AgtRebateInfoHistoryOverviewApiRequest,
  getV1AgentCurrencyApiRequest,
} from '@/apis/agent'

import dayjs from 'dayjs'
import { link } from '@/helper/link'
import { Toast } from '@nbit/vant'
import DatePickerModal, { DatePickerValueFormat } from '@/components/common-date-picker/date-picker-modal'
import { useAgentStatsStore } from '@/store/agent/agent-gains'
import { useLayoutStore } from '@/store/layout'
import { YapiGetV1AgentInvitationCodeQueryProductCdData } from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'
import { YapiGetV1AgentInvitationCodeQueryRebatesData } from '@/typings/yapi/AgentInvitationCodeQueryRebatesV1GetApi'
import classNames from 'classnames'
import { YapiGetV1AgentCurrencyData } from '@/typings/yapi/AgentCurrencyV1GetApi'
import { getWeek } from '@/helper/agent/agent'
import { I18nsEnum } from '@/constants/i18n'
import { useCommonStore } from '@/store/common'
import { FinanceValue } from '@/features/agent/agent-invite/invite-check-more-v3/display-table/table-schema'
import Styles from './index.module.css'
import StatsPopup from '../common/stats-popup'

enum DataOverviewTabType {
  all = 1, // 全部时间
  day = 2, // 今日
  week = 3, // 本周
  month = 4, // 本月
  custom = 5, // 自定义
}

function InviteDescribe({ myRef, applyStatus, maxSysRate, isAgent, maxRate, allInviteCode }) {
  const [overview, setOverview] = useState<any>(null)
  const [currency, setCurrency] = useState<YapiGetV1AgentCurrencyData>()
  const [modalVisible, setmodalVisible] = useState(false)
  const [describeLoading, setDescribeLoading] = useState(true)
  const [showData, setShowData] = useState(true)
  const [dateFormPopup, setdateFormPopup] = useState<boolean>(false)
  const [queryProductCd, setQueryProductCd] = useState<YapiGetV1AgentInvitationCodeQueryProductCdData>({
    spot: '',
    contract: '',
    borrowCoin: '',
    scaleList: {
      productCd: '',
    },
  })
  const [queryRebates, setQueryRebates] = useState({
    spot: '',
    contract: '',
    borrowCoin: '',
    option: '',
    recreation: '',
  })
  const [timeValue, setTimeValue] = useState({
    text: t`constants_market_market_list_market_module_index_5101071`,
    value: DataOverviewTabType.all,
    startTime: '',
    endTime: '',
  })

  const [cusTimeValue, setCusTimeValue] = useState({
    startTime: '',
    endTime: '',
  })
  const [datePickerVal, setdatePickerVal] = useState<ReturnType<typeof DatePickerValueFormat>>()
  const { chartFilterSetting, setChartFilterSetting } = useAgentStatsStore()

  // const [actionSheetVisibel, setActionSheetVisibel] = useState<boolean>(false)
  const [currentIndex, selectCurrentIndex] = useState<number>(0)
  const commonState = useCommonStore()

  const validateDatesRange = range => {
    const startDate = dayjs(range.startDate)
    const endDate = dayjs(range.endDate)
    // check range is within 12 months
    if (endDate.diff(startDate, 'month') > 12) {
      Toast.info({ message: t`features_agent_agent_gains_detail_index_5101377` })
      return false
    }
    return true
  }

  const selectTime = item => {
    setTimeValue(item)
    if (item.value === DataOverviewTabType.custom) {
      setdateFormPopup(true)
    } else {
      getApiTime(item)
    }
  }
  const actions = [
    {
      name: t`constants_market_market_list_market_module_index_5101071`,
      color: timeValue.value === DataOverviewTabType.all ? '#F1AE3D' : '',
      callback: () => {
        selectTime({
          text: t`constants_market_market_list_market_module_index_5101071`,
          value: DataOverviewTabType.all,
          startTime: '',
          endTime: '',
        })
        // setActionSheetVisibel(false)
      },
    },
    {
      name: t`features_agent_invite_describe_index_5101493`,
      color: timeValue.value === DataOverviewTabType.day ? '#F1AE3D' : '',
      callback: () => {
        selectTime({
          text: t`features_agent_invite_describe_index_5101493`,
          value: DataOverviewTabType.day,
          startTime: dayjs().startOf('date').valueOf(),
          endTime: dayjs().endOf('date').valueOf(),
        })
        // setActionSheetVisibel(false)
      },
    },

    {
      name: t`features_agent_common_agent_datetime_tabs_index_rxfd1dbfwk`,
      color: timeValue.value === DataOverviewTabType.day ? '#F1AE3D' : '',
      callback: () => {
        selectTime({
          text: t`features_agent_common_agent_datetime_tabs_index_rxfd1dbfwk`,
          value: DataOverviewTabType.day,
          startTime: dayjs().subtract(1, 'day').startOf('day').valueOf(),
          endTime: dayjs().subtract(1, 'day').endOf('day').valueOf(),
        })
      },
    },
    {
      name: t`features_agent_invite_describe_index_5101494`,
      color: timeValue.value === DataOverviewTabType.week ? '#F1AE3D' : '',
      callback: () => {
        selectTime({
          text: t`features_agent_invite_describe_index_5101494`,
          value: DataOverviewTabType.week,
          startTime: getWeek().startWeek,
          endTime: getWeek().endWeek,
        })
        // setActionSheetVisibel(false)
      },
    },
    {
      name: t`features_agent_invite_describe_index_5101495`,
      color: timeValue.value === DataOverviewTabType.month ? '#F1AE3D' : '',
      callback: () => {
        selectTime({
          text: t`features_agent_invite_describe_index_5101495`,
          value: DataOverviewTabType.month,
          startTime: dayjs().startOf('month').valueOf(),
          endTime: dayjs().endOf('month').valueOf(),
        })
        // setActionSheetVisibel(false)
      },
    },
    {
      name: t`features_agent_invite_describe_index_5101496`,
      color: timeValue.value === DataOverviewTabType.custom ? '#F1AE3D' : '',
      callback: () => {
        selectTime({
          text: t`features_agent_invite_describe_index_5101496`,
          value: DataOverviewTabType.custom,
          startTime: dayjs().startOf('month').valueOf(),
          endTime: dayjs().endOf('month').valueOf(),
        })
        // setActionSheetVisibel(true)
      },
    },
  ]

  const transTime = value => {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  }

  const timeList = [
    {
      startTime: '',
      endTime: transTime(dayjs().endOf('date').valueOf()),
    },
    {
      startTime: transTime(dayjs().startOf('date').valueOf()),
      endTime: transTime(dayjs().endOf('date').valueOf()),
    },
    {
      startTime: transTime(dayjs().subtract(1, 'day').startOf('day').valueOf()),
      endTime: transTime(dayjs().subtract(1, 'day').endOf('day').valueOf()),
    },
    {
      startTime: transTime(getWeek().startWeek),
      endTime: transTime(getWeek().endWeek),
    },
    {
      startTime: transTime(dayjs().startOf('month').valueOf()),
      endTime: transTime(dayjs().endOf('month').valueOf()),
    },
    {
      startTime: '',
      endTime: '',
    },
  ]

  const selectLiTime = index => {
    selectCurrentIndex(index)

    actions[index].callback()
  }

  const getApiTime = item => {
    getV2AgtRebateInfoHistoryOverviewApiRequest({
      // getV1AgtRebateInfoHistoryOverviewApiRequest({
      startDate: item.startTime,
      endDate: item.endTime,
    }).then(res => {
      if (res.isOk) {
        setDescribeLoading(false)
        setOverview(res.data)
      }
    })
  }
  /** 获取总览 */
  useEffect(() => {
    setDescribeLoading(true)
    getApiTime({
      startTime: undefined,
      endTime: undefined,
    })
    getV1AgentInvitationCodeQueryProductCdApiRequest({}).then(res => {
      if (res.isOk) {
        setQueryProductCd(res.data as YapiGetV1AgentInvitationCodeQueryProductCdData)
      }
    })
    getV1AgentInvitationCodeQueryRebatesApiRequest({}).then(res => {
      if (res.isOk) {
        setQueryRebates(res.data as YapiGetV1AgentInvitationCodeQueryRebatesData as any)
      }
    })

    getV1AgentCurrencyApiRequest({}).then(res => {
      if (res.isOk) {
        setCurrency(res.data)
      }
    })
  }, [])

  const spotNormal = allInviteCode?.invitationCode?.scaleList?.find(item => {
    return item?.productCd?.toString() === '1'
  })?.selfScale
  const contractNormal = allInviteCode?.invitationCode?.scaleList?.find(item => {
    return item?.productCd?.toString() === '2'
  })?.selfScale
  const coinNormal = allInviteCode?.invitationCode?.scaleList?.find(item => {
    return item?.productCd?.toString() === '3'
  })?.selfScale

  const optionNormal = allInviteCode?.invitationCode?.scaleList?.find(item => {
    return item?.productCd?.toString() === '4'
  })?.selfScale
  const recreationNormal = allInviteCode?.invitationCode?.scaleList?.find(item => {
    return item?.productCd?.toString() === '5'
  })?.selfScale

  const rebateChartData: Array<{
    id: number
    value: number
    color: string
  }> = []

  const _spotSelfScale = queryProductCd?.spot ? { selfScale: queryProductCd?.spot } : null
  const _contractSelfScale = queryProductCd?.contract ? { selfScale: queryProductCd?.contract } : null
  const _coinSelfScale = queryProductCd?.borrowCoin ? { selfScale: queryProductCd?.borrowCoin } : null

  const onlySpotSelfScale = _spotSelfScale && !_contractSelfScale && !_coinSelfScale
  const onlyContractSelfScale = !_spotSelfScale && _contractSelfScale && !_coinSelfScale
  const onlyCoinSelfScale = !_spotSelfScale && !_contractSelfScale && _coinSelfScale

  const spotAndContractSelfScale = _spotSelfScale && _contractSelfScale && !_coinSelfScale
  const spotAndCoinSelfScale = _spotSelfScale && !_contractSelfScale && _coinSelfScale
  const contractAndCoinSelfScale = !_spotSelfScale && _contractSelfScale && _coinSelfScale
  const AllSelfScale = _spotSelfScale && _contractSelfScale && _coinSelfScale

  if (onlySpotSelfScale) {
    rebateChartData.push({
      id: 1,
      value: overview?.spot || 10,
      color: '#FF7E77',
    })
  }

  if (onlyContractSelfScale) {
    rebateChartData.push({
      id: 2,
      value: overview?.contract || 10,
      color: '#29DC92',
    })
  }

  if (onlyCoinSelfScale) {
    rebateChartData.push({
      id: 3,
      value: overview?.borrowCoin || 10,
      color: '#6195F6',
    })
  }

  if (spotAndContractSelfScale) {
    if (!overview?.spot && !overview?.contract) {
      rebateChartData.push({
        id: 1,
        value: 10,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 2,
        value: 10,
        color: '#29DC92',
      })
    }
    if (!overview?.spot && overview?.contract) {
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
    }
    if (overview?.spot && !overview?.contract) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
    }
    if (overview?.spot && overview?.contract) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
    }
  }

  if (spotAndCoinSelfScale) {
    if (!overview?.spot && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: 10,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 3,
        value: 10,
        color: '#6195F6',
      })
    }
    if (!overview?.spot && overview?.borrowCoin) {
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }
    if (overview?.spot && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
    }
    if (overview?.spot && overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }
  }

  if (contractAndCoinSelfScale) {
    if (!overview?.contract && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 2,
        value: 10,
        color: '#29DC92',
      })
      rebateChartData.push({
        id: 3,
        value: 10,
        color: '#6195F6',
      })
    }
    if (!overview?.contract && overview?.borrowCoin) {
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }
    if (overview?.contract && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
    }
    if (overview?.contract && overview?.borrowCoin) {
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }
  }

  if (AllSelfScale) {
    if (!overview?.spot && !overview?.contract && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: 10,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 2,
        value: 10,
        color: '#29DC92',
      })
      rebateChartData.push({
        id: 3,
        value: 10,
        color: '#6195F6',
      })
    }

    if (!overview?.spot && !overview?.contract && overview?.borrowCoin) {
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }

    if (!overview?.spot && overview?.contract && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
    }

    if (!overview?.spot && overview?.contract && overview?.borrowCoin) {
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }

    if (overview?.spot && !overview?.contract && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
    }

    if (overview?.spot && !overview?.contract && overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }

    if (overview?.spot && overview?.contract && !overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
    }

    if (overview?.spot && overview?.contract && overview?.borrowCoin) {
      rebateChartData.push({
        id: 1,
        value: overview?.spot,
        color: '#FF7E77',
      })
      rebateChartData.push({
        id: 2,
        value: overview?.contract,
        color: '#29DC92',
      })
      rebateChartData.push({
        id: 3,
        value: overview?.borrowCoin,
        color: '#6195F6',
      })
    }
  }

  const { headerData } = useLayoutStore()

  // const onCancel = () => {
  //   setActionSheetVisibel(false)
  // }
  const inviteTip = t({
    id: 'features_agent_invite_describe_index_5101508',
    values: { 0: headerData?.businessName },
  })
  const waringTip = t({
    id: 'features_agent_invite_describe_index_gm50oh3xke',
    values: { 0: headerData?.businessName, 1: headerData?.businessName },
  })
  const waringTip2 = t({
    id: 'features_agent_invite_describe_index_vogu57ebln',
    values: { 0: headerData?.businessName, 1: headerData?.businessName },
  })

  const formatCurrency = value => {
    if (!currency) {
      return value
    }

    return Number(value).toFixed(currency.offset)
  }

  return (
    <div className={Styles.scoped}>
      <div className="overview">
        <span className="total">{t`assets.financial-record.tabs.overview`}</span>
        <span
          className="detail"
          onClick={() => {
            link('/agent/gains')
          }}
        >
          {t`modules_agent_invite_index_page_server_5101373`}
        </span>
      </div>
      <div className="all-time">
        {actions?.map((item, index) => {
          return (
            <div
              className={classNames('time-li', {
                'text-text_color_01': timeValue.text === item.name,
                'rounded': timeValue.text === item.name,
                'text-text_color_02': timeValue.text !== item.name,
                'bg-bg_sr_color': timeValue.text === item.name,
                'ml-2': index !== 0,
                'h-6': index < 3 && commonState?.locale !== I18nsEnum['zh-HK'],
              })}
              onClick={() => {
                selectLiTime(index)
              }}
              key={index}
            >
              {item.name}
            </div>
          )
        })}
      </div>
      <div className="all">
        {timeValue.value === DataOverviewTabType.custom
          ? cusTimeValue.startTime && cusTimeValue.endTime
            ? `${dayjs(cusTimeValue.startTime).format('YYYY-MM-DD HH:mm:ss')}-${dayjs(cusTimeValue.endTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )}`
            : ''
          : `${
              timeValue.value === DataOverviewTabType.all
                ? `${t`features_agent_invite_describe_index_o9vjaidpzgmygzk0ylibs`} `
                : ''
            }${timeList[currentIndex].startTime}${timeList[currentIndex].startTime ? '-' : ''}${
              timeList[currentIndex].endTime
            }`}
      </div>
      <DatePickerModal
        className={Styles['gains-detail-popup']}
        datePickerConfig={{
          title: t`features_agent_agent_gains_detail_index_5101378`,
          columnsTop: (
            <>
              <span className="text-text_color_01 text-xs ml-5 mr-1 mt-4">
                {t`features_agent_agent_gains_detail_index_5101383`} 12{' '}
                {t`features_agent_agent_gains_detail_index_5101384`}
              </span>
              <Icon className="w-3 h-3" hasTheme name="msg" onClick={() => setmodalVisible(true)} />
              <StatsPopup
                title={t`features_agent_agent_gains_detail_index_5101379`}
                content={t`features_agent_agent_gains_detail_index_5101380`}
                visible={modalVisible}
                setVisible={setmodalVisible}
              />
            </>
          ),
        }}
        visible={dateFormPopup}
        dateTemplate={'YYYY-MM-DD'}
        startDate={chartFilterSetting.startDate}
        endDate={chartFilterSetting.endDate}
        onClose={() => {
          setdateFormPopup(false)
          selectLiTime(DataOverviewTabType.all - 1)
        }}
        onChange={v => {
          setdatePickerVal(v)
        }}
        max={730}
        onCommit={params => {
          if (validateDatesRange(params)) {
            getApiTime({
              startTime: params.startDate,
              endTime: params.endDate,
            })
            setCusTimeValue({
              startTime: params.startDate,
              endTime: params.endDate,
            })
            setChartFilterSetting({ date: params })
            setdateFormPopup(false)
            // setActionSheetVisibel(false)
          }
        }}
      />
      {/* <div className="peo-wrap">
        <div className="peo-col">
          <span className="peo">
            <Icon className="icon mr-2" hasTheme name={'rebate_invitation_number'} />
            {t`features_agent_invite_describe_index_5101500`}
          </span>
          <span className="num">{overview?.invitedNum}</span>
        </div>
        <div className="peo-col ml-3">
          <span className="peo">
            <Icon className="icon mr-2" hasTheme name={'rebate_subordinate'} />
            {t`features_agent_agent_invite_invite_info_invite_info_content_list_filter_index_5101418`}
          </span>
          <span className="num">{overview?.totalNum}</span>
        </div>
      </div> */}
      <div className="view-wrap">
        <div className="total-rebate">
          <div className="left-wrap">
            <div className="unit">
              <span>
                {t`features_agent_invite_describe_index_5101501`}
                {`(${overview?.legalCur || 'USD'})`}
              </span>
              {!showData ? (
                <Icon
                  onClick={() => {
                    setShowData(true)
                  }}
                  className="eyes-icon"
                  hasTheme
                  name={'eyes_close'}
                />
              ) : (
                <Icon
                  onClick={() => {
                    setShowData(false)
                  }}
                  hasTheme
                  className="eyes-icon"
                  name={'eyes_open'}
                />
              )}
            </div>
            {/* <div className="num">{`${
              showData
                ? `${
                    overview?.totalRebate
                      ? overview?.totalRebate?.toString()?.split('.')?.[1]?.length > 8
                        ? Number(overview?.totalRebate).toFixed(8)
                        : overview?.totalRebate
                      : '0.00'
                  }`
                : '******'
            }`}</div> */}

            <div className="num">
              {showData ? (
                <span className="flex">
                  <FinanceValue val={overview?.totalRebate} precision={currency?.offset} />
                </span>
              ) : (
                '******'
              )}
            </div>
          </div>
          {/* {describeLoading ? null : (
            <div className="rebate-chart">
              <ResponsivePie
                data={rebateChartData}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                innerRadius={0.5}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                colors={(node: any) => `${node.data.color}`}
                isInteractive={false}
              />
            </div>
          )} */}
        </div>

        <div className="team-wrap">
          <div className="team-li">
            <div className="team-title">
              {t`features_agent_invite_describe_index_hmdwc-9_lwi8ovvu-ock8`}
              {`(${overview?.legalCur || 'USD'})`}
            </div>
            <div className="team-value">{<FinanceValue val={overview?.teamDeposit} />}</div>
          </div>
          <div className="team-li">
            <div className="team-title">
              {t`features_agent_invite_describe_index_rjkgbp7ewzirfladasfgy`}
              {`(${overview?.legalCur || 'USD'})`}
            </div>
            <div className="team-value">{<FinanceValue val={overview?.teamTurnover} />}</div>
          </div>
          <div className="team-li mt-2">
            <div className="team-title">
              {t`features_agent_invite_describe_index_-u9w-c6hgnl42q7ugdx8e`}
              {`(${overview?.legalCur || 'USD'})`}
            </div>

            <div className="team-value">{<FinanceValue val={overview?.agentTeamFee} />}</div>
          </div>
          <div className="team-li mt-2">
            <div className="team-title">{t`features_agent_invite_describe_index_5101500`}</div>
            <div className="team-value">{overview?.invitedNum}</div>
          </div>
          <div className="team-li mt-2">
            <div className="team-title">{t`features_agent_invite_describe_index_u5_xuqzkiehfzmiwbuskw`}</div>
            <div className="team-value">{overview?.invitedTeamNum}</div>
          </div>
        </div>
      </div>

      <div ref={myRef} className="common-01-text pyramid-detail">
        {t`features_agent_invite_operation_index_5101452`}
      </div>
      <p className="common-02-text mt-3">{t`features_agent_invite_describe_index_5101505`}</p>
      <p className="common-02-text mt-2">
        {t`features_agent_invite_describe_index_5101506`}
        {isAgent ? (
          <span className="common-01-text text-xs">
            {queryRebates?.spot ? (
              <span>
                {t`constants_assets_common_587`}
                {`${queryRebates?.spot}%`}
                {t`features_c2c_trade_ad_list_2222222225101679`}
              </span>
            ) : null}
            {queryRebates?.contract ? (
              <span>
                {t`constants_assets_common_588`}
                {`${queryRebates?.contract}%`}
                {t`features_c2c_trade_ad_list_2222222225101679`}
              </span>
            ) : null}
            {queryRebates?.borrowCoin ? (
              <span>
                {t`features_agent_common_stats_info_box_stats_info_popover_index_5101392`}
                {`${queryRebates?.borrowCoin}%`}
                {t`features_c2c_trade_ad_list_2222222225101679`}
              </span>
            ) : null}
            {queryRebates?.option ? (
              <span>
                {t`features_agent_invite_operation_index_qsbmddpdyj`}
                {`${queryRebates?.option}%`}
                {t`features_c2c_trade_ad_list_2222222225101679`}
              </span>
            ) : null}
            {queryRebates?.recreation ? (
              <span>
                {t`features_agent_invite_operation_index_mixmmdygdh`}
                {`${queryRebates?.recreation}%`}
              </span>
            ) : null}
          </span>
        ) : (
          <span className="common-01-text text-xs">{t`features_agent_invite_describe_index_vhgvkjh6cvybdrjx2gdcu`}</span>
        )}
      </p>
      <p className="common-02-text mt-2">{inviteTip}</p>
      <div className="common-02-text mt-4">{t`features_agent_invite_describe_index_5101510`}</div>
      <p className="common-02-text mt-2">{t`features_agent_invite_describe_index_5101511`}</p>
      <div className="common-02-text mt-4">{t`features_agent_invite_describe_index_5101512`}</div>
      <p className="common-02-text mt-2">{t`features_agent_invite_describe_index_5101513`}</p>
      <div className="common-02-text mt-4">{t`features_agent_invite_describe_index_5101514`}</div>
      <p className="common-02-text mt-2">(1) {t`features_agent_invite_describe_index_5101515`}</p>
      <p className="common-02-text mt-1">{t`features_agent_invite_describe_index_5101516`}</p>
      <p className="common-02-text mt-2">(2) {t`features_agent_invite_describe_index_5101517`}</p>
      <p className="common-02-text mt-1">
        {t`features_agent_invite_describe_index_5101518`}
        {isAgent ? (
          <span className="common-01-text text-xs">
            {queryRebates?.spot ? (
              <span>
                {t`constants_assets_common_587`}
                {`${queryRebates?.spot}%`}
                {queryRebates?.contract || queryRebates?.borrowCoin
                  ? t`features_c2c_trade_ad_list_2222222225101679`
                  : ''}
              </span>
            ) : null}
            {queryRebates?.contract ? (
              <span>
                {t`constants_assets_common_588`}
                {`${queryRebates?.contract}%`}
                {queryRebates?.borrowCoin ? t`features_c2c_trade_ad_list_2222222225101679` : ''}
              </span>
            ) : null}
            {queryRebates?.borrowCoin ? (
              <span>
                {t`features_agent_common_stats_info_box_stats_info_popover_index_5101392`}
                {`${queryRebates?.borrowCoin}%`}
              </span>
            ) : null}
          </span>
        ) : (
          <span className="common-01-text text-xs">{t`features_agent_invite_describe_index_vhgvkjh6cvybdrjx2gdcu`}</span>
        )}

        {t`features_agent_invite_describe_index_5101536`}
      </p>
      <div className="common-02-text mt-4">{t`features_agent_invite_describe_index_5101519`}</div>
      <p className="common-02-text mt-2">{t`features_agent_invite_describe_index_5101520`}</p>

      <p className="common-02-text mt-4">
        {t`features_agent_invite_describe_index_5101521`}
        {headerData?.businessName}
        {t`features_agent_invite_describe_index_5101522`}
      </p>
      <p className="common-02-text mt-4">{t`features_agent_invite_describe_index_5101523`}</p>
      <p className="text-text_color_01 text-xs mt-4">* {waringTip}</p>
      <p className="text-text_color_01 text-xs mt-2">* {waringTip2}</p>
      <div className="common-01-text text-base mt-6">{t`features_agent_invite_describe_index_5101530`}</div>
      <p className="common-02-text mt-3">
        {t`features_agent_invite_describe_index_5101531`}
        <span className="common-01-text text-xs">
          {spotNormal ? (
            <span>
              {t`constants_assets_common_587`}
              {`${spotNormal || 0}%`}
              {contractNormal || coinNormal || optionNormal || recreationNormal
                ? t`features_c2c_trade_ad_list_2222222225101679`
                : ''}
            </span>
          ) : null}
          {contractNormal ? (
            <span>
              {t`constants_assets_common_588`}
              {`${contractNormal || 0}%`}
              {coinNormal || optionNormal || recreationNormal ? t`features_c2c_trade_ad_list_2222222225101679` : ''}
            </span>
          ) : null}
          {coinNormal ? (
            <span>
              {t`features_agent_common_stats_info_box_stats_info_popover_index_5101392`}
              {`${coinNormal || 0}%`}
              {optionNormal || recreationNormal ? t`features_c2c_trade_ad_list_2222222225101679` : ''}
            </span>
          ) : null}
          {optionNormal ? (
            <span>
              {t`features_agent_invite_operation_index_qsbmddpdyj`}
              {`${optionNormal || 0}%`}
              {recreationNormal ? t`features_c2c_trade_ad_list_2222222225101679` : ''}
            </span>
          ) : null}
          {recreationNormal ? (
            <span>
              {t`features_agent_invite_operation_index_mixmmdygdh`}
              {`${recreationNormal || 0}%`}
            </span>
          ) : null}
        </span>
      </p>
      <p className="common-02-text mt-2">{t`features_agent_invite_describe_index_5101533`}</p>
      <p className="common-02-text mt-2">
        {t`features_agent_invite_describe_index_5101534`}
        {applyStatus && (
          <span
            className="common-brand-text text-xs"
            onClick={() => {
              link('/agent/apply')
            }}
          >
            {t`features_agent_invite_describe_index_5101535`}
          </span>
        )}
      </p>
    </div>
  )
}

export default InviteDescribe
