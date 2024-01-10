/**
 * 代理中心
 */
import {
  getAgentCenterUserIsBlack,
  getAreaAgentLevelList,
  postAgentCenterInviteDetail,
  postAgentCenterOverview,
  postAgentCenterRebateDetail,
} from '@/apis/agent/center'
import { baseAgentCenterStore } from '@/store/agent/agent-center/center'
import {
  AgentCenterDetailsTabEnum,
  AgentModalTypeEnum,
  getAgentCenterInviteDetailKeyByModalType,
  getAgentCenterRebateDetailKeyByModalType,
} from '@/constants/agent/agent-center/center'
import { IAgentInviteeList, IAgentRebateList } from '@/typings/api/agent/agent-center/center'
import { getMemberCurrencyList } from '@/apis/user'
import { postProductList } from '@/apis/agent/invite-v3'
import { getIsLogin } from '../auth'
import { formatCurrency } from '../decimal'
import { rateFilter } from '../assets/spot'

/**
 * 获取代理中心数据总览
 */
export const onGetAgentCenterOverview = async () => {
  const isLogin = getIsLogin()
  if (!isLogin) return

  const { currentModalTab, rebateDetailForm, updateAgentCenterOverview } = baseAgentCenterStore.getState()
  const res = await postAgentCenterOverview({
    model: currentModalTab,
    startTime: rebateDetailForm?.startTime || 0,
    endTime: rebateDetailForm?.endTime || 0,
  })

  const { isOk, data } = res || {}
  if (!isOk || !data) return
  updateAgentCenterOverview(data)
}

/**
 * 查询用户法币列表
 */
export const onGetMemberCurrencyList = async () => {
  const { updateMemberCurrencyList } = baseAgentCenterStore.getState()
  const res = await getMemberCurrencyList({})
  const { isOk, data } = res || {}
  if (!isOk || !data) return
  updateMemberCurrencyList(data?.currencyList)
}

/**
 * 邀请详情 - 获取区域代理等级列表
 */
export const onGetAreaAgentLevelList = async () => {
  const { updateAreaAgentLevelList } = baseAgentCenterStore.getState()
  const res = await getAreaAgentLevelList({})

  const { isOk, data } = res || {}
  if (!isOk || !data) return
  updateAreaAgentLevelList(data)
}

/**
 * 返佣详情 - 获取产品线列表
 */
export const onGetAgentCenterProductList = async () => {
  const { updateRebateProductList } = baseAgentCenterStore.getState()
  const res = await postProductList({})
  const { isOk, data } = res || {}
  if (!isOk || !data) return

  const NewProductList = data.map((item: string) => {
    return { value: item }
  })

  updateRebateProductList(NewProductList)
}

/**
 * 查询是否黑名单用户
 */
export const onGetAgentUserIsBlack = async () => {
  const { updateAgentUserBlackInfo } = baseAgentCenterStore.getState()
  const res = await getAgentCenterUserIsBlack({})
  const { isOk, data } = res || {}

  if (!isOk || !data) return
  updateAgentUserBlackInfo(data)
}

/**
 * 查询邀请详情
 */
export const onGetAgentCenterInviteDetail = async (isRefresh = false) => {
  const {
    inviteDetailForm,
    currentModalTab,
    inviteList,
    updateInviteDetailForm,
    updateInviteFinished,
    updateInviteList,
  } = baseAgentCenterStore.getState()
  if (!currentModalTab) return

  const params = {
    ...inviteDetailForm,
    model: currentModalTab,
    pageNum: isRefresh ? 1 : inviteDetailForm?.pageNum,
  }
  if (!params?.isRealName) delete params?.isRealName
  if (!params?.rebateLevel) delete params?.rebateLevel
  if (!params?.registerDateSort) delete params?.registerDateSort
  if (!params?.registerDateSort) delete params?.sort
  if (!params?.startTime) delete params?.startTime
  if (!params?.endTime) delete params?.endTime
  if (!params?.teamNumMin) delete params?.teamNumMin
  if (!params?.teamNumMax) delete params?.teamNumMax
  if (!params?.uid) delete params?.uid

  const res = await postAgentCenterInviteDetail(params)
  const { isOk, data } = res || {}

  if (!isOk || !data) {
    updateInviteFinished(true)
    return
  }
  const resp: IAgentInviteeList[] = data[getAgentCenterInviteDetailKeyByModalType(currentModalTab)] || []
  const nList = isRefresh || (!isRefresh && inviteDetailForm?.pageNum === 1) ? resp : [...inviteList, ...resp]
  updateInviteList(nList)
  updateInviteFinished((params?.pageNum || 1) >= data?.pageTotal)
  updateInviteDetailForm({
    pageNum: isRefresh ? 1 : inviteDetailForm?.pageNum && inviteDetailForm?.pageNum + 1,
  })
}

/**
 * 查询收益详情
 */
export const onGetAgentCenterRebateDetail = async (isRefresh = false) => {
  const {
    currentModalTab,
    rebateDetailForm,
    rebateList,
    updateRebateFinished,
    updateRebateList,
    updateRebateDetailForm,
  } = baseAgentCenterStore.getState()
  if (!currentModalTab) return
  const params = {
    ...rebateDetailForm,
    model: currentModalTab,
    pageNum: isRefresh ? 1 : rebateDetailForm?.pageNum,
  }
  if (!params?.productCd) delete params?.productCd
  if (!params?.rebateLevel) delete params?.rebateLevel
  if (!params?.rebateType) delete params?.rebateType
  if (!params?.startTime) delete params?.startTime
  if (!params?.endTime) delete params?.endTime
  if (!params?.minAmount) delete params?.minAmount
  if (!params?.maxAmount) delete params?.maxAmount
  const res = await postAgentCenterRebateDetail(params)
  const { isOk, data } = res || {}

  if (!isOk || !data) {
    updateRebateFinished(true)
    return
  }
  const resp: IAgentRebateList[] = data[getAgentCenterRebateDetailKeyByModalType(currentModalTab)] || []
  const nList = isRefresh || (!isRefresh && rebateDetailForm?.pageNum === 1) ? resp : [...rebateList, ...resp]
  updateRebateList(nList)
  updateRebateFinished(params?.pageNum >= data?.pageTotal)
  updateRebateDetailForm({
    pageNum: isRefresh ? 1 : rebateDetailForm?.pageNum && rebateDetailForm?.pageNum + 1,
  })
}

/**
 * 代理中心 - 下拉刷新页面
 */
export const onRefreshAgentCenter = () => {
  const { currentModalTab, currentDetailsTab } = baseAgentCenterStore.getState()
  return new Promise(resolve => {
    onGetMemberCurrencyList()
    onGetAgentCenterOverview()
    currentDetailsTab === AgentCenterDetailsTabEnum.invite
      ? onGetAgentCenterInviteDetail(true)
      : onGetAgentCenterRebateDetail(true)
    onGetAgentUserIsBlack()
    currentModalTab === AgentModalTypeEnum.area && onGetAreaAgentLevelList()
    currentDetailsTab === AgentCenterDetailsTabEnum.rebate && onGetAgentCenterProductList()

    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

/**
 * 代理中心 - 结算币种进行汇率换算
 */
export const rateFilterAgent = (amount?: number | string) => {
  const { agentCenterOverview, currentCurrency } = baseAgentCenterStore.getState()

  if (!amount) return formatCurrency(amount || 0, currentCurrency?.offset || 2)

  if (agentCenterOverview?.currencySymbol === currentCurrency?.currencyEnName)
    return formatCurrency(amount, currentCurrency?.offset || 2)

  return rateFilter({
    symbol: agentCenterOverview?.currencySymbol,
    rate: currentCurrency?.currencyEnName,
    amount,
    showUnit: false,
    isFormat: true,
  })
}
