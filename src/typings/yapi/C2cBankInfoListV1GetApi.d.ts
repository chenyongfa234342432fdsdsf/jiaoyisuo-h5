/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [银行列表↗](https://yapi.nbttfc365.com/project/44/interface/api/20782) 的 **请求类型**
 *
 * @分类 [收付方式↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_568)
 * @请求头 `GET /v1/c2c/bankInfo/list`
 * @更新时间 `2023-12-14 15:31:40`
 */
export interface YapiGetV1C2cBankInfoListApiRequest {
  /**
   * 区域id
   */
  areaId: string
}

/**
 * 接口 [银行列表↗](https://yapi.nbttfc365.com/project/44/interface/api/20782) 的 **返回类型**
 *
 * @分类 [收付方式↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_568)
 * @请求头 `GET /v1/c2c/bankInfo/list`
 * @更新时间 `2023-12-14 15:31:40`
 */
export interface YapiGetV1C2cBankInfoListApiResponse {}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [银行列表↗](https://yapi.nbttfc365.com/project/44/interface/api/20782)
// **/
// export const getV1C2cBankInfoListApiRequest: MarkcoinRequest<
//   YapiGetV1C2cBankInfoListApiRequest,
//   YapiGetV1C2cBankInfoListApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/c2c/bankInfo/list",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */
