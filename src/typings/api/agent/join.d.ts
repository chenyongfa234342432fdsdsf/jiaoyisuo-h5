
export interface GetAgtContractInfoResponse {
/** 
 * 手机号
 */
mobile: string
/** 
 * 手机区号
 */
mobileCountryCd: string
/** 
 * 邮箱
 */
email: string
/** 
 * 区号国旗标识
 */
remark: string
}

export interface GetAgtContractInfoRequest {}

export interface PostAgtApplyRequest {
    /**
     * 联系类型  1 为手机 2 为邮箱
     */
    contact: string
    /**
     * 联系方式
     */
    contactInformation: string
    /**
     * 申请补充说明
     */
    content?: string
    /**
     * 手机区号，contact 为 1 时必传
     */
    mobileCountryCd?: string
    /**
     * 社交媒体账户
     */
    socialMediaInfo: string
    /** 
     * 社交媒体
     */
    socialMedia: string
}