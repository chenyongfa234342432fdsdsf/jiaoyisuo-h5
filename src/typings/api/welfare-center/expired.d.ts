
import { exchangeListItem } from "./all-voucher"
export interface GetTypeSceneListRequest{
    codeVal?: string
}
export interface GetTypeSceneListResponse{
    // 劵类型
    codeVal: string
    list?: Array<{
        // 适用场景
        businessScene?: string
        // 子券类型
        subCodeVal: string
        // 券类型
        codeVal: string
    }>

}

export interface GetUsedInfoResponse extends exchangeListItem{

}

export interface GetUsedInfoRequest {
    /** 卡劵 id */
    id: string
}