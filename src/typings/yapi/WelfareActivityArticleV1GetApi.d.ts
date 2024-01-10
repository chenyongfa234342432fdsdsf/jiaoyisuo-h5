/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [根据article获取用户活动参与数据↗](https://yapi.nbttfc365.com/project/44/interface/api/20495) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/activity/article`
 * @更新时间 `2023-12-13 14:37:32`
 */
export interface YapiGetV1WelfareActivityArticleApiRequest {
  /**
   * 文章ID
   */
  article: string
}

/**
 * 接口 [根据article获取用户活动参与数据↗](https://yapi.nbttfc365.com/project/44/interface/api/20495) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/activity/article`
 * @更新时间 `2023-12-13 14:37:32`
 */
export interface YapiGetV1WelfareActivityArticleApiResponse {
  /**
   * 200成功
   */
  code: number
  /**
   * 描述
   */
  message: string
  data: YapiGetV1WelfareActivityArticleListData[]
}
export interface YapiGetV1WelfareActivityArticleListData {
  /**
   * 活动ID
   */
  activityId: string
  /**
   * 活动名称
   */
  activityName: string
  /**
   * 截止日期，13位毫秒值
   */
  expirationTime: number
  /**
   * 见字典 welfare_activity_status_code
   */
  status: string
  /**
   * 活动链接
   */
  activityUrl: string
  /**
   * web封面地址
   */
  webCoverUrl: string
  /**
   * H5 APP 封面地址
   */
  h5CoverUrl: string
  /**
   * 用户是否参与活动，true 已参与 false未参与
   */
  join: boolean
  /**
   * 是否可以报名，存在活动在线且不能报名
   */
  doApply: boolean
  /**
   * 共用活动字典 not_started processing ends
   */
  applyStatus: string
  /**
   * 13位时间，活动开始时间
   */
  startTime: number
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [根据article获取用户活动参与数据↗](https://yapi.nbttfc365.com/project/44/interface/api/20495)
// **/
// export const getV1WelfareActivityArticleApiRequest: MarkcoinRequest<
//   YapiGetV1WelfareActivityArticleApiRequest,
//   YapiGetV1WelfareActivityArticleApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/welfare/activity/article",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */
