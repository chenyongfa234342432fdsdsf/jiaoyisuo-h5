/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [修改仓位杠杆倍数↗](https://yapi.nbttfc365.com/project/44/interface/api/5674) 的 **请求类型**
 *
 * @分类 [资产-合约组接口↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_538)
 * @请求头 `POST /v1/perpetual/position/modifyLever`
 * @更新时间 `2023-05-11 17:11:32`
 */
export interface YapiPostV1PerpetualPositionModifyLeverApiRequest {
  /**
   * 合约组id
   */
  groupId: string
  /**
   * 仓位Id
   */
  positionId: string
  /**
   * 杠杆倍数
   */
  lever: string
}

/**
 * 接口 [修改仓位杠杆倍数↗](https://yapi.nbttfc365.com/project/44/interface/api/5674) 的 **返回类型**
 *
 * @分类 [资产-合约组接口↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_538)
 * @请求头 `POST /v1/perpetual/position/modifyLever`
 * @更新时间 `2023-05-11 17:11:32`
 */
export interface YapiPostV1PerpetualPositionModifyLeverApiResponse {
  code: number
  msg: string
  data: YapiPostV1PerpetualPositionModifyLeverData
}
export interface YapiPostV1PerpetualPositionModifyLeverData {
  isSuccess: boolean
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [修改仓位杠杆倍数↗](https://yapi.nbttfc365.com/project/44/interface/api/5674)
// **/
// export const postV1PerpetualPositionModifyLeverApiRequest: MarkcoinRequest<
//   YapiPostV1PerpetualPositionModifyLeverApiRequest,
//   YapiPostV1PerpetualPositionModifyLeverApiResponse['data']
// > = data => {
//   return request({
//     path: "/v1/perpetual/position/modifyLever",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */
