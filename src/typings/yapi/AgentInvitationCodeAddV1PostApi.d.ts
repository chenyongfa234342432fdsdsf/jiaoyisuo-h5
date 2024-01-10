/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [代理商-管理邀请码添加↗](https://yapi.nbttfc365.com/project/44/interface/api/4287) 的 **请求类型**
 *
 * @分类 [代理商↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_541)
 * @请求头 `POST /v1/agent/invitationCode/add`
 * @更新时间 `2023-08-18 16:31:58`
 */
export interface YapiPostV1AgentInvitationCodeAddApiRequest {
  /**
   * 邀请码名称
   */
  invitationCodeName: string
  /**
   * 现货自身
   */
  spotSelfRate: string
  /**
   * 现货好友
   */
  spotChildRate: string
  /**
   * 合约自身
   */
  contractSelfRate: string
  /**
   * 合约好友
   */
  contractChildRate: string
  /**
   * 合约自身
   */
  borrowCoinSelfRate: string
  /**
   * 合约好友
   */
  borrowCoinChildRate: string
  /**
   * 三元期权自身
   */
  optionSelfRate: string
  /**
   * 三元期权好友
   */
  optionChildRate: string
  /**
   * 娱乐区自身
   */
  recreationSelfRate: string
  /**
   * 娱乐区好友
   */
  recreationChildRate: string
  /**
   * 是否默认邀请码: 1是2否
   */
  isDefault: string
}

/**
 * 接口 [代理商-管理邀请码添加↗](https://yapi.nbttfc365.com/project/44/interface/api/4287) 的 **返回类型**
 *
 * @分类 [代理商↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_541)
 * @请求头 `POST /v1/agent/invitationCode/add`
 * @更新时间 `2023-08-18 16:31:58`
 */
export interface YapiPostV1AgentInvitationCodeAddApiResponse {}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [代理商-管理邀请码添加↗](https://yapi.nbttfc365.com/project/44/interface/api/4287)
// **/
// export const postV1AgentInvitationCodeAddApiRequest: MarkcoinRequest<
//   YapiPostV1AgentInvitationCodeAddApiRequest,
//   YapiPostV1AgentInvitationCodeAddApiResponse['data']
// > = data => {
//   return request({
//     path: "/v1/agent/invitationCode/add",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */
