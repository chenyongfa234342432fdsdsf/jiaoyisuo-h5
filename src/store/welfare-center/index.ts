import { create } from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import produce from 'immer'
import { devtools } from 'zustand/middleware'
import { IStoreEnum } from '@/typings/store/common'
import { DictionaryTypeEnum } from '@/constants/welfare-center/common'
import { getCodeDetailListBatch } from '@/apis/common'
import { getCouponCount } from '@/apis/welfare-center/all-voucher'
import { GetCouponCountResponse, VipCouponListResp } from '@/typings/api/welfare-center/all-voucher'

type IStore = ReturnType<typeof getStore>

function getStore(set, get) {
  return {
    /** 卡劵数据字典 */
    welfareCenterDictionaryEnum: {
      /** 卡劵类型 */
      voucherTypeEnum: {
        codeKey: DictionaryTypeEnum.voucherType,
        enums: [],
      } as IStoreEnum,
      /** 卡劵使用场景 */
      voucherSceneEnum: {
        codeKey: DictionaryTypeEnum.voucherScene,
        enums: [],
      } as IStoreEnum,
      /** 卡劵名称 */
      voucherName: {
        codeKey: DictionaryTypeEnum.voucherName,
        enums: [],
      } as IStoreEnum,
      /** 卡劵分类 */
      voucherTypeClassification: {
        codeKey: DictionaryTypeEnum.voucherTypeClassification,
        enums: [],
      } as IStoreEnum,
      /** 交易场景二级场景 */
      voucherBusinessLine: {
        codeKey: DictionaryTypeEnum.voucherBusinessLine,
        enums: [],
      } as IStoreEnum,
      /** 交易类型 */
      voucherBusinessType: {
        codeKey: DictionaryTypeEnum.voucherBusinessType,
        enums: [],
      } as IStoreEnum,
    },
    // 卡劵中心数据
    voucherCenterData: {
      voucherCountInfo: {} as GetCouponCountResponse,
      // 全部卡劵是否有新卡劵
      hasNew: false,
    },
    // 获取卡劵数量信息
    async fetchCouponCount() {
      const data = await getCouponCount({})
      set(
        produce((draft: IStore) => {
          draft.voucherCenterData.voucherCountInfo = data.data as GetCouponCountResponse
        })
      )
    },
    // 修改全部卡劵小红点标记
    setHasNew(hasNew: boolean) {
      set(
        produce((draft: IStore) => {
          draft.voucherCenterData.hasNew = hasNew
        })
      )
    },
    /** 获取福利中心卡劵数据字典 */
    async fetchWelfareCenterDictionaryEnums() {
      const state: IStore = get()
      const data = await getCodeDetailListBatch(
        Object.values(state.welfareCenterDictionaryEnum).map(item => item.codeKey)
      )
      set(
        produce((draft: IStore) => {
          const items = Object.values(draft.welfareCenterDictionaryEnum)
          items.forEach((item, index) => {
            item.enums = data[index]?.map(enumValue => {
              return {
                label: enumValue.codeKey,
                value:
                  parseInt(enumValue.codeVal, 10).toString() === enumValue.codeVal
                    ? parseInt(enumValue.codeVal, 10)
                    : enumValue.codeVal,
              }
            })
          })
        })
      )
    },
    /** 是否需要刷新卡券选择组件 */
    isRefreshCouponSelectApi: false,
    updateIsRefreshCouponSelectApi: (newIsRefreshCouponSelectApi: boolean) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.isRefreshCouponSelectApi = newIsRefreshCouponSelectApi
        })
      }),
    /** 卡券信息 */
    couponData: {} as VipCouponListResp,
    updateCouponData: (newCouponData: VipCouponListResp) =>
      set((store: IStore) => {
        return produce(store, _store => {
          _store.couponData = newCouponData
        })
      }),
  }
}

const baseWelfareCenter = create(devtools(getStore, { name: 'welfare-center' }))

const useBaseWelfareCenter = createTrackedSelector(baseWelfareCenter)

export { useBaseWelfareCenter, baseWelfareCenter }
