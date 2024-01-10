/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [绑定手机验证↗](https://yapi.nbttfc365.com/project/44/interface/api/154) 的 **请求类型**
 *
 * @分类 [用户中心↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_85)
 * @请求头 `POST /v1/member/safe/mobile/bind`
 * @更新时间 `2022-10-26 10:17:11`
 */
export interface YapiPostV1MemberSafeMobileBindApiRequest {
  /**
   * 区号
   */
  mobileCountryCode: string
  /**
   * 手机号码
   */
  mobileNumber: string
  /**
   * 验证码
   */
  verifyCode: string
  /**
   * 类型 12 =绑定手机号码
   */
  operateType: number
}

/**
 * 接口 [绑定手机验证↗](https://yapi.nbttfc365.com/project/44/interface/api/154) 的 **返回类型**
 *
 * @分类 [用户中心↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_85)
 * @请求头 `POST /v1/member/safe/mobile/bind`
 * @更新时间 `2022-10-26 10:17:11`
 */
export interface YapiPostV1MemberSafeMobileBindApiResponse {
  /**
   * 请求是否成功
   */
  code?: number
  data?: YapiPostV1MemberSafeMobileBindData
  /**
   * 提示
   */
  message?: string
}
/**
 * 数据集
 */
export interface YapiPostV1MemberSafeMobileBindData {
  /**
   * 绑定是否成功
   */
  isSuccess?: boolean
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [绑定手机验证↗](https://yapi.nbttfc365.com/project/44/interface/api/154)
// **/
// export const postV1MemberSafeMobileBindApiRequest: MarkcoinRequest<
//   YapiPostV1MemberSafeMobileBindApiRequest,
//   YapiPostV1MemberSafeMobileBindApiResponse['data']
// > = data => {
//   return request({
//     path: "/v1/member/safe/mobile/bind",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */
