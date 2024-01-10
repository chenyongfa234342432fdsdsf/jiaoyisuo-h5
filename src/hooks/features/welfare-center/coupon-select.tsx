/**
 * 卡券选择
 */
import { getVipCouponList } from '@/apis/welfare-center/all-voucher'
import { useUserStore } from '@/store/user'
import { useBaseWelfareCenter } from '@/store/welfare-center'
import { VipCouponListResp } from '@/typings/api/welfare-center/all-voucher'
import { useMount, useRequest, useUpdateEffect } from 'ahooks'
import { useEffect } from 'react'

/**
 * 获取我的卡券列表
 * @param businessScene 卡券场景 ScenesBeUsedEnum
 */
export function useGetCouponSelectList(businessScene: string) {
  const { isLogin } = useUserStore()
  const {
    welfareCenterDictionaryEnum,
    fetchWelfareCenterDictionaryEnums,
    isRefreshCouponSelectApi,
    updateCouponData,
    updateIsRefreshCouponSelectApi,
  } = useBaseWelfareCenter() || {}

  const { run: getCouponSelectList } = useRequest(
    async () => {
      const res = await getVipCouponList({
        businessScene,
      })
      const { isOk, data } = res || {}
      if (!isOk || !data) {
        updateCouponData({} as VipCouponListResp)
        return
      }
      updateCouponData(data)
      updateIsRefreshCouponSelectApi(false)
    },
    { manual: true }
  )

  useMount(() => {
    !welfareCenterDictionaryEnum?.voucherSceneEnum?.enums?.length && fetchWelfareCenterDictionaryEnums()
  })

  useEffect(() => {
    if (!isLogin) {
      updateCouponData({} as VipCouponListResp)
      return
    }
    getCouponSelectList()
  }, [isLogin])

  useUpdateEffect(() => {
    if (isRefreshCouponSelectApi) getCouponSelectList()
  }, [isRefreshCouponSelectApi])
}
