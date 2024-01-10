export interface GetAgtApplyInfoResponse {
    /** 
     * 是否显示申请金字塔代理商模式的 banner; true=显示，false=不显示
     */
    showBanner: boolean
    /** 
     * 申请状态：-1=未申请，0=审核中，1=申请通过，2=申请未通过
     */
    applyStatus: string | number
    /** 
     * 拒绝原因，申请不通过时取该值
     */
    rejectReason: string 
}
export interface GetAgtApplyInfoRequest{
    
}

export interface PostResultReadRequest{

}
export interface PostResultReadResponse{

}