

/** 
 * 查询邀请码列表接口请求和相应定义
 */
export type ProductsItemType = {
    /**  
     * 产品线：1=现货，2=合约，3=借币，4=三元期权，5=娱乐区
    */
    productCd: string | number,
    /** 
     * 自身返佣比例
     */
    selfRatio: number | string
    /** 
     * 好友返佣比例
     */
    childRatio?: number | string
}
export type InviteCodeListItem = {
    id: number | string,
    /**  
     * 邀请码
    */
    invitationCode: string,
    /** 
     * 名称
     */
    name: string,
    /** 
     * 是否默认邀请码
     * 1=默认邀请码，2=非默认邀请码
    */
    isDefault: number,
    /**  
     * 好友数
    */
    invitedNum: number,
    /**  
     * 创建时间
    */
    createdByTime: number
    /**  
     * 产品线返佣
    */
    products: ProductsItemType[]
}
export interface GetInvitationCodeListResponse {
    /** 
     * 金字塔返邀请码信息
     */
    list: InviteCodeListItem[]
    /** 
     * 分享海报
     */
    slogan: string
    /** 
     * 当前页
     */
    pageNum: number
    /** 
     * 当前页条数
     */
    pageSize: number,
    /** 
     * 总条数
    */
    total: number
}   
export interface GetInvitationCodeListRequest{
  /** 
   * 当前页
   */ 
  pageNum: number,
  /** 
   * 当前页条数
   */
  pageSize: number
}
/** 
 * 邀请码邀请的好友列表接口请求和相应定义
 */
export type InvitedPeopleListItem = {
    /**  
     * 好友 ID
    */
    invitedUid: number
    /**  
     * 邀请时间
    */
    createdByTime: number
}
export interface GetInvitedPeopleListResponse{
    /** 
     * 邀请的好友列表
     */
    list: InvitedPeopleListItem[]
}
export interface GetInvitedPeopleListRequest{
    /**  
     * 邀请码
    */
    invitationCode: string
}


export interface GetProductMaxRatioResponse {
    /** 
     * 产品线
     */
    products: ProductsItemType[]
}
export interface PostAddInvitationCodeRequest {
    /**  
     * 名称
    */
   name: string
   /**  
    * 是否设置为默认值 1=设置为默认，2=非默认
   */
  isDefault: number
  /**  
   * 分配比例
  */
  ratios: ProductsItemType[]
}
export interface PostEditInvitationCodeNameRequest{
    /** 
     * 邀请码名称
    */
   name: string
   /**  
    * 邀请码 ID
   */
   invitationCodeId: number | string
}

export interface PostSetDefaultInvitationCodeRequest{
    /**  
    * 邀请码 ID
   */
      invitationCodeId: number | string 
}

export interface postIsBlackUserRequest{

}
export interface postIsBlackUserResponse{
    /** 
     * 用户 id
    */
   uid: string
   /**  
    * 拉黑原因
   */
   reason: string
   /**  
    * 是否拉黑
   */
   inBlacklist: boolean
}

export type GetProductMaxRatiaRequest = {}

export interface getSloganRequest  {}

export interface getSloganResponse  {
    slogan: string
}