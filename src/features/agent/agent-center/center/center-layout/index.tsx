/**
 * 代理中心
 */
import NavBar from '@/components/navbar'
import { initInviteDetailForm, initRebateDetailForm, useAgentCenterStore } from '@/store/agent/agent-center/center'
import { Tabs } from '@nbit/vant'
import {
  AgentCenterDetailsTabEnum,
  AgentCenterTimeTypeEnum,
  AgentModalTypeEnum,
  getAgentCenterModalTypeName,
} from '@/constants/agent/agent-center/center'
import { useMount, useUnmount, useUpdateEffect } from 'ahooks'
import { useEffect, useState } from 'react'
import { getAgentList } from '@/apis/agent/center'
import {
  onGetAgentCenterInviteDetail,
  onGetAgentCenterOverview,
  onGetAgentCenterProductList,
  onGetAgentCenterRebateDetail,
  onGetAgentUserIsBlack,
  onGetMemberCurrencyList,
} from '@/helper/agent/center'
import { requestWithLoading } from '@/helper/order'
import { t } from '@lingui/macro'
import { IAgentCurrencyList } from '@/typings/api/agent/agent-center/center'
import RebateWarnPopup from '@/features/agent/agent-invitation-rebate/component/rebate-warn-popup'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { link } from '@/helper/link'
import { getAgentMoreDetail } from '@/helper/route/agent'
import { useAgentStore } from '@/store/agent/agent-invitation-rebate'
import { AreaLayout } from '../area-layout'
import styles from './index.module.css'
import { ThreeLevelLayout } from '../three-level-layout'
import { PyramidLayout } from '../pyramid-layout'
import { ScrollToTopButton } from '../common/scroll-top-button'

function AgentCenterLayout() {
  const {
    userAgentList,
    currentModalTab,
    rebateDetailForm,
    inviteDetailForm,
    agentCenterOverview,
    memberCurrencyList,
    agentUserBlackInfo,
    currentCurrency,
    updateUserAgentList,
    updateCurrentModalTab,
    updateCurrentDetailsTab,
    updateOverviewTimeTab,
    updateInviteDetailForm,
    updateRebateDetailForm,
    fetchAgentCenterEnums,
    updateAgentCurrencyList,
    updateInviteFinished,
    updateInviteList,
    updateCurrentCurrency,
  } = useAgentCenterStore() || {}
  const { fetchAgentEnums } = useAgentStore() || {}
  const [blackVisible, setBlackVisible] = useState(false)
  useMount(fetchAgentCenterEnums)
  useMount(fetchAgentEnums)

  const onGetModalPage = (modal: string) => {
    return {
      [AgentModalTypeEnum.area]: <AreaLayout />,
      [AgentModalTypeEnum.threeLevel]: <ThreeLevelLayout />,
      [AgentModalTypeEnum.pyramid]: <PyramidLayout />,
    }[modal]
  }

  /**
   * 清除数据
   */
  const onClear = (isClearModalTab = false) => {
    isClearModalTab && updateCurrentModalTab('')
    updateCurrentDetailsTab(AgentCenterDetailsTabEnum.invite)
    updateOverviewTimeTab(AgentCenterTimeTypeEnum.today)
    updateInviteDetailForm(initInviteDetailForm)
    updateRebateDetailForm(initRebateDetailForm)
    updateInviteFinished(false)
    updateInviteList([])
  }

  /**
   * 查询用户代理模式列表
   */
  const onLoadAgentList = async () => {
    const res = await getAgentList({})
    const { isOk, data } = res || {}

    if (!isOk || !data) return
    updateUserAgentList(data)
    !currentModalTab && updateCurrentModalTab(data[0])
  }

  useEffect(() => {
    onLoadAgentList()
    onGetAgentUserIsBlack()
    onGetMemberCurrencyList()
    onGetAgentCenterProductList()
  }, [])

  useEffect(() => {
    if (!currentModalTab) return
    requestWithLoading(onGetAgentCenterOverview(), 0)
    onGetAgentCenterRebateDetail(true)
  }, [currentModalTab])

  useEffect(() => {
    agentUserBlackInfo?.inBlacklist && setBlackVisible(true)
  }, [agentUserBlackInfo?.inBlacklist])

  useUpdateEffect(() => {
    currentModalTab && requestWithLoading(onGetAgentCenterOverview(), 0)
    onGetAgentCenterRebateDetail(true)
  }, [rebateDetailForm?.startTime, rebateDetailForm?.endTime])

  useUpdateEffect(() => {
    onGetAgentCenterRebateDetail(true)
  }, [
    rebateDetailForm?.productCd,
    rebateDetailForm?.rebateType,
    rebateDetailForm?.minAmount,
    rebateDetailForm?.maxAmount,
    rebateDetailForm?.rebateLevel,
  ])

  useUpdateEffect(() => {
    requestWithLoading(onGetAgentCenterInviteDetail(true), 0)
  }, [
    inviteDetailForm?.registerDateSort,
    inviteDetailForm?.rebateLevel,
    inviteDetailForm?.isRealName,
    inviteDetailForm?.startTime,
    inviteDetailForm?.endTime,
    inviteDetailForm?.teamNumMin,
    inviteDetailForm?.teamNumMax,
  ])

  useUpdateEffect(() => {
    let agentCurrency: IAgentCurrencyList[] = []
    let memberCurrency: IAgentCurrencyList[] = []

    if (!agentCenterOverview?.currencySymbol) return
    if (agentCenterOverview?.currencySymbol) {
      agentCurrency = [
        { currencyEnName: agentCenterOverview?.currencySymbol, offset: 2, appLogo: agentCenterOverview?.appLogo },
      ]
    }
    if (memberCurrencyList?.length > 0) {
      memberCurrency = memberCurrencyList
        .map(item => {
          return {
            currencyEnName: item?.currencyEnName || '',
            offset: 2,
            appLogo: `${oss_area_code_image_domain_address}${item?.countryFlagImg}.png`,
          }
        })
        .sort((a, b) => {
          if (a.currencyEnName === agentCenterOverview?.currencySymbol) return -1
          if (b.currencyEnName === agentCenterOverview?.currencySymbol) return 1
          return 0
        })
    }

    const isRepeat = memberCurrency?.some(item => item.currencyEnName === agentCenterOverview?.currencySymbol)
    const newAgentCurrencyList = isRepeat ? memberCurrency : [...agentCurrency, ...memberCurrency]

    if (
      !currentCurrency?.currencyEnName ||
      !newAgentCurrencyList?.some(item => item.currencyEnName === currentCurrency?.currencyEnName)
    ) {
      updateCurrentCurrency(newAgentCurrencyList[0])
    }

    updateAgentCurrencyList(newAgentCurrencyList)
  }, [agentCenterOverview?.currencySymbol, memberCurrencyList])

  useUnmount(() => {
    updateInviteFinished(false)
    updateInviteList([])
    updateInviteDetailForm({ pageNum: 1 })
  })

  return (
    <div className={styles['agent-center-layout']}>
      <NavBar
        title={t`modules_agent_agent_apply_index_page_jaworf6qns`}
        right={
          <span
            className="more"
            onClick={() => link(getAgentMoreDetail(currentModalTab))}
          >{t`features_agent_common_agent_layout_index_8s0ijmnjld`}</span>
        }
        onClickLeft={() => {
          history.back()
          onClear(true)
        }}
        appRightConfig={{
          text: t`features_agent_common_agent_layout_index_8s0ijmnjld`,
          textColor: 'brand_color',
          onClickRight: () => link(getAgentMoreDetail(currentModalTab)),
        }}
      />

      {userAgentList?.length > 1 && (
        <Tabs
          border
          active={currentModalTab}
          onClickTab={async (params: any) => {
            updateCurrentModalTab(params.name)
            onClear()
          }}
        >
          {userAgentList.map((modal: string) => (
            <Tabs.TabPane key={modal} name={modal} title={getAgentCenterModalTypeName(modal)}>
              {modal === currentModalTab && onGetModalPage(modal)}
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}

      {userAgentList?.length > 0 &&
        userAgentList?.length === 1 &&
        userAgentList?.map((modal: string) => {
          return <div key={modal}>{onGetModalPage(modal)}</div>
        })}

      {blackVisible && (
        <RebateWarnPopup
          reason={agentUserBlackInfo?.reason}
          visible={blackVisible}
          onClose={() => setBlackVisible(false)}
        />
      )}

      <ScrollToTopButton />
    </div>
  )
}

export { AgentCenterLayout }
