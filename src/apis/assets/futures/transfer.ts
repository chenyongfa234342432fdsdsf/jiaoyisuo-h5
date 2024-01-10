/**
 * 资金划转
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  PerpetualAssetsTransferAccountReq,
  PerpetualAssetsTransferAccountResp,
  PerpetualAssetsTransferCurrencyReq,
  PerpetualAssetsTransferCurrencyResp,
  PerpetualAssetsTransferReq,
  PerpetualAssetsTransferResp,
} from '@/typings/api/assets/futures'

/**
 * 获取划转账户选择列表
 */
export const getPerpetualAssetsTransferAccount: MarkcoinRequest<
  PerpetualAssetsTransferAccountReq,
  PerpetualAssetsTransferAccountResp
> = params => {
  return request({
    path: `/v1/perpetual/assets/transfer/account`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组保证金划转
 */
export const postPerpetualAssetsTransfer: MarkcoinRequest<
  PerpetualAssetsTransferReq,
  PerpetualAssetsTransferResp
> = data => {
  return request({
    path: `/v1/perpetual/assets/transfer`,
    method: 'POST',
    data,
  })
}

/**
 * 划转币种信息
 */
export const getPerpetualAssetsTransferCurrency: MarkcoinRequest<
  PerpetualAssetsTransferCurrencyReq,
  PerpetualAssetsTransferCurrencyResp
> = params => {
  return request({
    path: `/v1/perpetual/group/margin/coin/info`,
    method: 'GET',
    params,
  })
}
