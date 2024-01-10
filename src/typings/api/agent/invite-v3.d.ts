import { InviteDetailsUidTypeEnum } from '@/constants/agent/invite'

export type productListItemType = {
    productId: string,
    productName: string
}
export type PostProductListResponse = Array<string>
export interface PostProductListRequest {
}

export interface GetDetailListRequest{
    /** 
     * 模式 
     * */
    model: string | number
    /** 
     * uid 
     * */
    uid?: string | number
    /** 
     * 产品线
     */
    productCd?: string | number
    /** 
     * 区域等级
    */
    areaLevel?: string | number
    /** 
     * 团队人数 (低)/邀请人数
    */
    inviteNumMin?: number | string
    /** 
     * 团队人数 (高)/邀请人数
    */
    inviteNumMax?: number | string
    /** 
     * 注册时间 (起)
    */
    startTime: number
    /** 
     * 注册时间 (止)
    */
    endTime: number
    /** 
     * 当前页页码
    */
    pageNum: number
    /** 
     * 每页条数
    */
    pageSize: number
    /** 
     * 查询 uid 类型  1 查询用户 uid，2 查询上级 uid
     */
    queryUidType: number
    /** 父级 uid */
    parentUid?: string | number
}
type DetailListItemComType = {
    productCd: string
    uid: number
    parentUid: number
}
export type AreaAgentUserDetailListItemType = {

}
export interface GetDetailListResponse{
    /** 
     * 区域代理
     */
    areaAgentUserDetailList: []
    /** 
     * 金字塔代理列表
     */
    pyramidAgentUserDetailList: []
    /** 
     * 三级代理
     */
    threeLevelUserDetailList: []
    /** 
     * 总条数
     */
    total: number
    /** 币种 */
    currencySymbol: string
}

export type getAgentListResponse = Array<string>

export type getAreaAgentLevelRequest = {}

export type getAreaAgentLevelResponse = Array<string>

export type getAgentListRequest = {}