import { FinancialRecordRouteEnum, setFinancialRecordRoute } from '@/constants/assets'
import { AssetsTransferTypeEnum } from '@/constants/assets/common'
import { baseAssetsStore } from '@/store/assets/spot'

/**
 * 资产 - 提币
 * @param type 提币类型 AssetsWithdrawTypeEnum.platform 站内 AssetsWithdrawTypeEnum.blockchain 站外
 * @param id 币种 coinId
 */
export function getAssetsWithdrawPageRoutePath(id?: string) {
  let url = `/assets/withdraw`
  if (id) url += `?id=${id}`
  return url
}

/**
 * 资产 - 充币
 * @param id 币种 coinId
 */
export function getAssetsRechargePageRoutePath(id?: string) {
  let url = `/assets/recharge`
  if (id) url += `?id=${id}`
  return url
}

/**
 * 资产 - 首页
 * @param type 资产 tab 类型 AssetsRouteEnum
 */
export function getAssetsPageRoutePath(type?: number) {
  let url = `/assets`
  if (type) url += `?type=${type}`
  return url
}
/**
 * 资产 - 财务记录
 * @param logType 财务记录 tab 类型  AssetsRouteEnum
 * @param type 财务记录类型 AssetsRecordTypeEnum
 * @param coinId 币种 ID
 */
export function getAssetsHistoryPageRoutePath(logType?: number, type?: number, coinId?: string, coinName?: string) {
  let url = `/assets/financial-record`
  if (logType) url += `?logType=${logType}`
  if (type) url += `&type=${type}`

  const { assetsRecord, updateAssetsRecord } = baseAssetsStore.getState().recordModule
  if (coinId) {
    const activeTab = setFinancialRecordRoute(logType) || FinancialRecordRouteEnum.main
    updateAssetsRecord({ ...assetsRecord[activeTab], coinId, coinName }, activeTab)
  }

  return url
}

/**
 * 资产 - 财务记录详情
 * @param id 财务记录 ID
 * @param type 财务记录类型
 * @param page 来源页面类型 AssetsHistoryPageTypeEnum
 */
export function getAssetsHistoryDetailPageRoutePath({
  id,
  type,
  page,
  amount,
}: {
  id: string
  type?: number
  page?: string
  amount?: string
}) {
  let url = `/assets/financial-record/detail`
  if (id) url += `?id=${id}`
  if (type) url += `&type=${type}`
  if (page) url += `&page=${page}`
  if (amount) url += `&amount=${amount}`

  return url
}

/**
 * 资产 - 币种详情
 * @param id 币种 coinId
 */
export function getAssetsCoinDetailPageRoutePath(id: string) {
  return `/assets/coin-details?id=${id}`
}

/**
 * 资产 - 开通合约账户
 */
export function getAssetsOpenFuturesAccountPageRoutePath() {
  return `/assets/open/futures/account`
}

/**
 * 资产 - 合约详情
 * @param id 合约 id
 * @param length 合约列表长度
 */
export function getAssetsFuturesDetailPageRoutePath(id: string) {
  return `/assets/futures/details/${id}`
}

/**
 * 资产 - 合约资金划转
 * @param id 逐仓 ID
 * @param type 划转类型 AssetsTransferTypeEnum
 * @param symbol 币种代码
 * @param coinId 币种 ID
 */
export function getAssetsFuturesTransferPageRoutePath({
  groupId = '',
  type = AssetsTransferTypeEnum.to,
  coinId = '',
  symbol = '',
}: {
  groupId: string
  type?: string
  coinId?: string
  symbol?: string
}) {
  let url = `/assets/futures/transfer?groupId=${groupId}&type=${type}`
  if (coinId) url += `&coinId=${coinId}`
  if (symbol) url += `&symbol=${symbol}`

  return url
}

/**
 * 资产 - 持仓页面
 */
export function getAssetsHistoryPositionPageRoutePath() {
  return `/assets/futures/position`
}

/**
 * 资产 - 历史仓位详情
 */
export function getAssetsHistoryPositionDetailPageRoutePath() {
  return `/assets/futures/position/history/details`
}
