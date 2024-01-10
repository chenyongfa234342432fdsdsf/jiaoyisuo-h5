import {
  GetInvitationCodeListRequest,
  GetInvitationCodeListResponse,
  GetInvitedPeopleListResponse,
  GetInvitedPeopleListRequest,
  GetProductMaxRatioResponse,
  PostEditInvitationCodeNameRequest,
  PostSetDefaultInvitationCodeRequest,
  PostAddInvitationCodeRequest,
  postIsBlackUserRequest,
  postIsBlackUserResponse,
  GetProductMaxRatiaRequest,
  getSloganResponse,
  getSloganRequest,
} from '@/typings/api/agent/manage'
import request, { MarkcoinRequest } from '@/plugins/request'

/**
 * [查询邀请码列表 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18379)
 * */
export const getInvitationCodeList: MarkcoinRequest<
  GetInvitationCodeListRequest,
  GetInvitationCodeListResponse
> = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/list',
    method: 'GET',
    params: data,
  })
}

/**
 * [邀请码邀请的好友列表 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18384)
 */
export const getInvitedPeopleList: MarkcoinRequest<
  GetInvitedPeopleListRequest,
  GetInvitedPeopleListResponse
> = params => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/invitedPeople',
    method: 'GET',
    params,
  })
}

/**
 * [查询金字塔最大可调整返佣比例 ↗]（https://yapi.nbttfc365.com/project/44/interface/api/18504）
 */
export const GetProductMaxRatia: MarkcoinRequest<GetProductMaxRatiaRequest, GetProductMaxRatioResponse> = data => {
  return request({
    path: '/v1/agent/pyramid/product/ratio',
    method: 'GET',
    params: data,
  })
}
/**
 * [添加新邀请码 ↗]（https://yapi.nbttfc365.com/project/44/interface/api/18409）
 */
export const PostAddInvitationCode: MarkcoinRequest<PostAddInvitationCodeRequest> = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/add',
    method: 'POST',
    data,
  })
}
/**
 * [修改邀请码好友返佣比例 ↗]（https://yapi.nbttfc365.com/project/44/interface/api/18404）
 */
export const PostEditInvitationCodeRatio: MarkcoinRequest<PostAddInvitationCodeRequest> = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/ratio',
    method: 'POST',
    data,
  })
}
/**
 * [修改邀请码名称 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18389)
 */
export const PostEditInvitationCodeName: MarkcoinRequest<PostEditInvitationCodeNameRequest> = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/modifyName',
    method: 'POST',
    data,
  })
}
/**
 * [设置默认邀请码 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18399)
 */
export const PostSetDefaultInvitationCode: MarkcoinRequest<PostSetDefaultInvitationCodeRequest> = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/default',
    method: 'POST',
    data,
  })
}
/**
 * [删除邀请码 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18414)
 */
export const PostDelInvitationCode: MarkcoinRequest<PostSetDefaultInvitationCodeRequest> = data => {
  return request({
    path: '/v1/agent/pyramid/invitationCode/delete',
    method: 'POST',
    data,
  })
}
/**
 * [是否黑名单用户查询 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18194)
 */
export const postIsBlackUser: MarkcoinRequest<postIsBlackUserRequest, postIsBlackUserResponse> = data => {
  return request({
    path: '/v1/agent/user/checkBlacklist',
    method: 'GET',
    data,
  })
}

/**
 * [查询分享海报文案 ↗](https://yapi.nbttfc365.com/project/44/interface/api/18554)
 */
export const getSlogan: MarkcoinRequest<getSloganRequest, getSloganResponse> = data => {
  return request({
    path: '/v1/agent/slogan',
    method: 'GET',
    data,
  })
}
