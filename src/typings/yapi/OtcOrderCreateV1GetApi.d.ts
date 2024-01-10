/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [FTTPAY下单接口↗](https://yapi.nbttfc365.com/project/44/interface/api/20663) 的 **请求类型**
 *
 * @分类 [OTC接口↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1052)
 * @请求头 `GET /v1/otc/order/create`
 * @更新时间 `2023-12-12 15:31:55`
 */
export interface YapiGetV1OtcOrderCreateApiRequest {
  /**
   * 三方订单id
   */
  payOrderId: string
}

/**
 * 接口 [FTTPAY下单接口↗](https://yapi.nbttfc365.com/project/44/interface/api/20663) 的 **返回类型**
 *
 * @分类 [OTC接口↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1052)
 * @请求头 `GET /v1/otc/order/create`
 * @更新时间 `2023-12-12 15:31:55`
 */
export interface YapiGetV1OtcOrderCreateApiResponse {}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [FTTPAY下单接口↗](https://yapi.nbttfc365.com/project/44/interface/api/20663)
// **/
// export const getV1OtcOrderCreateApiRequest: MarkcoinRequest<
//   YapiGetV1OtcOrderCreateApiRequest,
//   YapiGetV1OtcOrderCreateApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/otc/order/create",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */
