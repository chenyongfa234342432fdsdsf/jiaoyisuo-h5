/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [(后台接口)冻结资金_inner↗](https://yapi.nbttfc365.com/project/44/interface/api/2696) 的 **请求类型**
 *
 * @分类 [资产、充值提现↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_182)
 * @请求头 `POST /inner/v1/balance/lock`
 * @更新时间 `2023-03-03 16:38:26`
 */
export interface YapiPostInnerV1BalanceLockApiRequest {
  /**
   * uid
   */
  uid: number
  /**
   * 商户id
   */
  businessId: number
  /**
   * 币种id
   */
  coinId: number
  /**
   * 数量
   */
  amount: string
  /**
   * 财务类型 1 下单冻结, 2 订单成交扣除, 3 成交成交到账, 4 币币手续费, 5 借款手续费, 6 借款冻结, 7 借款手续费, 8 还款手续费, 9 还款解冻, 10 借款, 11 充值冻结，12 充值到账， 13 提现冻结， 14 撤销提现解冻， 15 提现成功扣款'
   */
  reason: number
  /**
   * 业务id
   */
  srcId: number
  /**
   * 唯一健，业务类型+唯一号
   */
  uuid: string
}

/**
 * 接口 [(后台接口)冻结资金_inner↗](https://yapi.nbttfc365.com/project/44/interface/api/2696) 的 **返回类型**
 *
 * @分类 [资产、充值提现↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_182)
 * @请求头 `POST /inner/v1/balance/lock`
 * @更新时间 `2023-03-03 16:38:26`
 */
export interface YapiPostInnerV1BalanceLockApiResponse {
  isSuccess?: boolean
  msg?: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [(后台接口)冻结资金_inner↗](https://yapi.nbttfc365.com/project/44/interface/api/2696)
// **/
// export const postInnerV1BalanceLockApiRequest: MarkcoinRequest<
//   YapiPostInnerV1BalanceLockApiRequest,
//   YapiPostInnerV1BalanceLockApiResponse['data']
// > = data => {
//   return request({
//     path: "/inner/v1/balance/lock",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */