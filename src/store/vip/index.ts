import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import cacheUtils from 'store'
import {
  getV1ChainStarGetDynamicNavigationApiRequest,
  getV1MemberVipBaseAvatarListApiRequest,
  getV1MemberVipBaseBenefitListApiRequest,
  getV1MemberVipBaseInfoApiRequest,
} from '@/apis/vip'
import { YapiGetV1MemberVipBaseBenefitListData } from '@/typings/yapi/MemberVipBaseBenefitListV1GetApi'
import { YapiGetV1MemberVipBaseAvatarListData } from '@/typings/yapi/MemberVipBaseAvatarListV1GetApi'
import { YapiGetV1ChainStarGetDynamicNavigationData } from '@/typings/yapi/ChainStarGetDynamicNavigationV1GetApi'
import { YapiGetV1MemberVipBaseInfoApiResponse } from '@/typings/yapi/MemberVipBaseInfoV1GetApi'

type IStore = ReturnType<typeof getStore>

const menulist = 'MENU_LIST'

const vipBaseInfo = 'VIP_BASE_INFO'

function getVipRightsListStore(set) {
  return {
    vipRightsList: <Array<YapiGetV1MemberVipBaseBenefitListData>>[],
    async getVipRightsList() {
      const res = await getV1MemberVipBaseBenefitListApiRequest({})
      if (res.isOk && res.data) {
        set(
          produce((store: IStore) => {
            store.vipRightsList = res.data || []
          })
        )
      }
    },
  }
}

function getVipAvatarListStore(set) {
  return {
    vipAvatarList: <Array<YapiGetV1MemberVipBaseAvatarListData>>[],
    async getVipAvatarList() {
      const res = await getV1MemberVipBaseAvatarListApiRequest({})
      if (res.isOk && res.data) {
        set(
          produce((store: IStore) => {
            store.vipAvatarList = res.data || []
          })
        )
      }
    },
  }
}

function getDerivativeMenuStore(set) {
  return {
    menulist: cacheUtils.get(menulist) || <Array<YapiGetV1ChainStarGetDynamicNavigationData>>[],
    async getDerivativeMenu() {
      const res: any = await getV1ChainStarGetDynamicNavigationApiRequest({ type: '1' })
      if (res.isOk && res.data) {
        set(
          produce((store: IStore) => {
            store.menulist =
              res.data?.map(i => ({
                ...i,
                title: i?.name,
                desc: i?.describe,
                icon: i.url,
              })) || []
            cacheUtils.set(menulist, res.data)
          })
        )
      }
    },
  }
}

function getVipBaseInfoStore(set) {
  return {
    vipBaseInfo: cacheUtils.get(vipBaseInfo) || <YapiGetV1MemberVipBaseInfoApiResponse>{},
    async getVipBaseInfo() {
      const res = await getV1MemberVipBaseInfoApiRequest({})
      if (res.isOk && res.data) {
        set(
          produce((store: IStore) => {
            store.vipBaseInfo = res.data
            cacheUtils.set(vipBaseInfo, res.data)
          })
        )
      }
    },
    clearVipBaseInfo() {
      set((store: IStore) => {
        return produce(store, _store => {
          _store.vipBaseInfo = {}
          cacheUtils.set(vipBaseInfo, {})
        })
      })
    },
  }
}

function getStore(set) {
  return {
    ...getVipRightsListStore(set),
    ...getVipAvatarListStore(set),
    ...getDerivativeMenuStore(set),
    ...getVipBaseInfoStore(set),
  }
}

const baseVipCenterStore = create(subscribeWithSelector(getStore))

const useVipCenterStore = createTrackedSelector(baseVipCenterStore)

export { useVipCenterStore, baseVipCenterStore }
